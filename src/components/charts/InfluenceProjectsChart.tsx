"use client";

import React, { useMemo } from "react";
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

type SlbRow = {
  year: number;

  // Annual totals
  totalBF_MM?: number | null;
  incBF_MM?: number | null;
  tailBF_MM?: number | null;

  // Quarterly (when available)
  q1BF_MM?: number | null;
  q2BF_MM?: number | null;
  q3BF_MM?: number | null;
  q4BF_MM?: number | null;

  // New series
  projects?: number | null;
};

// Custom tooltip so we can control ordering and add "Total" where quarters exist
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  // All bars/lines share the same payload row
  const row = payload[0]?.payload;

  const hasQuarters =
    row?.q1 !== null &&
    row?.q1 !== undefined &&
    row?.q2 !== null &&
    row?.q2 !== undefined &&
    row?.q3 !== null &&
    row?.q3 !== undefined &&
    row?.q4 !== null &&
    row?.q4 !== undefined;

  const fmtBF = (n: number) => `${n.toLocaleString()} MM BF`;

  const projects = typeof row?.projects === "number" ? row.projects : null;

  // NEW: show annual total between Projects and Quarter 1 when quarterly data exists
  const total =
    hasQuarters && typeof row?.totalBF_MM === "number" ? row.totalBF_MM : null;

  const q1 = typeof row?.q1 === "number" ? row.q1 : null;
  const q2 = typeof row?.q2 === "number" ? row.q2 : null;
  const q3 = typeof row?.q3 === "number" ? row.q3 : null;
  const q4 = typeof row?.q4 === "number" ? row.q4 : null;

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "10px 12px",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>

      {projects !== null && (
        <div style={{ color: "#7c3aed", marginBottom: 6 }}>
          Projects : {projects.toLocaleString()}
        </div>
      )}

      {total !== null && (
        <div style={{ color: "#111827", marginBottom: 6 }}>
          Total: {fmtBF(total)}
        </div>
      )}

      {/* Quarters (match stacked bar order: Q4 at top → Q1 at bottom) */}
      {hasQuarters && q4 !== null && (
        <div style={{ color: "#f59e0b" }}>Quarter 4 : {fmtBF(q4)}</div>
      )}
      {hasQuarters && q3 !== null && (
        <div style={{ color: "#a3e635" }}>Quarter 3 : {fmtBF(q3)}</div>
      )}
      {hasQuarters && q2 !== null && (
        <div style={{ color: "#22c55e" }}>Quarter 2 : {fmtBF(q2)}</div>
      )}
      {hasQuarters && q1 !== null && (
        <div style={{ color: "#14b8a6" }}>Quarter 1 : {fmtBF(q1)}</div>
      )}
    </div>
  );
}

export default function InfluenceProjectsChart({ data }: { data: SlbRow[] }) {
  const chartData = useMemo(() => {
  return (data ?? [])
    // ⬇️ NEW: only include years with quarterly data
    .filter(
      (d) =>
        d.q1BF_MM !== null &&
        d.q2BF_MM !== null &&
        d.q3BF_MM !== null &&
        d.q4BF_MM !== null
    )
    .map((d) => {
      const hasQuarters = true;


        return {
          year: d.year,

          // Total BF (for tooltip)
          totalBF_MM: d.totalBF_MM ?? null,

          // Quarter stack (only when available)
          q1: hasQuarters ? (d.q1BF_MM ?? 0) : null,
          q2: hasQuarters ? (d.q2BF_MM ?? 0) : null,
          q3: hasQuarters ? (d.q3BF_MM ?? 0) : null,
          q4: hasQuarters ? (d.q4BF_MM ?? 0) : null,

          // Fallback single bar when quarters aren’t available
          totalFallback: hasQuarters ? null : (d.totalBF_MM ?? null),

          // Context (not shown in tooltip currently, but kept)
          incBF_MM: d.incBF_MM ?? null,
          tailBF_MM: d.tailBF_MM ?? null,

          // Line series
          projects: d.projects ?? null,
        };
      });
  }, [data]);

  const maxBF = useMemo(() => {
    const bfVals: number[] = [];
    for (const r of chartData) {
      if (typeof r.totalBF_MM === "number") bfVals.push(r.totalBF_MM);

      const qSum =
        (typeof r.q1 === "number" ? r.q1 : 0) +
        (typeof r.q2 === "number" ? r.q2 : 0) +
        (typeof r.q3 === "number" ? r.q3 : 0) +
        (typeof r.q4 === "number" ? r.q4 : 0);
      if (qSum > 0) bfVals.push(qSum);

      if (typeof r.totalFallback === "number") bfVals.push(r.totalFallback);
    }
    const max = bfVals.length ? Math.max(...bfVals) : 0;
    return Math.ceil(max * 1.12);
  }, [chartData]);

  const maxProjects = useMemo(() => {
    const vals = chartData
      .map((r) => (typeof r.projects === "number" ? r.projects : null))
      .filter((v): v is number => v !== null);
    const max = vals.length ? Math.max(...vals) : 0;
    return Math.ceil(max * 1.12);
  }, [chartData]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="text-center text-lg font-semibold text-[var(--slb-charcoal)] mb-4">
        Program Impact (In-Year &amp; Tail) &amp; Projects Converted
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 50, left: 60, bottom: 20 }}
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
            domain={[0, maxBF]}
            tickFormatter={(v) => `${v.toLocaleString()} MM`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{
              value: "Lumber Volume (MM BF)",
              angle: -90,
              position: "insideLeft",
              dy: 65, // prevent clipping
              style: { fill: "#374151" },
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, maxProjects]}
            tickFormatter={(v) => v.toLocaleString()}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{
              value: "Projects Converted",
              angle: 90,
              position: "insideRight",
              dy: 65, // prevent clipping
              style: { fill: "#374151" },
            }}
          />

          {/* ✅ Controlled tooltip ordering + NEW Total line */}
          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              if (value === "totalFallback") return "Total BF (Annual)";
              if (value === "q1") return "Q1";
              if (value === "q2") return "Q2";
              if (value === "q3") return "Q3";
              if (value === "q4") return "Q4";
              if (value === "projects") return "Projects Converted";
              return value;
            }}
          />

          {/* Bars */}
          <Bar
            yAxisId="left"
            dataKey="totalFallback"
            stackId="bf"
            fill="#34d399"
            barSize={26}
            radius={[6, 6, 0, 0]}
            legendType="none"
          />

          <Bar yAxisId="left" dataKey="q1" stackId="bf" fill="#14b8a6" />
          <Bar yAxisId="left" dataKey="q2" stackId="bf" fill="#22c55e" />
          <Bar yAxisId="left" dataKey="q3" stackId="bf" fill="#a3e635" />
          <Bar yAxisId="left" dataKey="q4" stackId="bf" fill="#f59e0b" />

          {/* Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="projects"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1, fill: "#7c3aed" }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

    </div>
  );
}
