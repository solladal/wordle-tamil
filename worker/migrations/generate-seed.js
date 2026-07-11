/**
 * One-time migration helper: parses the existing hardcoded src/util/words.js
 * and generates a seed.sql file that can be loaded into the D1 database with:
 *   wrangler d1 execute wordle-tamil-words --file=./migrations/seed.sql
 *
 * The old app picked "today's word" as arr[dayIndex % arr.length] (round-robin).
 * To avoid disrupting existing players on migration day, this script seeds one
 * row per calendar date from each mode's startDate up through today + a future
 * buffer, using that exact same round-robin formula - so "today" resolves to
 * the same word it would have before the migration. Beyond the buffer, there
 * are simply no rows yet - that's expected: from now on you add words per-date
 * yourself (via POST /words), no more repeating/round-robin.
 *
 * Run with: node worker/migrations/generate-seed.js
 */
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../src/util/words.js');
const outputPath = path.join(__dirname, './seed.sql');
const source = fs.readFileSync(sourcePath, 'utf8');

const START_DATES = {
  normal: new Date('2022-01-26T00:00:00Z'),
  sentamil: new Date('2022-02-06T00:00:00Z'),
  vadasol: new Date('2022-05-18T00:00:00Z'),
};
const FUTURE_BUFFER_DAYS = 30; // seed this many days beyond today too, so there's no gap while you set up date-specific words

function extractArray(varName) {
  const re = new RegExp(`export const ${varName} = \\[([\\s\\S]*?)\\];`);
  const match = source.match(re);
  if (!match) throw new Error(`Could not find array: ${varName}`);
  const body = match[1];
  const words = [];
  const wordRe = /'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = wordRe.exec(body)) !== null) {
    words.push(m[1]);
  }
  return words;
}

function extractMeaningMap() {
  const re = /export const wordsMeaning = \{([\s\S]*?)\n\}/;
  const match = source.match(re);
  if (!match) throw new Error('Could not find wordsMeaning map');
  const body = match[1];
  const entryRe = /'((?:[^'\\]|\\.)*)':\s*\{meaning:\s*'((?:[^'\\]|\\.)*)',\s*usage:\s*(<div>[\s\S]*?<\/div>)\s*\}/g;
  const meanings = {};
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    const [, word, meaning, usageJsx] = m;
    const usageHtml = usageJsx.replace(/<\/?div>/g, '').trim();
    meanings[word] = { meaning, usageHtml };
  }
  return meanings;
}

function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toDateString(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

const modes = {
  normal: extractArray('words'),
  sentamil: extractArray('senthamilWords'),
  vadasol: extractArray('vadasolWords'),
};
const meanings = extractMeaningMap();

const now = new Date();
let statements = [];
for (const [mode, list] of Object.entries(modes)) {
  const startDate = START_DATES[mode];
  const diffDays = Math.ceil(Math.abs(now - startDate) / (1000 * 60 * 60 * 24));
  const totalDaysToSeed = diffDays + FUTURE_BUFFER_DAYS;

  for (let dayIndex = 0; dayIndex <= totalDaysToSeed; dayIndex++) {
    const word = list[dayIndex % list.length];
    const date = toDateString(new Date(startDate.getTime() + dayIndex * 24 * 60 * 60 * 1000));
    const meta = meanings[word] || {};
    statements.push(
      `INSERT INTO words (mode, date, word, meaning, usage_html) VALUES (${sqlEscape(mode)}, ${sqlEscape(date)}, ${sqlEscape(word)}, ${sqlEscape(meta.meaning)}, ${sqlEscape(meta.usageHtml)});`
    );
  }
}

fs.writeFileSync(outputPath, statements.join('\n') + '\n');
console.log(`Wrote ${statements.length} INSERT statements to ${outputPath}`);
console.log(`  (seeded from each mode's startDate through today + ${FUTURE_BUFFER_DAYS} days)`);
