"use client";

import React, { useMemo } from "react";
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
} from "recharts";

type PeriodRow = {
  label: string;
  lumber: number;
  panel: number;
  ewp: number;
  total: number;
};

/** In-year lumber (MM BF) — matches ProjectInfluenceDemandChart */
const LUMBER = {
  "2016–18": 1298.3,
  "2019–21": 2076,
  "2022–24": 2341,
  "2025": 581,
  "2026": 442.2,
} as const;

/** Panel (MM SF) — MM BF in combined total = half of MM SF */
const PANEL_FACTOR = 0.5;

const PANEL = {
  "2016–18": 989.0,
  "2019–21": 1462.8,
  "2022–24": 1453.4,
  "2025": 360.2,
  "2026": 266.0,
} as const;

/** EWP (MM BF) — matches EwpInfluenceDemandChart */
const EWP = {
  "2016–18": 304.6,
  "2019–21": 461.6,
  "2022–24": 478.6,
  "2025": 118.6,
  "2026": 88.6,
} as const;

const PERIODS = [
  "2016–18",
  "2019–21",
  "2022–24",
  "2025",
  "2026",
] as const;

const ONE_DECIMAL: Intl.NumberFormatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

function formatVolumeLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 1,
    maximumFractionDigits: 1,
  })} MM`;
}

function formatSegmentInsideLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 1,
    maximumFractionDigits: 1,
  })} MM`;
}

function formatPanelInsideLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-US", ONE_DECIMAL)} MM`;
}

export default function TotalWoodDemandChart() {
  const chartData = useMemo((): PeriodRow[] => {
    return PERIODS.map((label) => {
      const lumber = LUMBER[label];
      const panel = PANEL[label] * PANEL_FACTOR;
      const ewp = EWP[label];
      return {
        label,
        lumber,
        panel,
        ewp,
        total: lumber + panel + ewp,
      };
    });
  }, []);

  const maxVolume = useMemo(() => {
    const max = Math.max(...chartData.map((r) => r.total));
    return Math.ceil(max * 1.12);
  }, [chartData]);

  const totalBbfLabel = useMemo(() => {
    const totalMm = chartData.reduce((sum, r) => sum + r.total, 0);
    return `Total: ${(totalMm / 1000).toFixed(1)} BBF of Demand`;
  }, [chartData]);

  const insideLabelProps = {
    position: "center" as const,
    formatter: formatSegmentInsideLabel,
    fontSize: 11,
    fontWeight: 700,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="mb-1 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        <span className="text-[var(--slb-orange)]">Total Wood</span> Demand
        Created from Project Influence
      </h3>
      <p className="mb-4 text-center text-lg font-semibold text-[var(--slb-charcoal)]">
        {totalBbfLabel}
      </p>

      <ResponsiveContainer width="100%" height={540}>
        <ComposedChart
          data={chartData}
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
              value: "Volume (MM)",
              angle: -90,
              position: "left",
              offset: 12,
              style: { fill: "#374151", textAnchor: "middle" },
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              if (value === "lumber") return "Lumber";
              if (value === "panel") return "Panel";
              if (value === "ewp") return "EWP";
              if (value === "total") return "Total";
              return value;
            }}
          />

          <Bar
            dataKey="lumber"
            stackId="wood"
            fill="#005F33"
            maxBarSize={96}
            name="lumber"
          >
            <LabelList
              dataKey="lumber"
              {...insideLabelProps}
              fill="#ffffff"
            />
          </Bar>
          <Bar
            dataKey="panel"
            stackId="wood"
            fill="#42B245"
            maxBarSize={96}
            name="panel"
          >
            <LabelList
              dataKey="panel"
              position="center"
              formatter={formatPanelInsideLabel}
              fontSize={11}
              fontWeight={700}
              fill="#ffffff"
            />
          </Bar>
          <Bar
            dataKey="ewp"
            stackId="wood"
            fill="#F78F2D"
            maxBarSize={96}
            radius={[6, 6, 0, 0]}
            name="ewp"
          >
            <LabelList dataKey="ewp" {...insideLabelProps} fill="#ffffff" />
            <LabelList
              dataKey="total"
              position="top"
              offset={8}
              formatter={formatVolumeLabel}
              fill="#255D38"
              fontSize={12}
              fontWeight={700}
            />
          </Bar>

          {/* Invisible series so Total appears in the standard legend */}
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
