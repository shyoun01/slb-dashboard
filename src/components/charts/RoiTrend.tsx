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

interface RoiTrendProps {
  data: {
    year: number;
    roiPerDollar?: number | null;
    cumulativeRoiPerDollar?: number | null;
  }[];
}

/**
 * ROI Trend Chart
 * ----------------
 * Displays Yearly ROI (blue line) vs. Cumulative ROI (purple line).
 * Handles missing or partial data gracefully.
 */
export default function RoiTrend({ data }: RoiTrendProps) {
  // Clean and format data
  const chartData = data
    .filter(
      (d) =>
        d.roiPerDollar !== null &&
        d.roiPerDollar !== undefined &&
        d.cumulativeRoiPerDollar !== null &&
        d.cumulativeRoiPerDollar !== undefined
    )
    .map((d) => ({
      year: d.year,
      yearlyROI: d.roiPerDollar ?? 0,
      cumulativeROI: d.cumulativeRoiPerDollar ?? 0,
    }));

    // Dynamically set upper Y-axis limit ~10% above max Yearly ROI
const maxROI = Math.max(...chartData.map((d) => d.yearlyROI)) * 1.1;

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
  tickFormatter={(v) => `$${v.toLocaleString()}`}
  tick={{ fill: "#374151", fontSize: 12 }}
  axisLine={{ stroke: "#d1d5db" }}
  tickLine={false}
/>


          <Tooltip
            formatter={(value: number, name: string) => {
              const label =
                name === "yearlyROI" ? "Yearly ROI" : "Cumulative ROI";
              return [`$${value.toLocaleString()} per $1`, label];
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
              value === "yearlyROI" ? "Yearly ROI" : "Cumulative ROI"
            }
          />

          {/* Yearly ROI (Blue line) */}
          <Line
            type="monotone"
            dataKey="yearlyROI"
            stroke="#1e3a8a"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 1, fill: "#1e3a8a" }}
            activeDot={{ r: 6 }}
          />

          {/* Cumulative ROI (Purple line) */}
          <Line
            type="monotone"
            dataKey="cumulativeROI"
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
