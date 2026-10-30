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
import { insideLabelIfFits } from "@/components/charts/chartUtils";
import { totalWoodRows, type TotalWoodRow } from "@/data/airtable";

type PeriodRow = TotalWoodRow;

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
  const chartData = useMemo((): PeriodRow[] => totalWoodRows(), []);

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
    content: insideLabelIfFits,
    formatter: formatSegmentInsideLabel,
    fontSize: 14,
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

      {/* Taller than the other volume charts so the thin EWP slices (2025, 2026) can hold their labels */}
      <ResponsiveContainer width="100%" height={700}>
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
            tick={{ fill: "#374151", fontSize: 15 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            interval={0}
          />

          <YAxis
            domain={[0, maxVolume]}
            tickFormatter={(v) => `${v.toLocaleString("en-US")} MM`}
            tick={{ fill: "#374151", fontSize: 15 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            width={92}
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
              content={insideLabelIfFits}
              formatter={formatPanelInsideLabel}
              fontSize={14}
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
              fontSize={15}
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
