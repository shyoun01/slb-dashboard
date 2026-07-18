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

type SlbRow = {
  year: number;
  incBF_MM?: number | null;
  inYear_q1BF_MM?: number | null;
  inYear_q2BF_MM?: number | null;
  inYear_q3BF_MM?: number | null;
  inYear_q4BF_MM?: number | null;
};

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
  goalLabel: number | null;
  showQuarters: boolean;
};

const PERIOD_2016_18_BF = 1298.3;
const YEAR_2026_Q1_BF = 221.9;
const YEAR_2026_Q2_BF = 221.9;
const YEAR_2026_GOAL_BF = 589;

function sumIncBfForYears(data: SlbRow[], years: number[]): number {
  return years.reduce((sum, year) => {
    const row = data.find((d) => d.year === year);
    return sum + (row?.incBF_MM ?? 0);
  }, 0);
}

const ONE_DECIMAL: Intl.NumberFormatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

function formatBfVolumeLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${n.toLocaleString("en-US", ONE_DECIMAL)} MM`;
}

function formatGoalLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${n.toLocaleString("en-US", ONE_DECIMAL)} Goal`;
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

export default function ProjectInfluenceDemandChart({
  data,
}: {
  data: SlbRow[];
}) {
  const chartData = useMemo((): PeriodRow[] => {
    const bf2019_21 = sumIncBfForYears(data, [2019, 2020, 2021]);
    const bf2022_24 = sumIncBfForYears(data, [2022, 2023, 2024]);

    const row2025 = data.find((d) => d.year === 2025);
    const q1_2025 = row2025?.inYear_q1BF_MM ?? null;
    const q2_2025 = row2025?.inYear_q2BF_MM ?? null;
    const q3_2025 = row2025?.inYear_q3BF_MM ?? null;
    const q4_2025 = row2025?.inYear_q4BF_MM ?? null;
    const total2025 =
      (q1_2025 ?? 0) + (q2_2025 ?? 0) + (q3_2025 ?? 0) + (q4_2025 ?? 0);

    const row2026 = data.find((d) => d.year === 2026);
    const q1_2026 = YEAR_2026_Q1_BF;
    const q2_2026 = YEAR_2026_Q2_BF;
    const q3_2026 = row2026?.inYear_q3BF_MM ?? null;
    const q4_2026 = row2026?.inYear_q4BF_MM ?? null;
    const total2026 =
      (q1_2026 ?? 0) + (q2_2026 ?? 0) + (q3_2026 ?? 0) + (q4_2026 ?? 0);

    const has2026Q2 = true;
    const has2026Q4 = q4_2026 != null && q4_2026 > 0;

    return [
      {
        label: "2016–18",
        totalFallback: PERIOD_2016_18_BF,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: PERIOD_2016_18_BF,
        volumeLabelAnnual: PERIOD_2016_18_BF,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: null,
        goalLabel: null,
        showQuarters: false,
      },
      {
        label: "2019–21",
        totalFallback: bf2019_21,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: bf2019_21,
        volumeLabelAnnual: bf2019_21,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: null,
        goalLabel: null,
        showQuarters: false,
      },
      {
        label: "2022–24",
        totalFallback: bf2022_24,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: bf2022_24,
        volumeLabelAnnual: bf2022_24,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: null,
        goalLabel: null,
        showQuarters: false,
      },
      {
        label: "2025",
        totalFallback: null,
        q1: q1_2025,
        q2: q2_2025,
        q3: q3_2025,
        q4: q4_2025,
        totalBF_MM: total2025,
        volumeLabelAnnual: null,
        volumeLabelQ1: null,
        volumeLabelQ2: null,
        volumeLabelQ4: total2025,
        goalLabel: null,
        showQuarters: true,
      },
      {
        label: "2026",
        totalFallback: null,
        q1: q1_2026,
        q2: q2_2026,
        q3: q3_2026,
        q4: q4_2026,
        totalBF_MM: total2026,
        volumeLabelAnnual: null,
        volumeLabelQ1: !has2026Q2 && !has2026Q4 ? total2026 : null,
        volumeLabelQ2: has2026Q2 && !has2026Q4 ? total2026 : null,
        volumeLabelQ4: has2026Q4 ? total2026 : null,
        goalLabel: YEAR_2026_GOAL_BF,
        showQuarters: true,
      },
    ];
  }, [data]);

  const maxBF = useMemo(() => {
    const vals = chartData.map((r) =>
      r.showQuarters ? quarterSum(r) : (r.totalFallback ?? 0)
    );
    const max = vals.length ? Math.max(...vals, YEAR_2026_GOAL_BF) : 0;
    return Math.ceil(max * 1.12);
  }, [chartData]);

  const totalBbfLabel = useMemo(() => {
    const totalMmBf = chartData.reduce(
      (sum, r) => sum + (r.totalBF_MM ?? 0),
      0
    );
    const totalBbf = totalMmBf / 1000;
    return `Total: ${totalBbf.toFixed(1)} BBF of Demand`;
  }, [chartData]);

  const volumeLabelProps = {
    position: "top" as const,
    offset: 8,
    formatter: formatBfVolumeLabel,
    fill: "#255D38",
    fontSize: 12,
    fontWeight: 700,
  };

  const goalLabelProps = {
    position: "top" as const,
    offset: 26,
    formatter: formatGoalLabel,
    fill: "#F78F2D",
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
        <span className="text-[var(--slb-orange)]">Lumber</span> Demand
        Created from Project Influence
      </h3>
      <p className="mb-4 text-center text-lg font-semibold text-[var(--slb-charcoal)]">
        {totalBbfLabel}
      </p>

      <ResponsiveContainer width="100%" height={540}>
        <BarChart
          data={chartData}
          margin={{ top: 64, right: 30, left: 60, bottom: 20 }}
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
            tickFormatter={(v) =>
              `${Number(v).toLocaleString("en-US", ONE_DECIMAL)} MM`
            }
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{
              value: "Lumber Volume (MM BF)",
              angle: -90,
              position: "insideLeft",
              dy: 65,
              style: { fill: "#374151" },
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
            {chartData.map((entry) => (
              <Cell
                key={`q1-${entry.label}`}
                radius={
                  entry.volumeLabelQ1 != null ? [6, 6, 0, 0] : [0, 0, 0, 0]
                }
              />
            ))}
            <LabelList
              dataKey="q1"
              {...quarterInsideLabelProps}
              fill="#ffffff"
            />
            <LabelList dataKey="volumeLabelQ1" {...volumeLabelProps} />
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
            <LabelList dataKey="goalLabel" {...goalLabelProps} />
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
