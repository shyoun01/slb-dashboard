"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { YearRow } from "@/data/slb.schema";

/**
 * ROI Trend Chart
 * ----------------
 * Uses the same loadYears() data as the rest of the dashboard. Hover values are:
 * - roiPerDollar  = same as "ROI (Year)" in Annual ROI Overview
 * - cumulativeRoiPerDollar = same as Cumulative ROI Summary card and "Cumulative ROI (Year)" KPI
 */
export default function RoiTrend({ data }: { data: YearRow[] }) {
  const chartData = data.filter(
    (d) =>
      d.roiPerDollar != null && d.cumulativeRoiPerDollar != null
  ) as (YearRow & { roiPerDollar: number; cumulativeRoiPerDollar: number })[];

  const maxROI = chartData.length
    ? Math.max(...chartData.map((d) => d.roiPerDollar)) * 1.1
    : 100;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      {/* Chart Title */}
      <h3 className="text-center text-lg font-semibold text-[var(--slb-charcoal)] mb-4">
        ROI Trend (Yearly vs. Cumulative)
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart
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
            domain={[0, maxROI]}
            tickFormatter={(v) => `$${Number(v).toFixed(2)}`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
          />

          <Tooltip
            formatter={(value: number, name: string) => {
              const label =
                name === "roiPerDollar" ? "Yearly ROI" : "Cumulative ROI";
              return [`$${Number(value).toFixed(2)} per $1`, label];
            }}
            labelFormatter={(year) => `Year: ${year}`}
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
              value === "roiPerDollar" ? "Yearly ROI" : "Cumulative ROI"
            }
          />

          <Line
            type="monotone"
            dataKey="roiPerDollar"
            name="Yearly ROI"
            stroke="#1e3a8a"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 1, fill: "#1e3a8a" }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="cumulativeRoiPerDollar"
            name="Cumulative ROI"
            stroke="#9333ea"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 1, fill: "#9333ea" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
