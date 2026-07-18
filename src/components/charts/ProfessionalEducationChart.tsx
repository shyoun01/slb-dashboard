"use client";

import React from "react";
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

type EducationRow = {
  year: string;
  q1: number;
  q2: number;
  q3: number | null;
  q4: number | null;
  total: number;
  totalOnQ2: number | null;
  totalOnQ4: number | null;
  goal: number | null;
};

type EducationLogo = {
  /** Path relative to /public, e.g. "/logos/aia.svg" */
  src: string;
  alt: string;
  heightClass: string;
};

type EducationChart = {
  title: string;
  rows: EducationRow[];
  /** Logos rendered below the chart legend. Leave empty to show placeholders. */
  logos: EducationLogo[];
};

function makeRow(
  year: string,
  q1: number,
  q2: number,
  q3: number | null,
  q4: number | null,
  goal: number | null = null
): EducationRow {
  const total = q1 + q2 + (q3 ?? 0) + (q4 ?? 0);
  return {
    year,
    q1,
    q2,
    q3,
    q4,
    total,
    totalOnQ2: q3 == null && q4 == null ? total : null,
    totalOnQ4: q4 != null ? total : null,
    goal,
  };
}

const CHARTS: EducationChart[] = [
  {
    title: "Education Contact Hours (M)",
    rows: [
      makeRow("2024", 22.2, 18.2, 9.2, 14.8),
      makeRow("2025", 10.7, 9.2, 9.2, 12.7),
      makeRow("2026", 9.4, 9.4, null, null, 40.0),
    ],
    logos: [
      {
        src: "/awc_logo.png",
        alt: "American Wood Council",
        heightClass: "h-24",
      },
    ],
  },
  {
    title: "CEU Course Completions (M)",
    rows: [
      makeRow("2024", 5.3, 5.0, 5.3, 13.8),
      makeRow("2025", 3.6, 4.4, 4.4, 12.9),
      makeRow("2026", 2.7, 2.7, null, null, 25.2),
    ],
    logos: [
      {
        src: "/thinkwood_logo.png",
        alt: "Think Wood",
        heightClass: "h-12",
      },
    ],
  },
  {
    title: "Practitioner Education Hours (M)",
    rows: [
      makeRow("2024", 30.1, 13.6, 12.2, 13.7),
      makeRow("2025", 22.5, 11.6, 11.3, 17.3),
      makeRow("2026", 15.6, 15.6, null, null, 48.2),
    ],
    logos: [
      {
        src: "/woodworks_logo.svg",
        alt: "WoodWorks",
        heightClass: "h-16",
      },
    ],
  },
];

function formatInsideLabel(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return number.toFixed(1);
}

function formatTotalLabel(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return number.toFixed(1);
}

function formatGoalLabel(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return `${number.toFixed(1)} Goal`;
}

function EducationSubchart({ chart }: { chart: EducationChart }) {
  const max = Math.max(...chart.rows.map((row) => row.total));
  const domainMax = Math.ceil(max * 1.18);
  const insideLabelProps = {
    position: "center" as const,
    formatter: formatInsideLabel,
    fontSize: 10,
    fontWeight: 700,
  };
  const totalLabelProps = {
    position: "top" as const,
    offset: 7,
    formatter: formatTotalLabel,
    fill: "#255D38",
    fontSize: 11,
    fontWeight: 700,
  };
  const goalLabelProps = {
    position: "top" as const,
    offset: 25,
    formatter: formatGoalLabel,
    fill: "#F78F2D",
    fontSize: 11,
    fontWeight: 700,
  };

  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white px-2 pb-2 pt-4">
      <h4 className="min-h-12 px-2 text-center text-base font-semibold text-[var(--slb-charcoal)]">
        {chart.title}
      </h4>
      <ResponsiveContainer width="100%" height={330}>
        <BarChart
          data={chart.rows}
          margin={{ top: 30, right: 10, left: 0, bottom: 12 }}
          barCategoryGap="20%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            domain={[0, domainMax]}
            tick={{ fill: "#374151", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            width={34}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            height={34}
            formatter={(value) => value.toUpperCase()}
            wrapperStyle={{
              left: 0,
              right: 0,
              width: "100%",
              fontSize: 11,
              textAlign: "center",
            }}
          />
          <Bar
            dataKey="q1"
            stackId="education"
            fill="#005F33"
            maxBarSize={64}
            name="q1"
          >
            <LabelList
              dataKey="q1"
              {...insideLabelProps}
              fill="#ffffff"
            />
          </Bar>
          <Bar
            dataKey="q2"
            stackId="education"
            fill="#42B245"
            maxBarSize={64}
            name="q2"
          >
            {chart.rows.map((row) => (
              <Cell
                key={`q2-${row.year}`}
                radius={conditionalTopCellRadius(row.totalOnQ2 != null, 5)}
              />
            ))}
            <LabelList
              dataKey="q2"
              {...insideLabelProps}
              fill="#ffffff"
            />
            <LabelList dataKey="totalOnQ2" {...totalLabelProps} />
            <LabelList dataKey="goal" {...goalLabelProps} />
          </Bar>
          <Bar
            dataKey="q3"
            stackId="education"
            fill="#7EBC41"
            maxBarSize={64}
            name="q3"
          >
            <LabelList
              dataKey="q3"
              {...insideLabelProps}
              fill="#255D38"
            />
          </Bar>
          <Bar
            dataKey="q4"
            stackId="education"
            fill="#F78F2D"
            maxBarSize={64}
            radius={[5, 5, 0, 0]}
            name="q4"
          >
            <LabelList
              dataKey="q4"
              {...insideLabelProps}
              fill="#ffffff"
            />
            <LabelList dataKey="totalOnQ4" {...totalLabelProps} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex min-h-20 flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-3">
        {chart.logos.length > 0
          ? chart.logos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                className={`${logo.heightClass} w-auto object-contain`}
              />
            ))
          : Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex h-8 w-20 items-center justify-center rounded border border-dashed border-gray-300 text-[10px] uppercase tracking-wide text-gray-400"
              >
                Logo
              </div>
            ))}
      </div>
    </div>
  );
}

export default function ProfessionalEducationChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-6 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        Professional Education
      </h3>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {CHARTS.map((chart) => (
          <EducationSubchart key={chart.title} chart={chart} />
        ))}
      </div>
    </div>
  );
}
