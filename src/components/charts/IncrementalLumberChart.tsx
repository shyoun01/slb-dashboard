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

interface IncrementalLumberChartProps {
  data: {
    year: number;
    incBF_MM?: number | null; // Direct (In-Year)
    tailBF_MM?: number | null; // Tail (3-Year Indirect)
    totalBF_MM?: number | null; // Total
    spendMM?: number | null; // Expenditures
  }[];
}

/**
 * Incremental Lumber Chart
 * ------------------------
 * Displays Direct (In-Year), Tail (3-Year Indirect), and Total lumber volumes.
 * Also shows Expenditures as a line graph.
 * Earlier years show Total only when in-year/tail data are unavailable.
 */
export default function IncrementalLumberChart({
  data,
}: IncrementalLumberChartProps) {
  // Prepare chart data
  const chartData = data.map((d) => ({
    year: d.year,
    direct:
      d.incBF_MM !== null && d.incBF_MM !== undefined
        ? d.incBF_MM
        : d.totalBF_MM ?? 0,
    tail:
      d.tailBF_MM !== null && d.tailBF_MM !== undefined
        ? d.tailBF_MM
        : 0,
    total: d.totalBF_MM ?? 0,
    expenditures: d.spendMM ?? 0,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="text-center text-lg font-semibold text-[var(--slb-charcoal)] mb-4">
        Incremental Lumber (In-Year + Tail) & Expenditures
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
          />

          <YAxis
            yAxisId="lumber"
            tickFormatter={(v) => `${v.toLocaleString()} MM`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{ value: "Lumber Volume (MM BF)", angle: -90, position: "insideLeft", dy: 65, }}
          />

          <YAxis
            yAxisId="spend"
            orientation="right"
            tickFormatter={(v) => `$${v}M`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{ value: "Expenditures ($MM)", angle: 90, position: "insideRight", dy: 65, }}
          />

          {/* Custom Tooltip */}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      padding: "10px 12px",
                      color: "#111827",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem",
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: "4px" }}>{label}</p>

                    <p style={{ fontWeight: 700, color: "#1e3a8a" }}>
                      Direct (In-Year):{" "}
                      <span style={{ color: "#111827", fontWeight: 500 }}>
                        {data.direct?.toLocaleString()} MM BF
                      </span>
                    </p>

                    <p style={{ fontWeight: 700, color: "#60a5fa" }}>
                      Tail (3-Year Indirect):{" "}
                      <span style={{ color: "#111827", fontWeight: 500 }}>
                        {data.tail?.toLocaleString()} MM BF
                      </span>
                    </p>

                    <hr
                      style={{
                        margin: "6px 0",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    />

                    <p style={{ fontWeight: 700 }}>
                      Total: {data.total?.toLocaleString()} MM BF
                    </p>

                    <p style={{ fontWeight: 700, color: "#dc2626" }}>
                      Expenditures:{" "}
                      <span style={{ color: "#111827", fontWeight: 500 }}>
                        ${data.expenditures?.toFixed(1)}M
                      </span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Legend (key) */}
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              if (value === "direct") return "Direct (In-Year)";
              if (value === "tail") return "Tail (3-Year Indirect)";
              if (value === "expenditures") return "Expenditures";
              return value;
            }}
          />

          {/* Bars — note the order: dark = Direct, light = Tail */}
          <Bar
            yAxisId="lumber"
            dataKey="direct"
            fill="#1e3a8a" // SLB dark blue
            name="Direct (In-Year)"
            stackId="a"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            yAxisId="lumber"
            dataKey="tail"
            fill="#60a5fa" // Light blue
            name="Tail (3-Year Indirect)"
            stackId="a"
            radius={[6, 6, 0, 0]}
          />

          {/* Line for Expenditures */}
          <Line
            yAxisId="spend"
            type="monotone"
            dataKey="expenditures"
            stroke="#dc2626" // Red color for expenditures
            strokeWidth={3}
            dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="expenditures"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 text-center mt-2 italic">
        *Earlier years show total incremental volume where in-year/tail data are not yet available.
      </p>
    </div>
  );
}