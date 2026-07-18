"use client";

import React, { useMemo } from "react";
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

type PeriodRow = {
  label: string;
  totalFallback: number | null;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  totalBF_MM: number | null;
  volumeLabelAnnual: number | null;
  volumeLabelQ1: number | null;
  volumeLabelQ2: number | null;
  volumeLabelQ4: number | null;
  showQuarters: boolean;
};

const PERIOD_2016_18 = 989.0;
const PERIOD_2019_21 = 1462.8;
const PERIOD_2022_24 = 1453.4;
const YEAR_2025_Q1 = 83.2;
const YEAR_2025_Q2 = 106.4;
const YEAR_2025_Q3 = 90.7;
const YEAR_2025_Q4 = 79.8;
const YEAR_2025_TOTAL = 360.2;
const YEAR_2026_Q1 = 135.1;
const YEAR_2026_Q2 = 135.1;

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
  const chartData = useMemo((): PeriodRow[] => {
    const total2025 = YEAR_2025_TOTAL;
    const total2026 = YEAR_2026_Q1 + YEAR_2026_Q2;

    return [
      {
        label: "2016–18",
        totalFallback: PERIOD_2016_18,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: PERIOD_2016_18,
        volumeLabelAnnual: PERIOD_2016_18,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: null,
        showQuarters: false,
      },
      {
        label: "2019–21",
        totalFallback: PERIOD_2019_21,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: PERIOD_2019_21,
        volumeLabelAnnual: PERIOD_2019_21,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: null,
        showQuarters: false,
      },
      {
        label: "2022–24",
        totalFallback: PERIOD_2022_24,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: PERIOD_2022_24,
        volumeLabelAnnual: PERIOD_2022_24,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: null,
        showQuarters: false,
      },
      {
        label: "2025",
        totalFallback: null,
        q1: YEAR_2025_Q1,
        q2: YEAR_2025_Q2,
        q3: YEAR_2025_Q3,
        q4: YEAR_2025_Q4,
        totalBF_MM: total2025,
        volumeLabelAnnual: null,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: total2025,
        showQuarters: true,
      },
      {
        label: "2026",
        totalFallback: null,
        q1: YEAR_2026_Q1,
        q2: YEAR_2026_Q2,
        q3: null,
        q4: null,
        totalBF_MM: total2026,
        volumeLabelAnnual: null,
        volumeLabelQ1: null,
        volumeLabelQ2: total2026,
        volumeLabelQ4: null,
        showQuarters: true,
      },
    ];
  }, []);

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
              if (value === "totalFallback") return "Total BF";
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
          </Bar>
          <Bar
            dataKey="q2"
            stackId="bf"
            fill="#42B245"
            maxBarSize={96}
            name="q2"
          >
            {chartData.map((entry) => (
              <Cell
                key={`q2-${entry.label}`}
                radius={
                  entry.volumeLabelQ2 != null ? [6, 6, 0, 0] : [0, 0, 0, 0]
                }
              />
            ))}
            <LabelList
              dataKey="q2"
              {...quarterInsideLabelProps}
              fill="#ffffff"
            />
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
