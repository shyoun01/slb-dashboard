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
} from "recharts";

interface RevenueSpendChartProps {
  data: {
    year: number;
    incrementalRevenueMM?: number | null;
    spendMM?: number | null;
  }[];
}

/**
 * Revenue vs. Expenditures Chart
 * ------------------------------
 * Displays incremental revenue (bars) vs. SLB spend (line).
 * Handles missing or null data gracefully.
 */
export default function RevenueSpendChart({ data }: RevenueSpendChartProps) {
  // Build chart-friendly data array, filtering invalid rows
  const chartData = data
    .filter((d) => d.incrementalRevenueMM !== null && d.spendMM !== null)
    .map((d) => ({
      year: d.year,
      revenue: d.incrementalRevenueMM ?? 0,
      spend: d.spendMM ?? 0,
    }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="text-center text-lg font-semibold text-[var(--slb-charcoal)] mb-4">
        Incremental Revenue vs. Expenditures
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
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
                  : "SLB Spend";
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
            fill="#60a5fa" // light blue
            barSize={30}
            radius={[6, 6, 0, 0]}
          />

          {/* Line: SLB Spend */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="spend"
            stroke="#1e3a8a" // SLB blue
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1, fill: "#1e3a8a" }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
