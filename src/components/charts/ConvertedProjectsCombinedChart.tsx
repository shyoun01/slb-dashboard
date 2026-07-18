"use client";

import { conditionalTopCellRadius } from "@/components/charts/chartUtils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type QuarterlyRow = {
  year: string;
  q1: number;
  q2: number;
  q3: number | null;
  q4: number | null;
  totalOnQ2: number | null;
  totalOnQ4: number | null;
  goal: number | null;
};

type SystemTypeRow = {
  year: string;
  lightFrame: number;
  hybridMtLf: number;
  heavyMt: number;
  total: number;
};

type BuildingTypeRow = {
  year: string;
  multifamily: number;
  commercial: number;
  institutional: number;
  warehouse: number;
  other: number;
  total: number;
};

const QUARTERLY_DATA: QuarterlyRow[] = [
  {
    year: "2024",
    q1: 87,
    q2: 97,
    q3: 106,
    q4: 101,
    totalOnQ2: null,
    totalOnQ4: 391,
    goal: null,
  },
  {
    year: "2025",
    q1: 91,
    q2: 97,
    q3: 111,
    q4: 106,
    totalOnQ2: null,
    totalOnQ4: 405,
    goal: null,
  },
  {
    year: "2026",
    q1: 105,
    q2: 109,
    q3: null,
    q4: null,
    totalOnQ2: 214,
    totalOnQ4: null,
    goal: 373,
  },
];

const SYSTEM_TYPE_DATA: SystemTypeRow[] = [
  { year: "2024", lightFrame: 264, hybridMtLf: 30, heavyMt: 97, total: 391 },
  { year: "2025", lightFrame: 267, hybridMtLf: 32, heavyMt: 106, total: 405 },
  { year: "2026", lightFrame: 133, hybridMtLf: 17, heavyMt: 64, total: 214 },
];

const BUILDING_TYPE_DATA: BuildingTypeRow[] = [
  {
    year: "2024",
    multifamily: 215,
    commercial: 63,
    institutional: 106,
    warehouse: 7,
    other: 0,
    total: 391,
  },
  {
    year: "2025",
    multifamily: 211,
    commercial: 73,
    institutional: 117,
    warehouse: 4,
    other: 0,
    total: 405,
  },
  {
    year: "2026",
    multifamily: 120,
    commercial: 34,
    institutional: 60,
    warehouse: 0,
    other: 0,
    total: 214,
  },
];

type StripSegment = {
  label: string;
  value: number;
  color: string;
};

function formatPercent(value: number, total: number) {
  if (total <= 0) return "";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function formatWholeNumber(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return number.toLocaleString("en-US");
}

function formatGoal(value: unknown) {
  const formatted = formatWholeNumber(value);
  return formatted ? `${formatted} Goal` : "";
}

const insideLabelProps = {
  position: "center" as const,
  formatter: formatWholeNumber,
  fontSize: 10,
  fontWeight: 700,
};

const totalLabelProps = {
  position: "top" as const,
  offset: 7,
  formatter: formatWholeNumber,
  fill: "#255D38",
  fontSize: 11,
  fontWeight: 700,
};

function ProportionalStrip({
  segments,
  total,
}: {
  segments: StripSegment[];
  total: number;
}) {
  const visible = segments.filter((segment) => segment.value > 0);

  return (
    <div className="flex h-10 w-full gap-1">
      {visible.map((segment) => {
        const pctLabel = formatPercent(segment.value, total);
        return (
          <div
            key={segment.label}
            className="flex min-w-0 items-center justify-center rounded-md border-2 bg-white px-0.5 text-[9px] font-bold leading-tight"
            style={{
              flex: segment.value,
              borderColor: segment.color,
              color: segment.color,
            }}
            title={`${segment.label}: ${pctLabel} (${segment.value.toLocaleString("en-US")})`}
          >
            {segment.value / total >= 0.14 ? pctLabel : ""}
          </div>
        );
      })}
    </div>
  );
}

function buildSystemSegments(system: SystemTypeRow): StripSegment[] {
  return [
    { label: "Light-Frame", value: system.lightFrame, color: "#005F33" },
    { label: "Hybrid MT/LF", value: system.hybridMtLf, color: "#42B245" },
    { label: "Heavy/MT", value: system.heavyMt, color: "#F78F2D" },
  ];
}

function buildBuildingSegments(building: BuildingTypeRow): StripSegment[] {
  return [
    { label: "Multifamily", value: building.multifamily, color: "#005F33" },
    { label: "Commercial", value: building.commercial, color: "#42B245" },
    { label: "Institutional", value: building.institutional, color: "#7EBC41" },
    { label: "Warehouse/Mfg", value: building.warehouse, color: "#F78F2D" },
    { label: "Other", value: building.other, color: "#4A93BB" },
  ];
}

function CombinedLegend() {
  return (
    <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-[9px] font-medium uppercase text-gray-600">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-bold text-gray-500">Volume:</span>
        {[
          { label: "Q1", color: "#005F33" },
          { label: "Q2", color: "#42B245" },
          { label: "Q3", color: "#7EBC41" },
          { label: "Q4", color: "#F78F2D" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-bold text-gray-500">System Type:</span>
        {[
          { label: "Light-Frame", color: "#005F33" },
          { label: "Hybrid MT/LF", color: "#42B245" },
          { label: "Heavy/MT", color: "#F78F2D" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm border-2 bg-white"
              style={{ borderColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-bold text-gray-500">Building Type:</span>
        {[
          { label: "Multifamily", color: "#005F33" },
          { label: "Commercial", color: "#42B245" },
          { label: "Institutional", color: "#7EBC41" },
          { label: "Warehouse/Mfg", color: "#F78F2D" },
          { label: "Other", color: "#4A93BB" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm border-2 bg-white"
              style={{ borderColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ConvertedProjectsCombinedChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative mb-2 px-20 pb-1">
        <h3 className="text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
          Converted Projects — Combined View
        </h3>
        <p className="mt-2 text-center text-xs font-semibold text-gray-500">
          Directly influenced projects by quarter, system type, and building type
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/woodworks_logo.svg"
          alt="WoodWorks"
          className="absolute right-2 top-0 h-16 w-auto object-contain sm:right-4"
        />
      </div>

      <div className="mx-auto mt-6 max-w-3xl">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          Volume by Quarter
        </p>
        <div className="flex">
          <div className="w-[4.5rem] shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={QUARTERLY_DATA}
            margin={{ top: 40, right: 12, left: 4, bottom: 8 }}
            barCategoryGap="22%"
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <YAxis
              domain={[0, 480]}
              tick={{ fill: "#374151", fontSize: 10 }}
              tickFormatter={(value) => Number(value).toLocaleString("en-US")}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              width={36}
            />
            <Bar
              dataKey="q1"
              stackId="volume"
              fill="#005F33"
              maxBarSize={80}
            >
              <LabelList
                dataKey="q1"
                {...insideLabelProps}
                fill="#ffffff"
              />
            </Bar>
            <Bar
              dataKey="q2"
              stackId="volume"
              fill="#42B245"
              maxBarSize={80}
            >
              {QUARTERLY_DATA.map((row) => (
                <Cell
                  key={`volume-q2-${row.year}`}
                  radius={conditionalTopCellRadius(row.totalOnQ2 != null, 5)}
                />
              ))}
              <LabelList
                dataKey="q2"
                {...insideLabelProps}
                fill="#ffffff"
              />
              <LabelList dataKey="totalOnQ2" {...totalLabelProps} />
              <LabelList
                dataKey="goal"
                position="top"
                offset={25}
                formatter={formatGoal}
                fill="#F78F2D"
                fontSize={11}
                fontWeight={700}
              />
            </Bar>
            <Bar
              dataKey="q3"
              stackId="volume"
              fill="#7EBC41"
              maxBarSize={80}
            >
              <LabelList
                dataKey="q3"
                {...insideLabelProps}
                fill="#255D38"
              />
            </Bar>
            <Bar
              dataKey="q4"
              stackId="volume"
              fill="#F78F2D"
              maxBarSize={80}
              radius={[5, 5, 0, 0]}
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
          </div>
        </div>

        <div className="mt-3 flex">
          <div className="flex w-[4.5rem] shrink-0 flex-col justify-around self-stretch py-2 pr-2 text-right text-[10px] font-semibold uppercase leading-tight tracking-[0.1em] text-gray-500">
            <span>System Type</span>
            <span>Building Type</span>
          </div>
          <div className="min-w-0 flex-1 grid grid-cols-3 gap-4 sm:gap-6">
          {QUARTERLY_DATA.map((row) => {
            const system = SYSTEM_TYPE_DATA.find(
              (item) => item.year === row.year
            )!;
            const building = BUILDING_TYPE_DATA.find(
              (item) => item.year === row.year
            )!;
            return (
              <div
                key={row.year}
                className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-1.5 py-2"
              >
                <ProportionalStrip
                  segments={buildSystemSegments(system)}
                  total={system.total}
                />
                <ProportionalStrip
                  segments={buildBuildingSegments(building)}
                  total={building.total}
                />
              </div>
            );
          })}
          </div>
        </div>

        <CombinedLegend />
      </div>
    </div>
  );
}
