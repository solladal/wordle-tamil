# wordle-tamil words API (Cloudflare Worker + D1)

A small, free, serverless REST API that serves and manages the daily Tamil Wordle
words for all three modes (`normal`, `sentamil`, `vadasol`), so the word list
can be updated at any time without redeploying the frontend.

## Why date-based (not "today" resolved by the server)?

Players are spread across timezones, and the server's clock does not necessarily
match a player's local calendar date. To avoid mismatches, **the client always
computes its own "today" date and passes it explicitly** as a query parameter
(`?date=YYYY-MM-DD`). There is no `/today` endpoint - every lookup is by date.

The server still uses its own clock, but only as a security boundary: it rejects
requests for dates too far in the future (see "Future-date guard" below), so a
client can never fetch tomorrow's or next week's answer ahead of time, even by
manipulating the `date` parameter.

## Why all modes in one call?

Rather than one endpoint per mode, a single date lookup returns **all modes at
once** - this keeps the API call count low (important for the free tier and for
the "fetch a week at once" bulk use case) and means adding a new mode later
doesn't require new endpoints.

`vadasol` is treated as **optional** everywhere (not yet implemented in the UI):
reads simply omit it from the response if not configured for that date, and
writes don't require it.

## Endpoints

Dates are plain ISO strings `YYYY-MM-DD`.

### `GET /word?date=YYYY-MM-DD`
Public, no auth required. Returns the word for the given date, for every mode
that has one configured.

```
curl "https://<your-worker>.workers.dev/word?date=2026-07-11"
```

```json
{
  "date": "2026-07-11",
  "normal": {
    "word": "இருள்",
    "meaning": "இருட்டு, ஒளி அற்ற நிலை, அறியாமை, darkness, ignorance",
    "usageHtml": "மாலையில் இருள் சூழ்ந்தது"
  },
  "sentamil": { "word": "அறவு", "meaning": null, "usageHtml": null },
  "vadasol": { "word": "விவேகம்", "meaning": null, "usageHtml": null }
}
```

- Returns `400` if `date` is missing or malformed.
- Returns `403` if `date` is further in the future than the allowed grace period
  (see below).
- Returns `404` if no word is configured for that date in any mode.
- A mode key (e.g. `vadasol`) is simply absent from the response if not
  configured for that date - the client should treat that mode as unavailable
  for that day and fall back accordingly.
- Responses for past/valid dates are cacheable (`Cache-Control: public, max-age=86400`)
  since a given date's words never change once served.

#### Future-date guard
The server compares the requested `date` against its own "today" (computed in
the `Asia/Kolkata` timezone) and allows a **1-day grace period** past that,
purely to tolerate players whose local calendar date may be up to a day ahead
of the server's (e.g. Australia/NZ). Anything beyond that is rejected with
`403`, so future answers can never leak early.

### `GET /words?mode=&date=&from=&to=&last=`
Admin only. Lists words, with all filters optional and combinable:

- `mode` - restrict to one mode (`normal` | `sentamil` | `vadasol`). Omit for all modes.
- `date` - an exact date (`YYYY-MM-DD`). Takes precedence over `from`/`to`/`last`.
- `from` / `to` - an inclusive date range.
- `last` - the most recent N dates that have any data (e.g. `last=7` for the
  upcoming/most-recently-configured week). Takes precedence over `from`/`to`.

With no filters at all, returns every date/mode combination configured.

```
# everything for one exact date
curl "https://<your-worker>.workers.dev/words?date=2026-07-11" \
  -H "X-Admin-Token: <your-admin-token>"

# just the normal mode, for a date range
curl "https://<your-worker>.workers.dev/words?mode=normal&from=2026-07-01&to=2026-07-31" \
  -H "X-Admin-Token: <your-admin-token>"

# the 7 most recently-configured dates, all modes
curl "https://<your-worker>.workers.dev/words?last=7" \
  -H "X-Admin-Token: <your-admin-token>"
```

```json
{
  "words": [
    { "date": "2026-07-01", "normal": {...}, "sentamil": {...}, "vadasol": {...} },
    { "date": "2026-07-02", "normal": {...}, "sentamil": {...} }
  ]
}
```

### `POST /words`
Admin only. Adds or updates word(s) for one or more dates, for one or more
modes at once (upsert). Accepts either a single date entry, or a bulk batch,
in the same request body shape:

```
curl -X POST "https://<your-worker>.workers.dev/words" \
  -H "X-Admin-Token: <your-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-08-01",
    "normal": {"word":"கனவு","meaning":"தூக்கத்தில் தோன்றும் காட்சி","usageHtml":"நேற்று ஒரு கனவு கண்டேன்"},
    "sentamil": {"word":"நிலவு"}
  }'
```

or, for many dates at once (the recommended way to push a week's/month's
worth of words, minimizing round trips):

```
curl -X POST "https://<your-worker>.workers.dev/words" \
  -H "X-Admin-Token: <your-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "words": [
      {"date":"2026-08-01","normal":{"word":"கனவு"},"sentamil":{"word":"நிலவு"}},
      {"date":"2026-08-02","normal":{"word":"மழை"},"sentamil":{"word":"தூறல்"},"vadasol":{"word":"வர்ஷம்"}}
    ]
  }'
```

Only modes present in each entry are written/overwritten - omitting `vadasol`
for a date leaves whatever (if anything) is already stored for it untouched.
`normal` and `sentamil` are required on every entry; `vadasol` is optional.

The whole request is applied atomically - if any entry fails validation,
nothing in the request is written.

#### Auto-incrementing dates
`date` can be omitted on any entry. The server assigns the next free date
automatically, continuing on from whatever date is currently the furthest out,
and incrementing by one day for each date-less entry in the request:

```
curl -X POST "https://<your-worker>.workers.dev/words" \
  -H "X-Admin-Token: <your-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "words": [
      {"normal":{"word":"கனவு"},"sentamil":{"word":"நிலவு"}},
      {"normal":{"word":"மழை"},"sentamil":{"word":"தூறல்"}}
    ]
  }'
```
This is handy for "just add the next N days' words, in order" without having
to look up what the next available date is yourself.

#### Write rules
- **Dates must be unique within a request.** Two entries can't target the same
  date (whether explicit or auto-assigned) - the whole request is rejected if
  they do.
- **Only future, not-yet-live dates can be written.** A date is writable only
  if it's strictly after "today + 1 day" (server clock, `Asia/Kolkata`) - i.e.
  today and tomorrow can never be modified, matching the 1-day read grace
  period above (so a date that a grace-period reader may have already fetched
  can never be changed out from under them). Once a date has gone live, it's
  permanently locked - re-seed a *different*, later date instead if you made a
  mistake.

## Admin authentication

Admin-only endpoints (write endpoints, and the admin listing endpoint)
require a custom header:

```
X-Admin-Token: <the ADMIN_TOKEN secret>
```

Requests missing this header, or with the wrong value, get `401 Unauthorized`.
The token itself is stored as a Worker secret (see setup below), never checked
into source control.

## Project layout

```
worker/
  wrangler.toml            Worker + D1 binding config
  package.json              npm scripts for local dev / deploy / db management
  src/index.js               the Worker (this API)
  migrations/
    schema.sql                D1 table definition (mode, date, word, meaning, usage_html)
    generate-seed.js           generates migrations/seed.sql from src/util/words.js
    seed.sql                   generated seed data (one row per mode per date)
```

## One-time setup (Cloudflare account required, still free)

1. Install dependencies:
   ```
   cd worker
   npm install
   ```

2. Log in to Cloudflare (opens a browser once):
   ```
   npx wrangler login
   ```

3. Create the D1 database:
   ```
   npm run db:create
   ```
   This prints a `database_id` - copy it into `wrangler.toml`, replacing the
   `REPLACE_WITH_YOUR_D1_DATABASE_ID` placeholder.

4. Apply the schema and seed data to the **remote** database:
   ```
   npm run db:schema:remote
   npm run db:seed:remote
   ```

5. Set the admin token secret (pick your own strong random value):
   ```
   npm run secret:set
   ```
   (this runs `wrangler secret put ADMIN_TOKEN` and prompts for the value)

6. Deploy:
   ```
   npm run deploy
   ```
   Wrangler prints your Worker's URL, e.g.
   `https://wordle-tamil-words-api.<your-subdomain>.workers.dev`.

7. In the frontend project root, set this URL in `.env.production` (or your
   hosting provider's environment settings):
   ```
   REACT_APP_WORDS_API_BASE=https://wordle-tamil-words-api.<your-subdomain>.workers.dev
   ```
   Then rebuild/redeploy the frontend once. After that, updating words going
   forward only requires calling the bulk-upsert endpoint above - no frontend
   redeploy needed.

## Local development / testing (no Cloudflare account needed)

Everything can be run and tested fully locally via Miniflare, which simulates
both the Worker and D1.

1. Create a `worker/.dev.vars` file (gitignored) with a test admin token:
   ```
   ADMIN_TOKEN=some-local-test-token
   ```

2. Apply the schema and seed data to the **local** D1 simulation:
   ```
   npm run db:schema
   npm run db:seed
   ```

3. Start the local dev server:
   ```
   npm run dev
   ```
   This serves the Worker at `http://localhost:8787`.

4. Try it out:
   ```
   curl "http://localhost:8787/word?date=2026-07-11"

   curl -X POST "http://localhost:8787/words" \
     -H "X-Admin-Token: some-local-test-token" \
     -H "Content-Type: application/json" \
     -d '{"date":"2026-08-01","normal":{"word":"கனவு"},"sentamil":{"word":"நிலவு"}}'
   ```

5. Point the frontend at it locally by setting, in the frontend project root's
   `.env.local`:
   ```
   REACT_APP_WORDS_API_BASE=http://localhost:8787
   ```
   then run `npm start` as usual.

## Notes

- If `REACT_APP_WORDS_API_BASE` is unset (or the Worker is unreachable, or a
  mode is missing from the response - e.g. `vadasol` on a date it wasn't
  configured), the frontend silently falls back to the bundled word list in
  `src/util/words.js` - the app keeps working even if the API is down or a
  mode isn't fully populated yet.
- CORS is open (`Access-Control-Allow-Origin: *`) so the GitHub-Pages-hosted
  frontend (a different origin) can call the Worker directly from the browser.
- The seed data was generated to exactly match the word each date would have
  received under the old round-robin scheme, so migrating to this API does not
  change anyone's "today's word" - only future dates need to be pushed as new
  words going forward.
