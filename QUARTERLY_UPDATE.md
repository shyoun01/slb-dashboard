# Quarterly update

The dashboard reads `src/data/airtable-snapshot.json`, a copy of the **SLB Investor ROI** Airtable base.
Each quarter: load the new quarter into Airtable, refresh the snapshot, review the diff, deploy.

You need an Airtable personal access token with `data.records:read` and `data.records:write`
on the SLB Investor ROI base (set it as `AIRTABLE_TOKEN`; never commit it).

## 1. Collect the sources

Put them in `put ww files here/` (git-ignored; the WW workbook contains contact data).

| Source | Dashboard figures |
|---|---|
| **WW Master-Metrics workbook** (`.xlsx`) | Read by the script: in-year lumber (Summary row 19), Demand Generated (55), direct & indirect projects (12), panel MM SF (22), EWP (20), directly influenced projects (72), WoodWorks education hours (252, shown in thousands), converted projects by system/building type (Projects tab); carbon slide figures: wood volume (42, ÷1000 to million m³), carbon stored (44), emissions avoided (45), total carbon benefit (46), summed from the monthly columns |
| **AWC quarterly report** | Education Contact Hours: quarter "Contact Hours" (÷1000) |
| **Think Wood quarterly report** | CEU Credit Hours: "CEUs Completed" table (quarter = YTD − earlier quarters, ÷1000); lead funnel page (Subscribers, Prospects, Leads, MQLs, SQLs and their QoQ %); SQL Referral Conversions = "new project leads" in the quarter (Lead Conversion page) |
| **SLB Education report** | On-demand course completions and new accounts; student & grad engagements; faculty engagements (each has a "… in Qn:" headline) |

## 2. Fill in the PDF figures

Copy `scripts/quarterly/inputs.example.json` to e.g. `scripts/quarterly/inputs-2026-Q4.json`.
- `quarter`: this quarter's values.
- `prior`: earlier quarters of the same year as printed in the new reports. The script checks them against
  Airtable, which catches misreading a report or picking the wrong row.

## 3. Dry run, then load

```bash
AIRTABLE_TOKEN=xxx python scripts/quarterly/load_quarter.py --year 2026 --quarter 4 --ww "put ww files here/WW Master-Metrics_SLB_Q4_2026.xlsx" --manual scripts/quarterly/inputs-2026-Q4.json
```

Read the check table. Volumes may differ by rounding (Airtable keeps the published, rounded figures);
counts must match exactly. Anything marked MISMATCH needs an explanation before loading
(WW sometimes restates earlier quarters; past quarters stay as published). Then re-run with `--apply`.

## 4. Refresh the snapshot and review

```bash
AIRTABLE_TOKEN=xxx npm run snapshot
git diff src/data/airtable-snapshot.json
npm run dev
```

The diff should only add the new quarter and the totals that depend on it. Check `/investors-quarterly`
(header shows the new quarter), `/` and `/investors-roi`.

## 5. Publish

Commit on a branch, push, check the Vercel preview, then merge to `main`.

**If something is wrong after going live:** in Vercel, use *Instant Rollback* to the previous production
deployment (no code change), or `git revert` the merge commit. The tag `pre-airtable` marks the last
version before the dashboard switched to Airtable.

## Year-end extras (after Q4)

- **Annual inputs** on the Years record (from the ROI sheet): SLB Investment, Expenses, Board Initiatives,
  Avg Lumber Price, Total Softwood Consumption, macro indicators. Revenue, ROI, cumulative ROI and market
  share then calculate in Airtable, and the annual pages move on to the new year automatically.
- **New year** (before loading its Q1): add a Years record, link it to its own Reporting Period (Sort Order after the last one),
  set its Prior Year / 2 Years Prior / 3 Years Prior / Years to Date links, and add its Goals. Decide whether
  older single-year periods should be grouped (e.g. 2025–27) the way earlier years are.
