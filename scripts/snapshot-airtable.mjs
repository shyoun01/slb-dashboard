// Regenerates src/data/airtable-snapshot.json from the "SLB Investor ROI" Airtable base.
// Run this after each quarterly update, review the git diff, then commit.
//
// Usage:
//   AIRTABLE_TOKEN=xxx npm run snapshot
//
// The token is read from the environment only (never hardcode it in this file).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE = process.env.AIRTABLE_BASE_ID || 'appuoY9IW6ZAVG2Gz';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'airtable-snapshot.json');

if (!TOKEN) {
  console.error('Missing AIRTABLE_TOKEN environment variable.');
  process.exit(1);
}

// Table IDs (from this base's schema)
const TABLES = {
  years: 'tbl20Y8KMagqo8RwV',
  quarters: 'tbl0RsHspyLwxsExz',
  periods: 'tbldbsuBmANMSDpWn',
  goals: 'tblkH5btuc0x2iYoY',
};

// Internal Airtable plumbing that the dashboard never reads
const SKIP_FIELD = (name) =>
  name.startsWith('Helper: ') ||
  name.startsWith('DELETE ME') ||
  ['Prior Year', '2 Years Prior', '3 Years Prior', 'Years to Date', 'Next Year', '2 Years Later', '3 Years Later',
    'Included in Later Years to Date', 'Quarters', 'Goals', 'Source Note'].includes(name);

async function fetchAll(tableId) {
  let all = [];
  let offset;
  do {
    const qp = offset ? `&offset=${encodeURIComponent(offset)}` : '';
    const res = await fetch(`https://api.airtable.com/v0/${BASE}/${tableId}?pageSize=100${qp}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = await res.json();
    if (json.error) throw new Error(`${tableId}: ${JSON.stringify(json.error)}`);
    all = all.concat(json.records);
    offset = json.offset;
  } while (offset);
  return all;
}

// Round away floating-point noise from rollups (e.g. 580.0999999999999 -> 580.1)
const clean = (v) => (typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v);

function pick(fields, linkResolvers) {
  const out = {};
  for (const name of Object.keys(fields).sort()) {
    if (SKIP_FIELD(name)) continue;
    const v = fields[name];
    if (linkResolvers[name]) out[name] = linkResolvers[name](v);
    else if (v && typeof v === 'object' && !Array.isArray(v)) continue; // error/AI objects
    else out[name] = clean(v);
  }
  return out;
}

const raw = {};
for (const [key, id] of Object.entries(TABLES)) {
  console.log(`Fetching ${key}...`);
  raw[key] = await fetchAll(id);
  console.log('  ', raw[key].length, 'records');
}

const yearById = Object.fromEntries(raw.years.map((r) => [r.id, r.fields.Year]));
const periodById = Object.fromEntries(raw.periods.map((r) => [r.id, r.fields.Period]));
const one = (map) => (ids) => (Array.isArray(ids) && ids.length ? map[ids[0]] : null);
const many = (map) => (ids) => (Array.isArray(ids) ? ids.map((i) => map[i]).sort() : []);

const snapshot = {
  source: `Airtable base ${BASE}`,
  years: raw.years
    .map((r) => pick(r.fields, { 'Reporting Period': one(periodById) }))
    .sort((a, b) => a.Year - b.Year),
  quarters: raw.quarters
    .map((r) => pick(r.fields, { Year: one(yearById) }))
    .sort((a, b) => a['Quarter Label'].localeCompare(b['Quarter Label'])),
  periods: raw.periods
    .map((r) => pick(r.fields, { Years: many(yearById) }))
    .sort((a, b) => a['Sort Order'] - b['Sort Order']),
  goals: raw.goals
    .map((r) => pick(r.fields, { Year: one(yearById) }))
    .sort((a, b) => a.Goal.localeCompare(b.Goal)),
};

fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Wrote ${path.relative(process.cwd(), OUT)}`);
