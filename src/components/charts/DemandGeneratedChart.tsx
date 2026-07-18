"use client";

import React, { useMemo } from "react";
import { conditionalTopCellRadius } from "@/components/charts/chartUtils";
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
  totalBF_MM?: number | null;
  q1BF_MM?: number | null;
  q2BF_MM?: number | null;
  q3BF_MM?: number | null;
  q4BF_MM?: number | null;
};

type PeriodRow = {
  label: string;
  totalFallback: number | null;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  totalBF_MM: number | null;
  /** Label value for period (non-quarterly) bars only. */
  volumeLabelAnnual: number | null;
  /** Set only when Q2 is the top segment (e.g. 2026). */
  volumeLabelQ2: number | null;
  /** Set only when Q4 is the top segment (e.g. 2025). */
  volumeLabelQ4: number | null;
  /** 2026 goal callout, drawn above the volume total. */
  goalLabel: number | null;
  showQuarters: boolean;
};

const PERIOD_2012_15_BF = 1683;
const PERIOD_2016_18_BF = 3182;
const YEAR_2026_Q1_BF = 514;
const YEAR_2026_Q2_BF = 600;
const YEAR_2026_GOAL_BF = 1350;

function sumTotalBfForYears(data: SlbRow[], years: number[]): number {
  return years.reduce((sum, year) => {
    const row = data.find((d) => d.year === year);
    return sum + (row?.totalBF_MM ?? 0);
  }, 0);
}

function formatBfVolumeLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${Math.round(n).toLocaleString("en-US")} MM`;
}

function formatGoalLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${n.toLocaleString("en-US")} Goal`;
}

function formatQuarterInsideLabel(value: unknown) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-US")} MM`;
}

function quarterSum(row: PeriodRow) {
  return (row.q1 ?? 0) + (row.q2 ?? 0) + (row.q3 ?? 0) + (row.q4 ?? 0);
}

export default function DemandGeneratedChart({ data }: { data: SlbRow[] }) {
  const chartData = useMemo((): PeriodRow[] => {
    const bf2019_21 = sumTotalBfForYears(data, [2019, 2020, 2021]);
    const bf2022_24 = sumTotalBfForYears(data, [2022, 2023, 2024]);
    const row2025 = data.find((d) => d.year === 2025);
    const q1_2025 = row2025?.q1BF_MM ?? null;
    const q2_2025 = row2025?.q2BF_MM ?? null;
    const q3_2025 = row2025?.q3BF_MM ?? null;
    const q4_2025 = row2025?.q4BF_MM ?? null;
    const total2025 =
      (q1_2025 ?? 0) + (q2_2025 ?? 0) + (q3_2025 ?? 0) + (q4_2025 ?? 0);
    const total2026 = YEAR_2026_Q1_BF + YEAR_2026_Q2_BF;

    return [
      {
        label: "2012–15",
        totalFallback: PERIOD_2012_15_BF,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: PERIOD_2012_15_BF,
        volumeLabelAnnual: PERIOD_2012_15_BF,
        volumeLabelQ2: null,
        volumeLabelQ4: null,
        goalLabel: null,
        showQuarters: false,
      },
      {
        label: "2016–18",
        totalFallback: PERIOD_2016_18_BF,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        totalBF_MM: PERIOD_2016_18_BF,
        volumeLabelAnnual: PERIOD_2016_18_BF,
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
        volumeLabelQ2: null,
        volumeLabelQ4: total2025,
        goalLabel: null,
        showQuarters: true,
      },
      {
        label: "2026",
        totalFallback: null,
        q1: YEAR_2026_Q1_BF,
        q2: YEAR_2026_Q2_BF,
        q3: null,
        q4: null,
        totalBF_MM: total2026,
        volumeLabelAnnual: null,
        volumeLabelQ2: total2026,
        volumeLabelQ4: null,
        goalLabel: YEAR_2026_GOAL_BF,
        showQuarters: true,
      },
    ];
  }, [data]);

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
        Demand Generated by SLB-Funded Programs
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
            tickFormatter={(v) => `${v.toLocaleString("en-US")} MM`}
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
                radius={conditionalTopCellRadius(entry.volumeLabelQ2 != null)}
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
