"use client";

import React, { useMemo } from "react";
import { conditionalTopCellRadius } from "@/components/charts/chartUtils";
import { volumeRows, type VolumeRow } from "@/data/airtable";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

type PeriodRow = VolumeRow;

const ONE_DECIMAL: Intl.NumberFormatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

function formatVolumeLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${n.toLocaleString("en-US", ONE_DECIMAL)} MM`;
}

function formatQuarterInsideLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-US", ONE_DECIMAL)} MM`;
}

function quarterSum(row: PeriodRow) {
  return (row.q1 ?? 0) + (row.q2 ?? 0) + (row.q3 ?? 0) + (row.q4 ?? 0);
}

export default function PanelInfluenceDemandChart() {
  const chartData = useMemo(
    (): PeriodRow[] =>
      volumeRows({
        periodField: "Panel (MM SF)",
        quarterField: "Panel (MM SF)",
        publishedField: "Panel Published (MM SF)",
        skip: ["2012–15"],
      }),
    []
  );

  const maxBF = useMemo(() => {
    const vals = chartData.map((r) =>
      r.showQuarters ? quarterSum(r) : (r.totalFallback ?? 0)
    );
    const max = vals.length ? Math.max(...vals) : 0;
    return Math.ceil(max * 1.12);
  }, [chartData]);

  const totalBbfLabel = useMemo(() => {
    const totalMmBf = chartData.reduce(
      (sum, r) => sum + (r.totalBF_MM ?? 0),
      0
    );
    const totalBbf = totalMmBf / 1000;
    return `Total: ${totalBbf.toFixed(1)} BSF of Demand`;
  }, [chartData]);

  const volumeLabelProps = {
    position: "top" as const,
    offset: 8,
    formatter: formatVolumeLabel,
    fill: "#255D38",
    fontSize: 12,
    fontWeight: 700,
  };

  const quarterInsideLabelProps = {
    position: "center" as const,
    formatter: formatQuarterInsideLabel,
    fontSize: 11,
    fontWeight: 700,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="mb-1 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        <span className="text-[var(--slb-orange)]">Panel</span> Demand Created
        from Project Influence
      </h3>
      <p className="mb-4 text-center text-lg font-semibold text-[var(--slb-charcoal)]">
        {totalBbfLabel}
      </p>

      <ResponsiveContainer width="100%" height={540}>
        <BarChart
          data={chartData}
          margin={{ top: 64, right: 30, left: 88, bottom: 20 }}
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
            domain={[0, maxBF]}
            tickFormatter={(v) => `${v.toLocaleString("en-US")} MM`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            width={78}
            label={{
              value: 'Panel Volume (MM SF, 3/8" Basis)',
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
              if (value === "totalFallback") return "Total SF";
              if (value === "q1") return "Q1";
              if (value === "q2") return "Q2";
              if (value === "q3") return "Q3";
              if (value === "q4") return "Q4";
              return value;
            }}
          />

          <Bar
            dataKey="totalFallback"
            stackId="bf"
            fill="#42B245"
            maxBarSize={96}
            radius={[6, 6, 0, 0]}
            name="totalFallback"
          >
            <LabelList dataKey="volumeLabelAnnual" {...volumeLabelProps} />
          </Bar>
          <Bar
            dataKey="q1"
            stackId="bf"
            fill="#005F33"
            maxBarSize={96}
            name="q1"
          >
            <LabelList
              dataKey="q1"
              {...quarterInsideLabelProps}
              fill="#ffffff"
            />
            {chartData.map((entry) => (
              <Cell
                key={`q1-${entry.label}`}
                radius={conditionalTopCellRadius(entry.volumeLabelQ1 != null)}
              />
            ))}
            <LabelList dataKey="volumeLabelQ1" {...volumeLabelProps} />
          </Bar>
          <Bar
            dataKey="q2"
            stackId="bf"
            fill="#42B245"
            maxBarSize={96}
            name="q2"
          >
            <LabelList
              dataKey="q2"
              {...quarterInsideLabelProps}
              fill="#ffffff"
            />
            {chartData.map((entry) => (
              <Cell
                key={`q2-${entry.label}`}
                radius={conditionalTopCellRadius(entry.volumeLabelQ2 != null)}
              />
            ))}
            <LabelList dataKey="volumeLabelQ2" {...volumeLabelProps} />
          </Bar>
          <Bar
            dataKey="q3"
            stackId="bf"
            fill="#7EBC41"
            maxBarSize={96}
            name="q3"
          >
            <LabelList
              dataKey="q3"
              {...quarterInsideLabelProps}
              fill="#255D38"
            />
            {chartData.map((entry) => (
              <Cell
                key={`q3-${entry.label}`}
                radius={conditionalTopCellRadius(entry.volumeLabelQ3 != null)}
              />
            ))}
            <LabelList dataKey="volumeLabelQ3" {...volumeLabelProps} />
          </Bar>
          <Bar
            dataKey="q4"
            stackId="bf"
            fill="#F78F2D"
            maxBarSize={96}
            radius={[6, 6, 0, 0]}
            name="q4"
          >
            <LabelList
              dataKey="q4"
              {...quarterInsideLabelProps}
              fill="#ffffff"
            />
            <LabelList dataKey="volumeLabelQ4" {...volumeLabelProps} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
