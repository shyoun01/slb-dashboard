"use client";

import React, { useMemo } from "react";
import { conditionalTopCellRadius } from "@/components/charts/chartUtils";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
  Cell,
} from "recharts";
import { barPeriods, isSingleYear, num } from "@/data/airtable";

type PeriodRow = {
  label: string;
  l1: number | null;
  l2: number | null;
  l3: number | null;
  l4: number | null;
  total: number;
  topSegment: "l1" | "l2" | "l3" | "l4";
};

/** Single-year bars show the tail layers; multi-year bars show the period total. */
const CHART_DATA: PeriodRow[] = barPeriods().map((p) => {
  if (!isSingleYear(p)) {
    const total = Math.round(num(p, "Demand Realized Total (MM BF)") ?? 0);
    return { label: p.Period, l1: total, l2: null, l3: null, l4: null, total, topSegment: "l1" };
  }
  const seg = (field: string) => Math.round(num(p, field) ?? 0);
  const [l1, l2, l3, l4] = [seg("DR 25% 3-Yr Tail"), seg("DR 25% 2-Yr Tail"), seg("DR 50% Prior-Yr Tail"), seg("DR Direct")];
  const published = num(p, "Demand Realized Total Published (MM BF)");
  return { label: p.Period, l1, l2, l3, l4, total: published ?? l1 + l2 + l3 + l4, topSegment: "l4" };
});

const SEGMENTS = [
  { key: "l1" as const, fill: "#005F33", labelFill: "#ffffff" },
  { key: "l2" as const, fill: "#42B245", labelFill: "#ffffff" },
  { key: "l3" as const, fill: "#7EBC41", labelFill: "#255D38" },
  { key: "l4" as const, fill: "#F78F2D", labelFill: "#ffffff" },
];

function formatSegmentInsideLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-US")} MM`;
}

function formatVolumeLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-US")} MM`;
}

function legendLabel(value: string) {
  if (value === "l1") return "25% 3 Yr. ago tail";
  if (value === "l2") return "25% 2 Yr. Ago Tail";
  if (value === "l3") return "50% Prior Yr. Tail";
  if (value === "l4") return "Direct in Current Yr.";
  if (value === "total") return "Total";
  return value;
}

export default function DemandRealizedChart() {
  const maxVolume = useMemo(() => {
    const max = Math.max(...CHART_DATA.map((row) => row.total));
    return Math.ceil(max * 1.12);
  }, []);

  const totalBbfLabel = useMemo(() => {
    const totalMm = CHART_DATA.reduce((sum, row) => sum + row.total, 0);
    return `Total: ${(totalMm / 1000).toFixed(1)} BBF of Demand`;
  }, []);

  const insideLabelProps = {
    position: "center" as const,
    formatter: formatSegmentInsideLabel,
    fontSize: 11,
    fontWeight: 700,
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        <span className="text-[var(--slb-orange)]">Demand Realized</span> by
        SLB-Funded Programs
      </h3>
      <p className="mb-4 text-center text-lg font-semibold text-[var(--slb-charcoal)]">
        {totalBbfLabel}
      </p>

      <ResponsiveContainer width="100%" height={540}>
        <ComposedChart
          data={CHART_DATA}
          margin={{ top: 48, right: 30, left: 72, bottom: 20 }}
          barCategoryGap="18%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="label"
            type="category"
            tick={{ fill: "#374151", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            interval={0}
          />

          <YAxis
            domain={[0, maxVolume]}
            tickFormatter={(v) => `${v.toLocaleString("en-US")} MM`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            width={64}
            label={{
              value: "Volume (MM BF)",
              angle: -90,
              position: "left",
              offset: 12,
              style: { fill: "#374151", textAnchor: "middle" },
            }}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            height={52}
            formatter={legendLabel}
            wrapperStyle={{
              left: 0,
              right: 0,
              width: "100%",
              fontSize: 10,
              textAlign: "center",
            }}
          />

          {SEGMENTS.map((segment) => (
            <Bar
              key={segment.key}
              dataKey={segment.key}
              stackId="demand"
              fill={segment.fill}
              maxBarSize={96}
              name={segment.key}
            >
              {CHART_DATA.map((row) => (
                <Cell
                  key={`${segment.key}-${row.label}`}
                  radius={conditionalTopCellRadius(
                    row.topSegment === segment.key
                  )}
                />
              ))}
              <LabelList
                dataKey={segment.key}
                {...insideLabelProps}
                fill={segment.labelFill}
              />
              <LabelList
                dataKey="total"
                position="top"
                offset={8}
                formatter={formatVolumeLabel}
                fill="#255D38"
                fontSize={12}
                fontWeight={700}
                content={({ x, y, width, value, index }) => {
                  const row = CHART_DATA[index ?? 0];
                  if (row?.topSegment !== segment.key) return null;
                  if (x == null || y == null || width == null || value == null) {
                    return null;
                  }
                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(y) - 8}
                      fill="#255D38"
                      fontSize={12}
                      fontWeight={700}
                      textAnchor="middle"
                    >
                      {formatVolumeLabel(value)}
                    </text>
                  );
                }}
              />
            </Bar>
          ))}

          <Line
            dataKey="total"
            name="total"
            stroke="#255D38"
            strokeWidth={0}
            dot={false}
            activeDot={false}
            legendType="square"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
