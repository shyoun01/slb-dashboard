"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { num, periodRec } from "@/data/airtable";
import { SpendLineLabel } from "@/components/charts/SpendLineLabel";

interface RevenueSpendChartProps {
  data: {
    year: number;
    incrementalRevenueMM?: number | null;
    spendMM?: number | null;
    incBF_MM?: number | null;
    tailBF_MM?: number | null;
  }[];
  showBfImpactTable?: boolean;
}

const BF_TABLE_YEAR_MIN = 2021;
const BF_TABLE_YEAR_MAX = 2025;

/** Cumulative in-year and indirect MM BF for 2012–2020 */
const BF_IMPACT_PERIOD = periodRec("2012–20 (BF impact table)");
const PERIOD_2012_20 = {
  label: "2012–20",
  inYear: num(BF_IMPACT_PERIOD, "BF Impact In-Year Published") ?? 0,
  indirect: num(BF_IMPACT_PERIOD, "BF Impact Indirect Published") ?? 0,
} as const;

/**
 * Revenue vs. Expenditures Chart
 * ------------------------------
 * Displays incremental revenue (bars) vs. SLB spend (line).
 * Handles missing or null data gracefully.
 */
export default function RevenueSpendChart({
  data,
  showBfImpactTable = false,
}: RevenueSpendChartProps) {
  // Build chart-friendly data array, filtering invalid rows
  const chartData = data
    .filter((d) => d.incrementalRevenueMM !== null && d.spendMM !== null)
    .map((d) => ({
      year: d.year,
      revenue: d.incrementalRevenueMM ?? 0,
      spend: d.spendMM ?? 0,
    }));

  const bfTableYears = data
    .filter(
      (d) =>
        d.year >= BF_TABLE_YEAR_MIN &&
        d.year <= BF_TABLE_YEAR_MAX &&
        d.incBF_MM != null &&
        d.tailBF_MM != null
    )
    .sort((a, b) => a.year - b.year);

  const period2021_25InYear = bfTableYears.reduce(
    (sum, row) => sum + row.incBF_MM!,
    0
  );
  const period2021_25Indirect = bfTableYears.reduce(
    (sum, row) => sum + row.tailBF_MM!,
    0
  );
  const period2021_25Total = period2021_25InYear + period2021_25Indirect;

  const period2012_20Total =
    PERIOD_2012_20.inYear + PERIOD_2012_20.indirect;

  const fmtBf = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="text-center text-lg font-semibold text-[var(--slb-charcoal)] mb-4">
        Incremental Revenue vs. Expenditures
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 44, right: 40, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
          />

          <YAxis
            yAxisId="left"
            tickFormatter={(v) => `$${v.toLocaleString()}M`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            label={{ value: "Revenue", angle: -90, position: "insideLeft", dy: 25, dx: -10 }}
            tickLine={false}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `$${v.toLocaleString()}M`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            label={{ value: "Expenditures ($MM)", angle: 90, position: "insideRight", dy: 65, }}
            tickLine={false}
          />

          <Tooltip
            formatter={(value: number, name: string) => {
              const label =
                name === "revenue"
                  ? "Incremental Revenue"
                  : "Expenditures";
              return [`$${value.toLocaleString()}M`, label];
            }}
            labelFormatter={(year) => `${year}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) =>
              value === "revenue"
                ? "Incremental Revenue"
                : "Expenditures"
            }
          />

          {/* Bars: Incremental Revenue */}
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="#7EBC41" // Light green
            barSize={30}
            radius={[6, 6, 0, 0]}
          />

          {/* Line: Expenditures */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="spend"
            stroke="#EF7328"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1, fill: "#EF7328" }}
            activeDot={{ r: 6 }}
          >
            <LabelList dataKey="spend" content={<SpendLineLabel />} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>

      {showBfImpactTable && bfTableYears.length > 0 && (
        <div className="bf-impact-table mt-6 border-t border-gray-200 pt-4">
          <h4 className="mb-3 text-center text-sm font-semibold text-[var(--slb-charcoal)]">
            Incremental BF Impact
          </h4>
          <div className="overflow-x-auto">
            <table className="mx-auto w-full max-w-4xl border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700" />
                  <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-center font-semibold text-gray-700">
                    {PERIOD_2012_20.label}
                  </th>
                  {bfTableYears.map((row) => (
                    <th
                      key={row.year}
                      className="border border-gray-200 bg-gray-50 px-3 py-2 text-center font-semibold text-gray-700"
                    >
                      {row.year}
                    </th>
                  ))}
                  <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-center font-semibold text-gray-700">
                    2021–25
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700">
                    In-Year (MM BF)
                  </th>
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-900">
                    {fmtBf(PERIOD_2012_20.inYear)}
                  </td>
                  {bfTableYears.map((row) => (
                    <td
                      key={row.year}
                      className="border border-gray-200 px-3 py-2 text-center text-gray-900"
                    >
                      {fmtBf(row.incBF_MM!)}
                    </td>
                  ))}
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-900">
                    {fmtBf(period2021_25InYear)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700">
                    Indirect (MM BF)
                  </th>
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-900">
                    {fmtBf(PERIOD_2012_20.indirect)}
                  </td>
                  {bfTableYears.map((row) => (
                    <td
                      key={row.year}
                      className="border border-gray-200 px-3 py-2 text-center text-gray-900"
                    >
                      {fmtBf(row.tailBF_MM!)}
                    </td>
                  ))}
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-900">
                    {fmtBf(period2021_25Indirect)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700">
                    Total
                  </th>
                  <td className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-900">
                    {fmtBf(period2012_20Total)}
                  </td>
                  {bfTableYears.map((row) => (
                    <td
                      key={row.year}
                      className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-900"
                    >
                      {fmtBf(row.incBF_MM! + row.tailBF_MM!)}
                    </td>
                  ))}
                  <td className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-900">
                    {fmtBf(period2021_25Total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
