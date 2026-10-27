"use client";

import React from "react";
import { latestQuarter, num, quarterRec, yearRec } from "@/data/airtable";

/** Metric tons of CO2 emitted by burning one railcar of coal (EPA equivalency factor). */
const CO2_TONS_PER_RAILCAR = 181.3;

/**
 * "All cars in this area parked for one year": the state whose registered gasoline
 * vehicles (https://afdc.energy.gov/vehicle-registration, latest year) are closest to
 * WW's "Equivalent Cars off Road" figure for each column. Not stored in Airtable;
 * re-check the AFDC page and update these each quarter. The row is hidden when
 * `asOf` doesn't match the latest quarter in the data.
 */
const CARS_PARKED_STATES = {
  asOf: "2026 Q3",
  /** AFDC registration year the states were matched against */
  registrationYear: 2025,
  quarter: "Washington, DC",
  ytd: "Hawaii",
  cumulative: "New York",
};

type Column = "quarter" | "ytd" | "cumulative";

const METRICS = [
  { field: "Wood Volume", unit: " (M m3)", title: "Volume of wood", sub: <>(m m<sup>3</sup> Meters)</>, suffix: <> m m<sup>3</sup></> },
  { field: "Carbon Stored", unit: " (MM t CO2)", title: "Carbon stored", sub: <>in the wood<br />(metric tons CO<sub>2</sub>)</>, suffix: " MM" },
  {
    field: "Emissions Avoided",
    unit: " (MM t CO2)",
    title: "Emissions avoided by building with wood",
    sub: <>instead of concrete/steel<br />(metric tons CO<sub>2</sub>)</>,
    suffix: " MM",
  },
] as const;

function fmt2(n: number | null) {
  return n == null ? "—" : n.toFixed(2);
}

export default function CarbonImpactTable() {
  const latest = latestQuarter("Carbon Benefit (MM t CO2)");
  const label = `${latest.year} Q${latest.quarter}`;
  const q = quarterRec(latest.year, `Q${latest.quarter}`);
  const y = yearRec(latest.year);

  // Quarter / year-to-date / 2015-to-date values of one carbon metric
  const values = (field: string, unit: string): Record<Column, number | null> => ({
    quarter: num(q, field + unit),
    ytd: num(y, field + unit),
    cumulative: num(y, `${field} Since 2015${unit}`),
  });

  const total = values("Carbon Benefit", " (MM t CO2)");
  const columns: { key: Column; heading: string }[] = [
    { key: "quarter", heading: `Q${latest.quarter} ${latest.year}` },
    { key: "ytd", heading: `FY ${latest.year}` },
    { key: "cumulative", heading: "2015-CURRENT" },
  ];
  const showStates = CARS_PARKED_STATES.asOf === label;

  const cell = "border border-gray-300 px-3 py-2 text-center";
  const labelCell = "border border-gray-300 px-3 py-2 text-left";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        Potential Carbon Benefit
      </h3>
      <p className="mb-4 text-center text-lg font-semibold text-[var(--slb-charcoal)]">
        Through {label}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-gray-900">
          <thead>
            <tr className="bg-[#42B245] text-white">
              <th className={labelCell} />
              {columns.map((c) => (
                <th key={c.key} className={`${cell} text-base font-bold`}>
                  {c.heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m, i) => {
              const v = values(m.field, m.unit);
              return (
                <tr key={m.field} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className={labelCell}>
                    <div className="font-bold">{m.title}</div>
                    <div className="text-xs text-gray-700">{m.sub}</div>
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className={cell}>
                      {fmt2(v[c.key])}
                      {v[c.key] != null && m.suffix}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr className="bg-[#DCEAF2]">
              <td className={labelCell}>
                <div className="font-bold">TOTAL POTENTIAL CARBON BENEFIT</div>
                <div className="text-xs text-gray-700">(metric tons CO<sub>2</sub>)</div>
              </td>
              {columns.map((c) => (
                <td key={c.key} className={`${cell} font-bold`}>
                  {fmt2(total[c.key])}
                  {total[c.key] != null && " MM"}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-100">
              <td className={`${labelCell} font-bold`} colSpan={columns.length + 1}>
                EQUIVALENT TO:
              </td>
            </tr>
            {showStates && (
              <tr className="bg-white">
                <td className={labelCell}>All cars in this area parked for one year*</td>
                {columns.map((c) => (
                  <td key={c.key} className={cell}>
                    {CARS_PARKED_STATES[c.key]}
                  </td>
                ))}
              </tr>
            )}
            <tr className="bg-white">
              <td className={labelCell}>Railcars of coal not burned (000)**</td>
              {columns.map((c) => {
                const t = total[c.key];
                return (
                  <td key={c.key} className={cell}>
                    {t == null ? "—" : ((t * 1_000_000) / CO2_TONS_PER_RAILCAR / 1000).toFixed(2)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-gray-600">
        {showStates && (
          <>
            *Based on the number of registered gasoline-fueled passenger vehicles in the state in{" "}
            {CARS_PARKED_STATES.registrationYear}.{" "}
          </>
        )}
        ** One railcar has enough coal to emit (if burned) {CO2_TONS_PER_RAILCAR} metric tons of CO<sub>2</sub>.
      </p>
    </div>
  );
}
