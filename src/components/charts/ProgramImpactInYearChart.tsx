"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Row = {
  year: number;

  // In-year quarterly data (new fields in slb.json)
  inYear_q1BF_MM?: number | null;
  inYear_q2BF_MM?: number | null;
  inYear_q3BF_MM?: number | null;
  inYear_q4BF_MM?: number | null;

  // Annual in-year total (already in slb.json)
  incBF_MM?: number | null;
};

function InYearTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0]?.payload as
    | {
        year: number;
        incBF_MM: number;
        q1: number;
        q2: number;
        q3: number;
        q4: number;
      }
    | undefined;

  if (!row) return null;

  const fmt = (n: number) => `${n.toLocaleString()} MM BF`;

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

      <div style={{ color: "#111827", marginBottom: 6 }}>
        Total: {fmt(row.incBF_MM)}
      </div>

      <div style={{ color: "#f97316" }}>Quarter 4 : {fmt(row.q4)}</div>
      <div style={{ color: "#6366f1" }}>Quarter 3 : {fmt(row.q3)}</div>
      <div style={{ color: "#0ea5e9" }}>Quarter 2 : {fmt(row.q2)}</div>
      <div style={{ color: "#2563eb" }}>Quarter 1 : {fmt(row.q1)}</div>
    </div>
  );
}

export default function ProgramImpactInYearChart({ data }: { data: Row[] }) {
  const chartData = useMemo(() => {
    return (data ?? [])
      // ✅ Only include years where ALL quarterly values exist (not null AND not undefined)
      .filter(
        (d) =>
          d.inYear_q1BF_MM != null &&
          d.inYear_q2BF_MM != null &&
          d.inYear_q3BF_MM != null &&
          d.inYear_q4BF_MM != null
      )
      .map((d) => {
        // At this point, they’re guaranteed present
        const q1 = d.inYear_q1BF_MM as number;
        const q2 = d.inYear_q2BF_MM as number;
        const q3 = d.inYear_q3BF_MM as number;
        const q4 = d.inYear_q4BF_MM as number;

        // Prefer the provided annual in-year total; fall back to sum of quarters if needed
        const annual =
          typeof d.incBF_MM === "number" ? d.incBF_MM : q1 + q2 + q3 + q4;

        return {
          year: d.year,
          incBF_MM: annual,
          q1,
          q2,
          q3,
          q4,
        };
      });
  }, [data]);

  const maxBF = useMemo(() => {
    const vals = chartData.map((r) => r.incBF_MM);
    const max = vals.length ? Math.max(...vals) : 0;
    return Math.ceil(max * 1.15);
  }, [chartData]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="text-center text-lg font-semibold text-[var(--slb-charcoal)] mb-4">
        Program Impact: Lumber (In-Year)
      </h3>

      <ResponsiveContainer width="100%" height={320}>
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
            domain={[0, maxBF]}
            tickFormatter={(v) => `${v.toLocaleString()} MM`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{
              value: "In-Year Lumber (MM BF)",
              angle: -90,
              position: "insideLeft",
              dy: 65, // ✅ moves the label DOWN so it doesn't clip
              style: { fill: "#374151" },
            }}
          />

          <Tooltip content={<InYearTooltip />} />

          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              if (value === "q1") return "Q1";
              if (value === "q2") return "Q2";
              if (value === "q3") return "Q3";
              if (value === "q4") return "Q4";
              return value;
            }}
          />

          {/* Stacked quarterly bars */}
            <Bar dataKey="q1" stackId="inyear" fill="#2563eb" barSize={26} />
            <Bar dataKey="q2" stackId="inyear" fill="#0ea5e9" barSize={26} />
            <Bar dataKey="q3" stackId="inyear" fill="#6366f1" barSize={26} />
            <Bar dataKey="q4" stackId="inyear" fill="#f97316" barSize={26} />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
