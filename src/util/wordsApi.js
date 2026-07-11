import { getWordOf as getFallbackWord, wordsMeaning as fallbackMeaning } from './words';

// Base URL of the Cloudflare Worker words API, e.g. https://wordle-tamil-words-api.<subdomain>.workers.dev
// Configure via .env / .env.production as REACT_APP_WORDS_API_BASE. If unset, the app silently
// uses the bundled word lists from words.js (no remote fetch, no daily updates without redeploying).
const API_BASE = (process.env.REACT_APP_WORDS_API_BASE || '').replace(/\/$/, '');

function getFallbackEntry(mode, fallbackIndex) {
  const word = getFallbackWord(mode, fallbackIndex);
  const meta = fallbackMeaning[word];
  return {
    date: null,
    word,
    meaning: meta ? meta.meaning : null,
    usageHtml: null,
    usageNode: meta ? meta.usage : null, // JSX node - only ever present when using the bundled fallback data
    source: 'fallback',
  };
}

// The API returns all modes for a date in one response, e.g.
// { date, normal: {word, meaning, usageHtml}, sentamil: {...}, vadasol?: {...} }.
// Cached in localStorage (keyed by date) so a given date's data is fetched once and reused
// across page loads/reloads for the rest of the day, instead of hitting the network every time.
// Cache entries expire at the end of the current day (not the requested date's day) - once
// the day rolls over, everything is treated as stale and the next load fetches fresh data
// (which naturally also means "today" moves on to a new date key anyway).
const CACHE_KEY_PREFIX = 'wordle-tamil-words-cache:';
let hasCleanedUpExpiredCache = false;

function endOfTodayTimestamp() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999);
}

function readCachedWordsForDate(dateStr) {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + dateStr);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || typeof entry.expiresAt !== 'number' || Date.now() > entry.expiresAt) {
      localStorage.removeItem(CACHE_KEY_PREFIX + dateStr);
      return null;
    }
    return entry.data;
  } catch (error) {
    return null; // corrupt/inaccessible cache entry - treat as a miss
  }
}

function writeCachedWordsForDate(dateStr, data) {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + dateStr, JSON.stringify({ data, expiresAt: endOfTodayTimestamp() }));
  } catch (error) {
    // localStorage full/unavailable (e.g. private browsing) - caching is just an optimization
  }
}

// One-time sweep of any expired entries left over from previous days, so localStorage doesn't
// accumulate stale entries indefinitely.
function cleanupExpiredCacheOnce() {
  if (hasCleanedUpExpiredCache) return;
  hasCleanedUpExpiredCache = true;
  try {
    const now = Date.now();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(CACHE_KEY_PREFIX)) continue;
      try {
        const entry = JSON.parse(localStorage.getItem(key));
        if (!entry || typeof entry.expiresAt !== 'number' || now > entry.expiresAt) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        localStorage.removeItem(key); // corrupt entry - just drop it
      }
    }
  } catch (error) {
    // localStorage unavailable - nothing to clean up
  }
}

// De-dupes concurrent in-flight requests for the same date within a single page load (e.g.
// fetching the current word and the previous word land on the same date).
const inFlightRequests = new Map();

async function fetchWordsForDate(dateStr) {
  cleanupExpiredCacheOnce();

  const cached = readCachedWordsForDate(dateStr);
  if (cached) return cached;

  if (inFlightRequests.has(dateStr)) return inFlightRequests.get(dateStr);
  if (!API_BASE) throw new Error('Words API base URL not configured');

  const promise = (async () => {
    const response = await fetch(`${API_BASE}/word?date=${dateStr}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Words API responded with ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Malformed words API response');
    writeCachedWordsForDate(dateStr, data);
    return data;
  })();
  inFlightRequests.set(dateStr, promise);
  try {
    return await promise;
  } finally {
    inFlightRequests.delete(dateStr);
  }
}

// Word for a specific date and mode (the client always computes and supplies the exact date it
// wants - including for "today's word" - so there's never a client/server timezone mismatch).
// `fallbackIndex` is only used to pick a word from the bundled list if the API is unreachable
// or doesn't have this mode configured for that date (e.g. vadasol, which is optional).
export async function fetchWordForDate(mode, dateStr, fallbackIndex) {
  try {
    const data = await fetchWordsForDate(dateStr);
    const entry = data[mode];
    if (!entry || !entry.word) throw new Error(`No "${mode}" word in API response for ${dateStr}`);
    return { date: data.date, word: entry.word, meaning: entry.meaning, usageHtml: entry.usageHtml, source: 'api' };
  } catch (error) {
    console.warn('[wordle-tamil] Falling back to bundled word list (date):', error);
    return getFallbackEntry(mode, fallbackIndex);
  }
}
