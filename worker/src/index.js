/**
 * Wordle Tamil - words API (date-based, all modes in one call)
 *
 * Endpoints:
 *   GET  /word?date=YYYY-MM-DD  -> word for a specific date, for ALL modes at once (no auth needed)
 *                                   Response: { date, normal: {...}, sentamil: {...}, vadasol?: {...} }
 *                                   `vadasol` is only included when configured for that date - it's
 *                                   optional since it isn't implemented in the UI yet.
 *                                   The caller always supplies the exact date it wants (its own
 *                                   device date) - the server never guesses "today" for word
 *                                   selection, avoiding client/server timezone mismatches. The
 *                                   server only rejects dates too far in the future (using its
 *                                   own clock) as a security boundary.
 *   GET  /words?mode=&date=&from=&to=&last=
 *                                -> list words for one or all modes. Admin only - see
 *                                   ADMIN_HEADER_NAME below. All filters are optional and combine:
 *                                     mode  - restrict to one mode (normal|sentamil|vadasol)
 *                                     date  - a single exact date (YYYY-MM-DD)
 *                                     from/to - an inclusive date range
 *                                     last  - the most recent N dates that have any data
 *                                   `date` takes precedence over `from`/`to`/`last` if given.
 *                                   `last` takes precedence over `from`/`to` if given.
 *                                   With no filters at all, returns everything.
 *                                   Response: { words: [ {date, normal, sentamil, vadasol?}, ... ] }
 *   POST /words                 -> add/update word(s) for one or many dates, for one or more
 *                                   modes at once. Accepts either a single date entry or a bulk
 *                                   batch in the same request body shape:
 *                                     { "date": "2026-07-20", "normal": {...}, "sentamil": {...} }
 *                                   or
 *                                     { "words": [ {date?, normal, sentamil, vadasol?}, ... ] }
 *                                   `date` may be omitted on any entry - the server will assign
 *                                   the next free future date automatically, incrementing by one
 *                                   day per date-less entry (continuing on from whatever date is
 *                                   already the furthest out). Every date across the request
 *                                   (explicit or auto-assigned) must be unique - no two entries
 *                                   may target the same date.
 *                                   Writes are only allowed for dates that are not yet live -
 *                                   i.e. strictly after "today + 1 day" (server clock). This
 *                                   keeps already-played/about-to-be-played words immutable once
 *                                   they've gone live, matching the 1-day read grace period below.
 *                                   Admin only.
 *
 * Admin auth: send the ADMIN_TOKEN secret (set via `wrangler secret put ADMIN_TOKEN`) in the
 * request header named ADMIN_HEADER_NAME below.
 *
 * Valid modes (per date entry): normal | sentamil | vadasol. `normal` and `sentamil` are
 * required on writes; `vadasol` is optional (not yet implemented in the UI).
 * All dates are plain ISO strings 'YYYY-MM-DD'.
 */

const VALID_MODES = ['normal', 'sentamil', 'vadasol'];
const REQUIRED_MODES = ['normal', 'sentamil'];
const TIMEZONE = 'Asia/Kolkata';
const ADMIN_HEADER_NAME = 'X-Admin-Token';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, ' + ADMIN_HEADER_NAME,
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extraHeaders },
  });
}

// Returns 'YYYY-MM-DD' for "now" in TIMEZONE. Used only as a security boundary for the
// future-date guard below, never to decide what "today's word" is - the client always
// supplies the exact date it wants.
function todayDateString() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date());
}

function addDays(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isValidDateString(date) {
  return typeof date === 'string' && DATE_RE.test(date);
}

function isAuthorized(request, env) {
  const providedToken = request.headers.get(ADMIN_HEADER_NAME) || '';
  return Boolean(env.ADMIN_TOKEN) && providedToken.length > 0 && providedToken === env.ADMIN_TOKEN;
}

async function getWordsForDate(db, date) {
  const { results } = await db
    .prepare('SELECT mode, date, word, meaning, usage_html FROM words WHERE date = ?')
    .bind(date)
    .all();
  return results;
}

// Admin listing/retrieval, supporting an optional mode filter combined with exactly one of:
// an exact date, a from/to range, or a "last N dates" filter (falls back to all dates if
// none of date/from/to/last are given).
async function getWordsForAdmin(db, { mode, date, from, to, last }) {
  const modeCondition = mode ? 'mode = ?' : null;
  const modeBinding = mode ? [mode] : [];

  let targetDates = null; // null means "no date restriction beyond from/to"
  if (last) {
    let distinctDatesQuery = 'SELECT DISTINCT date FROM words';
    const distinctBindings = [];
    if (modeCondition) {
      distinctDatesQuery += ' WHERE ' + modeCondition;
      distinctBindings.push(...modeBinding);
    }
    distinctDatesQuery += ' ORDER BY date DESC LIMIT ?';
    distinctBindings.push(last);
    const { results } = await db.prepare(distinctDatesQuery).bind(...distinctBindings).all();
    targetDates = results.map((row) => row.date);
    if (targetDates.length === 0) return [];
  }

  let query = 'SELECT mode, date, word, meaning, usage_html FROM words';
  const conditions = [];
  const bindings = [];
  if (modeCondition) {
    conditions.push(modeCondition);
    bindings.push(...modeBinding);
  }
  if (date) {
    conditions.push('date = ?');
    bindings.push(date);
  } else if (targetDates) {
    conditions.push(`date IN (${targetDates.map(() => '?').join(', ')})`);
    bindings.push(...targetDates);
  } else {
    if (from) {
      conditions.push('date >= ?');
      bindings.push(from);
    }
    if (to) {
      conditions.push('date <= ?');
      bindings.push(to);
    }
  }
  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY date ASC, mode ASC';
  const { results } = await db.prepare(query).bind(...bindings).all();
  return results;
}

// Groups flat rows (one per mode per date) into { date, normal, sentamil, vadasol? } objects,
// keyed and ordered by date.
function groupRowsByDate(rows) {
  const byDate = new Map();
  for (const row of rows) {
    if (!byDate.has(row.date)) byDate.set(row.date, { date: row.date });
    byDate.get(row.date)[row.mode] = { word: row.word, meaning: row.meaning, usageHtml: row.usage_html };
  }
  return Array.from(byDate.values());
}

function buildUpsertStatement(db, mode, date, wordEntry) {
  const word = wordEntry.word;
  const meaning = wordEntry.meaning === undefined ? null : wordEntry.meaning;
  const usageHtml = wordEntry.usageHtml === undefined ? null : wordEntry.usageHtml;
  if (!word || typeof word !== 'string') throw new Error('"word" is required for mode "' + mode + '"');
  return db
    .prepare(
      'INSERT INTO words (mode, date, word, meaning, usage_html) VALUES (?, ?, ?, ?, ?) ' +
        'ON CONFLICT(mode, date) DO UPDATE SET word = excluded.word, meaning = excluded.meaning, usage_html = excluded.usage_html'
    )
    .bind(mode, date, word, meaning, usageHtml);
}

async function getMaxExistingDate(db) {
  const row = await db.prepare('SELECT MAX(date) as maxDate FROM words').first();
  return row && row.maxDate ? row.maxDate : null;
}

// Assigns a date to every entry missing one, incrementing one day at a time starting just
// after the later of (a) the last currently-configured date and (b) the write boundary, so
// auto-assigned dates always land in the future and continue on from what's already there.
// Skips over any date already claimed by another entry in the same request (explicit or
// already-assigned) to guarantee uniqueness.
function assignAutoDates(entries, minEditableDate, maxExistingDate) {
  const usedDates = new Set();
  for (const entry of entries) {
    if (entry.date !== undefined && entry.date !== null) {
      if (usedDates.has(entry.date)) throw new Error('Duplicate date in request: ' + entry.date);
      usedDates.add(entry.date);
    }
  }

  let cursor = addDays(maxExistingDate && maxExistingDate > minEditableDate ? maxExistingDate : minEditableDate, 1);
  for (const entry of entries) {
    if (entry.date !== undefined && entry.date !== null) continue;
    while (usedDates.has(cursor)) cursor = addDays(cursor, 1);
    entry.date = cursor;
    usedDates.add(cursor);
    cursor = addDays(cursor, 1);
  }
}

// Builds one upsert statement per mode present in `entry` (validating required modes and
// rejecting unknown mode keys). `entry` looks like { date, normal: {...}, sentamil: {...}, vadasol?: {...} }.
// `minEditableDate` enforces that only future, not-yet-live dates can be written.
function buildStatementsForDateEntry(db, entry, minEditableDate) {
  const date = entry.date;
  if (!isValidDateString(date)) throw new Error('Invalid date: ' + date + '. Expected YYYY-MM-DD');
  if (date <= minEditableDate) {
    throw new Error('Cannot modify word for ' + date + ': that date is already live or in the past');
  }

  const presentModes = Object.keys(entry).filter((key) => key !== 'date');
  for (const mode of presentModes) {
    if (!VALID_MODES.includes(mode)) throw new Error('Unknown mode: ' + mode);
  }
  for (const requiredMode of REQUIRED_MODES) {
    if (!entry[requiredMode]) throw new Error('"' + requiredMode + '" is required for date ' + date);
  }

  return presentModes.map((mode) => buildUpsertStatement(db, mode, date, entry[mode]));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const parts = url.pathname.split('/').filter(Boolean); // e.g. ['words']
    const resource = parts[0];

    // GET /word?date=YYYY-MM-DD  -> all modes for that date
    if (request.method === 'GET' && resource === 'word') {
      const date = url.searchParams.get('date');
      if (!isValidDateString(date)) {
        return json({ error: 'date query param is required, in YYYY-MM-DD format' }, 400);
      }
      const maxAllowedDate = addDays(todayDateString(), 1);
      if (date > maxAllowedDate) {
        return json({ error: 'Cannot request a date that far in the future' }, 403);
      }
      const rows = await getWordsForDate(env.DB, date);
      if (rows.length === 0) return json({ error: 'No words configured for ' + date }, 404);
      const [grouped] = groupRowsByDate(rows);
      return json(grouped, 200, { 'Cache-Control': 'public, max-age=86400' }); // past dates never change
    }

    // GET /words?mode=&date=&from=&to=&last=  (admin listing / bulk retrieval, all modes by default)
    if (request.method === 'GET' && resource === 'words') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      const mode = url.searchParams.get('mode');
      const date = url.searchParams.get('date');
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');
      const lastParam = url.searchParams.get('last');

      if (mode && !VALID_MODES.includes(mode)) {
        return json({ error: 'Unknown mode. Use one of: normal, sentamil, vadasol' }, 400);
      }
      if (date && !isValidDateString(date)) return json({ error: 'date must be YYYY-MM-DD' }, 400);
      if (from && !isValidDateString(from)) return json({ error: 'from must be YYYY-MM-DD' }, 400);
      if (to && !isValidDateString(to)) return json({ error: 'to must be YYYY-MM-DD' }, 400);

      let last = null;
      if (lastParam !== null) {
        last = parseInt(lastParam, 10);
        if (!Number.isInteger(last) || last <= 0) {
          return json({ error: 'last must be a positive integer' }, 400);
        }
      }

      const rows = await getWordsForAdmin(env.DB, { mode, date, from, to, last });
      return json({ words: groupRowsByDate(rows) });
    }

    // POST /words  (admin upsert - single date entry, or bulk via { words: [...] })
    if (request.method === 'POST' && resource === 'words') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return json({ error: 'Invalid JSON body' }, 400);
      }

      const entries = Array.isArray(body.words) ? body.words : [body];
      if (entries.length === 0) {
        return json({ error: '"words" must be a non-empty array' }, 400);
      }

      try {
        const minEditableDate = addDays(todayDateString(), 1);
        const maxExistingDate = await getMaxExistingDate(env.DB);
        assignAutoDates(entries, minEditableDate, maxExistingDate);

        const statements = entries.flatMap((entry) => buildStatementsForDateEntry(env.DB, entry, minEditableDate));
        await env.DB.batch(statements);
      } catch (e) {
        return json({ error: e.message }, 400);
      }

      return json({ ok: true, count: entries.length, dates: entries.map((entry) => entry.date) }, 201);
    }

    return json({ error: 'Not found' }, 404);
  },
};
