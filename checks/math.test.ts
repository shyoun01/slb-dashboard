/**
 * Math checks for the dashboard data (run with `npm run check`; every build runs them too).
 *
 * They recalculate what the charts draw from src/data/airtable-snapshot.json and fail when
 * stacked bars don't add up, units are mixed, or the same figure differs between cards.
 * The dashboard shows calculated ("Calc") values; published overrides stay in Airtable for
 * reference and are listed in KNOWN_EXCEPTIONS with the reason.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  VOLUME_CHARTS,
  barPeriods,
  convertedByBuilding,
  convertedBySystem,
  demandRealizedRows,
  num,
  periods,
  quarterlyRows,
  quarters,
  totalWoodRows,
  volumeRows,
  years,
} from "@/data/airtable";

/** "Period | field" or "Year | field" -> why the figure differs from the calculation */
const KNOWN_EXCEPTIONS: Record<string, string> = {
  "2012–15 | Demand Generated Published (MM BF)": "Combined 2012-15 total from the original sheet (years sum to the same 1,683).",
  "2016–18 | Demand Generated Published (MM BF)": "3,182 as presented; the years sum to 3,172.",
  "2016–18 | Panel Published (MM SF)": "Panel history exists only as published period totals.",
  "2019–21 | Panel Published (MM SF)": "Panel history exists only as published period totals.",
  "2022–24 | Panel Published (MM SF)": "Panel history exists only as published period totals.",
  "2025 | Panel Published (MM SF)": "WW's unrounded annual total (360.2); rounded quarters sum to 360.1.",
  "2016–18 | EWP Published (MM BF)": "EWP history exists only as published period totals.",
  "2019–21 | EWP Published (MM BF)": "EWP history exists only as published period totals.",
  "2022–24 | EWP Published (MM BF)": "EWP history exists only as published period totals.",
  "2019–21 | Total Wood Lumber Published (MM BF)": "2,076 as presented; in-year lumber is 2,075.7.",
  "2022–24 | Total Wood Lumber Published (MM BF)": "2,341 as presented; in-year lumber is 2,339.8.",
  "2025 | Total Wood Lumber Published (MM BF)": "581 as presented; in-year lumber is 580.1.",
  "2012–15 | Demand Realized Total Published (MM BF)": "Legacy figure; cannot be traced to the sheet or WW.",
  "2016–18 | Demand Realized Total Published (MM BF)": "Legacy figure; cannot be traced to the sheet or WW.",
  "2019–21 | Demand Realized Total Published (MM BF)": "4,360 as presented (sheet total 4,359.75).",
  "2022–24 | Demand Realized Total Published (MM BF)": "5,449 as presented (sheet total 5,445.5).",
  "2025 | Demand Realized Total Published (MM BF)": "1,606 as presented (segments 282 + 264 + 480 + 580).",
  "2025 | DR 25% 3-Yr Tail Published": "As presented.",
  "2025 | DR 25% 2-Yr Tail Published": "As presented.",
  "2025 | DR 50% Prior-Yr Tail Published": "As presented.",
  "2025 | DR Direct Published": "As presented.",
  "2012–20 (BF impact table) | BF Impact In-Year Published": "Legacy figure on /investors-roi; cannot be reproduced.",
  "2012–20 (BF impact table) | BF Impact Indirect Published": "Legacy figure on /investors-roi; cannot be reproduced.",
  "2019 | Projects Annual Published": "1,230 as published; WW now shows 1,352.",
  "2022 | Projects Annual Published": "1,728 as published; WW now shows 1,720.",
};

const close = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const sum = (xs: (number | null)[]) => xs.reduce<number>((s, v) => s + (v ?? 0), 0);

describe("published overrides are documented", () => {
  it("every '... Published' value in Reporting Periods and Years has a reason in KNOWN_EXCEPTIONS", () => {
    const undocumented: string[] = [];
    for (const p of periods) {
      for (const field of Object.keys(p)) {
        if (/Published/.test(field) && num(p, field) != null && !KNOWN_EXCEPTIONS[`${p.Period} | ${field}`]) {
          undocumented.push(`${p.Period} | ${field} = ${num(p, field)}`);
        }
      }
    }
    for (const y of years) {
      const proj = num(y, "Projects Annual Published");
      const sumQ = num(y, "Projects Sum of Quarters");
      if (proj != null && sumQ && proj !== sumQ && !KNOWN_EXCEPTIONS[`${y.Year} | Projects Annual Published`]) {
        undocumented.push(`${y.Year} | Projects Annual Published = ${proj} (quarters sum to ${sumQ})`);
      }
    }
    expect(undocumented, "Add each to KNOWN_EXCEPTIONS with a reason, or clear it in Airtable").toEqual([]);
  });
});

describe("stacked bars add up to their totals", () => {
  for (const [name, opts] of Object.entries(VOLUME_CHARTS)) {
    it(`${name}: quarter segments sum to the bar's total label`, () => {
      for (const row of volumeRows(opts).filter((r) => r.showQuarters)) {
        const segs = sum([row.q1, row.q2, row.q3, row.q4]);
        // published totals may differ from rounded quarters by rounding only
        expect(close(segs, row.totalBF_MM ?? 0, 0.15), `${name} ${row.label}: ${segs} vs ${row.totalBF_MM}`).toBe(true);
        const label = row.volumeLabelQ1 ?? row.volumeLabelQ2 ?? row.volumeLabelQ3 ?? row.volumeLabelQ4;
        expect(label, `${name} ${row.label}: total label`).toBe(row.totalBF_MM);
      }
    });
  }

  it("Total Wood: lumber + panel + EWP equals the bar total", () => {
    for (const r of totalWoodRows()) {
      expect(close(r.lumber + r.panel + r.ewp, r.total, 0.001), r.label).toBe(true);
    }
  });

  it("Demand Realized: the four layers equal the bar total", () => {
    for (const r of demandRealizedRows().filter((x) => x.l4 != null)) {
      expect(sum([r.l1, r.l2, r.l3, r.l4]), r.label).toBe(r.total);
    }
  });

  it("quarterly program charts: quarters sum to the year total", () => {
    for (const field of ["Directly Influenced Projects", "On-Demand Completions", "On-Demand Learning Hours", "Student Engagements",
      "Faculty Engagements", "SQL Referral Conversions", "Education Contact Hours (M)", "CEU Credit Hours (M)",
      "Practitioner Education Hours (M)"]) {
      for (const r of quarterlyRows(field)) {
        expect(close(sum([r.q1, r.q2, r.q3, r.q4]), r.total, 1e-9), `${field} ${r.year}`).toBe(true);
      }
    }
  });
});

describe("units are not mixed", () => {
  it("Total Wood panel is in board feet: half of the Panel card's square feet", () => {
    const panelCard = Object.fromEntries(volumeRows(VOLUME_CHARTS.panel).map((r) => [r.label, r.totalBF_MM ?? 0]));
    for (const r of totalWoodRows()) {
      expect(close(r.panel, panelCard[r.label] / 2, 0.06), `${r.label}: panel ${r.panel} vs ${panelCard[r.label]} MM SF`).toBe(true);
    }
  });

  it("Panel (MM BF) is half of Panel (MM SF) in every quarter", () => {
    for (const q of quarters) {
      const sf = num(q, "Panel (MM SF)");
      const bf = num(q, "Panel (MM BF)");
      if (sf == null && bf == null) continue;
      expect(sf != null && bf != null && close(bf, sf / 2, 0.06), `${q["Quarter Label"]}: ${bf} BF vs ${sf} SF`).toBe(true);
    }
  });

  it("chart labels inside a bar show that bar's own value (not a different field or unit)", () => {
    const dir = path.join(__dirname, "..", "src", "components", "charts");
    const allowed = /^(volumeLabel|totalOn|totalLabel|goal)|^total$/;
    const problems: string[] = [];
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
      const src = fs.readFileSync(path.join(dir, file), "utf8");
      for (const bar of src.matchAll(/<Bar\b[^>]*?dataKey="(\w+)"[\s\S]*?<\/Bar>/g)) {
        for (const label of bar[0].matchAll(/<LabelList\b[^>]*?dataKey="(\w+)"/g)) {
          if (label[1] !== bar[1] && !allowed.test(label[1])) problems.push(`${file}: bar "${bar[1]}" shows label "${label[1]}"`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("the same figure matches across cards", () => {
  const card = (opts: Parameters<typeof volumeRows>[0]) =>
    Object.fromEntries(volumeRows(opts).map((r) => [r.label, r.totalBF_MM ?? 0]));

  it("Total Wood lumber and EWP match the Lumber and EWP cards", () => {
    const lumber = card(VOLUME_CHARTS.lumber);
    const ewp = card(VOLUME_CHARTS.ewp);
    for (const r of totalWoodRows()) {
      expect(close(r.lumber, lumber[r.label], 0.05), `${r.label} lumber ${r.lumber} vs ${lumber[r.label]}`).toBe(true);
      expect(close(r.ewp, ewp[r.label], 0.05), `${r.label} EWP ${r.ewp} vs ${ewp[r.label]}`).toBe(true);
    }
  });

  it("Demand Generated bars match the sum of their years", () => {
    for (const p of barPeriods().filter((x) => x.Years.length > 1)) {
      const yearsSum = sum(p.Years.map((y) => num(years.find((r) => r.Year === y), "Demand Generated (MM BF)")));
      expect(close(num(p, VOLUME_CHARTS.demandGenerated.periodField) ?? 0, yearsSum, 0.05), p.Period).toBe(true);
    }
  });

  it("converted projects: system types, building types and quarters reach the same total", () => {
    const quarterly = Object.fromEntries(quarterlyRows("Directly Influenced Projects").map((r) => [r.year, r.total]));
    const building = Object.fromEntries(convertedByBuilding().map((r) => [r.year, r.total]));
    for (const s of convertedBySystem()) {
      expect(s.total, `${s.year} system vs building`).toBe(building[s.year]);
      expect(s.total, `${s.year} system vs quarters`).toBe(quarterly[s.year]);
    }
  });
});

describe("years agree with their quarters", () => {
  it("official annual figures are within rounding (2 MM BF) of the quarters' sum", () => {
    for (const y of years) {
      for (const [official, sumField] of [
        ["In-Year Lumber Official (MM BF)", "In-Year Sum of Quarters (MM BF)"],
        ["Demand Generated Official (MM BF)", "DG Sum of Quarters (MM BF)"],
      ]) {
        const o = num(y, official);
        const s = num(y, sumField);
        if (o == null || !s) continue;
        expect(close(o, s, 2), `${y.Year} ${official} ${o} vs quarters ${s}`).toBe(true);
      }
    }
  });

  it("carbon benefit = carbon stored + emissions avoided in every quarter", () => {
    for (const q of quarters) {
      const total = num(q, "Carbon Benefit (MM t CO2)");
      if (total == null) continue;
      const parts = (num(q, "Carbon Stored (MM t CO2)") ?? 0) + (num(q, "Emissions Avoided (MM t CO2)") ?? 0);
      expect(close(total, parts, 0.001), q["Quarter Label"]).toBe(true);
    }
  });
});
