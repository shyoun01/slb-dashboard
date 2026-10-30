"""
Load one quarter into the "SLB Investor ROI" Airtable base.

Reads the WoodWorks master-metrics workbook (Summary tab + Projects tab) and an
optional JSON file of figures taken from the AWC / Think Wood / Education PDF
reports. Before writing anything it compares the year's earlier quarters in
Airtable with the same figures in the new sources, so a shifted row or a
misread report shows up as a mismatch.

Dry run (default) prints what would be written; --apply writes it.

Usage:
  AIRTABLE_TOKEN=xxx python scripts/quarterly/load_quarter.py \
      --year 2026 --quarter 4 \
      --ww "put ww files here/WW Master-Metrics_SLB_Q4_2026.xlsx" \
      --manual scripts/quarterly/inputs-2026-Q4.json  [--apply]

Requires: pip install openpyxl
"""
import argparse
import datetime
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter

import openpyxl

BASE = os.environ.get("AIRTABLE_BASE_ID", "appuoY9IW6ZAVG2Gz")
TABLES = {"years": "tbl20Y8KMagqo8RwV", "quarters": "tbl0RsHspyLwxsExz", "periods": "tbldbsuBmANMSDpWn"}
QS = ["Q1", "Q2", "Q3", "Q4"]

# WW Summary rows -> Airtable Quarters fields. The label check guards against rows moving.
WW_ROWS = {
    "In-Year Lumber (MM BF)": (19, "Lumber (mmbf)", 1),
    "Demand Generated (MM BF)": (55, "Lumber (mmbf)", 1),
    "Projects (Dir & Indir)": (12, "Number of Direct and Indirect Projects", 1),
    "Panel (MM SF)": (22, "Panels (mmsqft", 1),
    # Board-foot panel (half of the MM SF row) for the Total Wood chart
    "Panel (MM BF)": (21, "Panels (mmbf)", 1),
    "EWP (MM BF)": (20, "EWP (mmbf)", 1),
    "Directly Influenced Projects": (9, "Number of Direct Projects", 1),
    # Pyramid: Audience Engaged
    "WW New Contacts": (253, "New Contacts", 1),
    # Dashboard shows WoodWorks education hours in thousands
    "Practitioner Education Hours (M)": (252, "Educational Hours", 1000),
}
ROUND = {"In-Year Lumber (MM BF)": 1, "Demand Generated (MM BF)": 1, "Panel (MM SF)": 1, "Panel (MM BF)": 3,
         "EWP (MM BF)": 1, "Practitioner Education Hours (M)": 3}

# Carbon rows are summed from the monthly columns: WW's quarterly blocks for row 45 are blank for 2016-2020.
CARBON_ROWS = {
    "Wood Volume (M m3)": (42, "Volume of Wood Product", 1000),  # WW reports thousand m3
    "Carbon Stored (MM t CO2)": (44, "Direct Carbon Storage", 1),
    "Emissions Avoided (MM t CO2)": (45, "Avoided greenhouse gas", 1),
    "Carbon Benefit (MM t CO2)": (46, "Total Potential Carbon Benefit", 1),
}

# WW "Building Occupancy" -> dashboard building type (matches the published 2024-2026 counts)
BUILDING = {
    "Multi-family": "Converted: Multifamily",
    "Business": "Converted: Commercial", "Hotel/Motel": "Converted: Commercial", "Mercantile": "Converted: Commercial",
    "Assembly": "Converted: Institutional", "Educational": "Converted: Institutional",
    "Student Housing": "Converted: Institutional", "Institutional": "Converted: Institutional",
    "Factory/Industrial": "Converted: Warehouse/Mfg",
    "Utility/Misc": "Converted: Other",
}
SYSTEM_FIELDS = ["Converted: Light-Frame", "Converted: Hybrid MT/LF", "Converted: Heavy/MT"]
BUILDING_FIELDS = ["Converted: Multifamily", "Converted: Commercial", "Converted: Institutional",
                   "Converted: Warehouse/Mfg", "Converted: Other"]


# ---------------------------------------------------------------- Airtable
def api(method, path, body=None):
    token = os.environ.get("AIRTABLE_TOKEN")
    if not token:
        sys.exit("Missing AIRTABLE_TOKEN environment variable.")
    req = urllib.request.Request(
        "https://api.airtable.com/v0/" + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"})
    for _ in range(5):
        try:
            with urllib.request.urlopen(req) as r:
                return json.loads(r.read() or b"{}")
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(30)
                continue
            sys.exit(f"Airtable {method} {path} failed: {e.code} {e.read().decode()}")


def fetch(table, formula=None):
    out, offset = [], None
    while True:
        q = "pageSize=100" + (f"&offset={urllib.parse.quote(offset)}" if offset else "")
        if formula:
            q += "&filterByFormula=" + urllib.parse.quote(formula)
        r = api("GET", f"{BASE}/{TABLES[table]}?{q}")
        out += r["records"]
        offset = r.get("offset")
        if not offset:
            return out


# ---------------------------------------------------------------- WW workbook
def read_ww(path, year):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    summary = [list(r) for r in wb["Summary"].iter_rows(values_only=True)]
    col = next((j for j, v in enumerate(summary[5])
                if isinstance(v, str) and v.startswith(f"{year} Calendar Year")), None)
    if col is None:
        sys.exit(f"WW Summary has no '{year} Calendar Year' block.")
    values = {}
    for field, (row, label, divisor) in WW_ROWS.items():
        found = str(summary[row - 1][1] or "").strip()
        if not found.startswith(label):
            sys.exit(f"WW Summary row {row} is '{found}', expected '{label}...'. The workbook layout changed; "
                     "update WW_ROWS before loading.")
        vals = []
        for q in range(4):
            v = summary[row - 1][col + q]
            vals.append(v / divisor if isinstance(v, (int, float)) else None)
        values[field] = vals

    month_cols, seen = {}, set()
    for j, d in enumerate(summary[2]):
        # first column per month only (the header row repeats a stray date further right)
        if isinstance(d, datetime.datetime) and d.year == year and d.day == 1 and d.month not in seen:
            seen.add(d.month)
            month_cols.setdefault((d.month - 1) // 3 + 1, []).append(j)
    for field, (row, label, divisor) in CARBON_ROWS.items():
        found = str(summary[row - 1][1] or "").strip()
        if not found.startswith(label):
            sys.exit(f"WW Summary row {row} is '{found}', expected '{label}...'. The workbook layout changed; "
                     "update CARBON_ROWS before loading.")
        vals = []
        for q in range(1, 5):
            cells = [summary[row - 1][j] for j in month_cols.get(q, [])]
            nums = [c for c in cells if isinstance(c, (int, float))]
            vals.append(round(sum(nums) / divisor, 6) if nums else None)
        values[field] = vals

    projects =[list(r) for r in wb["Projects"].iter_rows(values_only=True)]
    header = projects[3]
    idx = {name: header.index(name) for name in ("Report Date", "Building Occupancy", "Num_LF_Systems", "Num_MT_Systems")}
    by_quarter = {q: [] for q in range(1, 5)}
    for r in projects[4:]:
        d = r[idx["Report Date"]]
        if isinstance(d, datetime.datetime) and d.year == year:
            by_quarter[(d.month - 1) // 3 + 1].append(r)

    def counts(rows):
        c = Counter()
        for r in rows:
            lf, mt = r[idx["Num_LF_Systems"]] or 0, r[idx["Num_MT_Systems"]] or 0
            c["Converted: Light-Frame" if not mt else ("Converted: Heavy/MT" if not lf else "Converted: Hybrid MT/LF")] += 1
            occ = r[idx["Building Occupancy"]]
            if occ not in BUILDING:
                sys.exit(f"Unmapped WW Building Occupancy '{occ}'. Add it to BUILDING before loading.")
            c[BUILDING[occ]] += 1
        return c

    return values, {q: counts(rows) for q, rows in by_quarter.items()}, {q: len(rows) for q, rows in by_quarter.items()}


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--year", type=int, required=True)
    ap.add_argument("--quarter", type=int, required=True, choices=[1, 2, 3, 4])
    ap.add_argument("--ww", required=True, help="WW Master-Metrics workbook for this quarter")
    ap.add_argument("--manual", help="JSON with figures from the PDF reports (see inputs.example.json)")
    ap.add_argument("--apply", action="store_true", help="write to Airtable (default is a dry run)")
    a = ap.parse_args()
    year, qn, label = a.year, a.quarter, f"{a.year} Q{a.quarter}"

    ww, ww_types, ww_counts = read_ww(a.ww, year)
    manual = json.load(open(a.manual, encoding="utf-8")) if a.manual else {}

    year_recs = fetch("years", f"{{Year}}={year}")
    quarter_recs = {r["fields"]["Quarter Label"]: r for r in fetch("quarters", f"FIND('{year} Q', {{Quarter Label}})=1")}

    # 1. Earlier quarters: Airtable (as published) vs the new sources
    problems = 0
    print(f"\n== Check: {year} Q1-Q{qn - 1} in Airtable vs new sources ==" if qn > 1 else "\n== First quarter of the year: nothing earlier to check ==")
    for q in range(1, qn):
        rec = quarter_recs.get(f"{year} Q{q}", {}).get("fields", {})
        checks = {f: ww[f][q - 1] for f in ww}
        checks.update(manual.get("prior", {}).get(f"Q{q}", {}))
        for field, src in checks.items():
            at = rec.get(field)
            if src is None or at is None:
                print(f"  Q{q} {field:40s} airtable={at} source={src}   (missing)")
                problems += 1
                continue
            tol = 0.6 if field in ROUND else 0  # published volumes are rounded; counts must match exactly
            if field == "Practitioner Education Hours (M)":
                tol = 0.06
            if field in CARBON_ROWS:
                tol = 0.0005
            flag = "" if abs(at - src) <= tol else "   <-- MISMATCH"
            problems += bool(flag)
            print(f"  Q{q} {field:40s} airtable={at:<10g} source={round(src, 3):<10g}{flag}")
        n = rec.get("Directly Influenced Projects")
        if n is not None and n != ww_counts[q]:
            print(f"  Q{q} WW Projects tab has {ww_counts[q]} projects, Airtable has {n}   <-- MISMATCH")
            problems += 1

    # 2. The new quarter's record
    fields = {"Quarter Label": label, "Quarter": f"Q{qn}"}
    for f, vals in ww.items():
        v = vals[qn - 1]
        if v is None or v == 0:
            sys.exit(f"WW has no {f} value for {label}. Is this the right workbook?")
        fields[f] = round(v, ROUND[f]) if f in ROUND else v
    fields["WW In-Year Lumber Latest (MM BF)"] = round(ww["In-Year Lumber (MM BF)"][qn - 1], 3)
    fields["WW Demand Generated Latest (MM BF)"] = round(ww["Demand Generated (MM BF)"][qn - 1], 3)
    fields.update(manual.get("quarter", {}))
    fields["Source Note"] = (f"Loaded by scripts/quarterly/load_quarter.py from {os.path.basename(a.ww)} "
                             f"(Summary rows 19/55/12/22/21/20/9/252/253)"
                             + (f" and {os.path.basename(a.manual)} ({manual.get('sources', 'PDF reports')})" if a.manual else "")
                             + f" on {datetime.date.today()}.")

    # 3. Converted projects by type: published YTD so far + WW's additions this quarter
    year_fields = year_recs[0]["fields"] if year_recs else {}
    already_loaded = "Directly Influenced Projects" in quarter_recs.get(label, {}).get("fields", {})
    ytd = {}
    if already_loaded:
        print(f"\n{label} is already loaded: converted-by-type totals are left as they are (re-adding would double count).")
    else:
        for f in SYSTEM_FIELDS + BUILDING_FIELDS:
            prior = year_fields.get(f, 0) if qn > 1 else 0
            ytd[f] = prior + ww_types[qn][f]
        if sum(ytd[f] for f in SYSTEM_FIELDS) != sum(ytd[f] for f in BUILDING_FIELDS):
            sys.exit("System and building totals disagree; check the WW Projects tab.")

    print(f"\n== Will write Quarters record {label} ==")
    for k, v in fields.items():
        if k != "Source Note":
            print(f"  {k:40s} {v}")
    print(f"\n== Will write Years {year} converted-by-type (YTD through Q{qn}) ==")
    for k, v in ytd.items():
        print(f"  {k:40s} {year_fields.get(k)} -> {v}")
    missing = [k for k in ("Education Contact Hours (M)", "CEU Credit Hours (M)", "On-Demand Completions",
                           "On-Demand New Accounts", "Student Engagements", "Faculty Engagements",
                           "SQL Referral Conversions", "Funnel Subscribers") if k not in fields]
    if missing:
        print(f"\n  Not provided (dashboard will show no {label} value): {', '.join(missing)}")

    if problems:
        print(f"\n{problems} check(s) above need a look before loading.")
    if not a.apply:
        print("\nDry run only. Re-run with --apply to write to Airtable.")
        return
    if problems and input("Write anyway? [y/N] ").strip().lower() != "y":
        sys.exit("Nothing written.")

    if not year_recs:
        sys.exit(f"No Years record for {year}. Add the year (and its Reporting Period and year links) first; "
                 "see QUARTERLY_UPDATE.md.")
    fields["Year"] = [year_recs[0]["id"]]
    existing = quarter_recs.get(label)
    if existing:
        api("PATCH", f"{BASE}/{TABLES['quarters']}", {"records": [{"id": existing["id"], "fields": fields}], "typecast": True})
    else:
        api("POST", f"{BASE}/{TABLES['quarters']}", {"records": [{"fields": fields}], "typecast": True})
    if ytd:
        api("PATCH", f"{BASE}/{TABLES['years']}", {"records": [{"id": year_recs[0]["id"], "fields": ytd}]})
    print(f"\nWrote {label}. Next: AIRTABLE_TOKEN=... npm run snapshot, then review the git diff.")


if __name__ == "__main__":
    main()
