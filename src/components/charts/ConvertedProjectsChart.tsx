"use client";

import { conditionalTopCellRadius, insideLabelIfFits } from "@/components/charts/chartUtils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { convertedByBuilding, convertedBySystem, quarterlyRows, type QuarterlyRow } from "@/data/airtable";

type ProjectRow = QuarterlyRow;

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
  topKey: "multifamily" | "commercial" | "institutional" | "warehouse" | "other";
};

const DIRECTLY_INFLUENCED_DATA: ProjectRow[] = quarterlyRows("Directly Influenced Projects", "Directly Influenced Projects");

const SYSTEM_TYPE_DATA: SystemTypeRow[] = convertedBySystem();

const BUILDING_TYPE_DATA: BuildingTypeRow[] = convertedByBuilding();

const QUARTERLY_LEGEND_ITEMS = [
  { label: "Q1", color: "#005F33" },
  { label: "Q2", color: "#42B245" },
  { label: "Q3", color: "#7EBC41" },
  { label: "Q4", color: "#F78F2D" },
];

const SYSTEM_TYPE_LEGEND_ITEMS = [
  { label: "Light-Frame", color: "#005F33", dataKey: "lightFrame" },
  { label: "Hybrid MT/LF", color: "#42B245", dataKey: "hybridMtLf" },
  { label: "Heavy/MT", color: "#F78F2D", dataKey: "heavyMt" },
];

const BUILDING_TYPE_LEGEND_ITEMS = [
  { label: "Multifamily", color: "#005F33", dataKey: "multifamily" },
  { label: "Commercial", color: "#42B245", dataKey: "commercial" },
  { label: "Institutional", color: "#7EBC41", dataKey: "institutional" },
  {
    label: "Warehouse/Mfg",
    color: "#F78F2D",
    dataKey: "warehouse",
  },
  { label: "Other", color: "#4A93BB", dataKey: "other" },
];

function formatWholeNumber(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return number.toLocaleString("en-US");
}

const insideLabelProps = {
  position: "center" as const,
  content: insideLabelIfFits,
  formatter: formatWholeNumber,
  fontSize: 13,
  fontWeight: 700,
};

const totalLabelProps = {
  position: "top" as const,
  offset: 7,
  formatter: formatWholeNumber,
  fill: "#255D38",
  fontSize: 14,
  fontWeight: 700,
};

function formatGoal(value: unknown) {
  const formatted = formatWholeNumber(value);
  return formatted ? `${formatted} Goal` : "";
}

function QuarterlyLegend() {
  return (
    <div className="flex items-center justify-center gap-x-3 pt-3 text-[13px] font-medium uppercase text-gray-600">
      {QUARTERLY_LEGEND_ITEMS.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function SystemTypeLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-3 text-xs font-medium uppercase text-gray-600">
      {SYSTEM_TYPE_LEGEND_ITEMS.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function BuildingTypeLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-3 text-[11px] font-medium uppercase text-gray-600">
      {BUILDING_TYPE_LEGEND_ITEMS.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function SubchartLogo() {
  return (
    <div className="mt-auto flex min-h-20 items-center justify-center border-t border-gray-100 pt-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/woodworks_logo.svg"
        alt="WoodWorks"
        className="h-16 w-auto object-contain"
      />
    </div>
  );
}

function DirectlyInfluencedChart() {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-gray-200 bg-white px-2 pb-4 pt-4">
      <div className="min-h-12 px-2 text-center">
        <h4 className="text-base font-semibold text-[var(--slb-charcoal)]">
          Converted Projects
        </h4>
        <p className="mt-1 text-[14px] font-bold uppercase leading-5 tracking-[0.05em] text-gray-500">
          Directly influenced projects
        </p>
      </div>
      <ResponsiveContainer width="100%" height={402}>
        <BarChart
          data={DIRECTLY_INFLUENCED_DATA}
          margin={{ top: 48, right: 10, left: 0, bottom: 12 }}
          barCategoryGap="20%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 14 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            height={46}
          />
          <YAxis
            domain={[0, 480]}
            tick={{ fill: "#374151", fontSize: 13 }}
            tickFormatter={(value) => Number(value).toLocaleString("en-US")}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            width={36}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            height={46}
            content={<QuarterlyLegend />}
            wrapperStyle={{
              left: 0,
              right: 0,
              width: "100%",
              fontSize: 13,
              textAlign: "center",
            }}
          />
          <Bar
            dataKey="q1"
            stackId="projects"
            fill="#005F33"
            maxBarSize={64}
            name="Q1"
          >
            {DIRECTLY_INFLUENCED_DATA.map((row) => (
              <Cell
                key={`projects-q1-${row.year}`}
                radius={conditionalTopCellRadius(row.totalOnQ1 != null, 5)}
              />
            ))}
            <LabelList
              dataKey="q1"
              {...insideLabelProps}
              fill="#ffffff"
            />
            <LabelList dataKey="totalOnQ1" {...totalLabelProps} />
            <LabelList
              dataKey="goalOnQ1"
              position="top"
              offset={25}
              formatter={formatGoal}
              fill="#F78F2D"
              fontSize={14}
              fontWeight={700}
            />
          </Bar>
          <Bar
            dataKey="q2"
            stackId="projects"
            fill="#42B245"
            maxBarSize={64}
            name="Q2"
          >
            {DIRECTLY_INFLUENCED_DATA.map((row) => (
              <Cell
                key={`projects-q2-${row.year}`}
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
              dataKey="goalOnQ2"
              position="top"
              offset={25}
              formatter={formatGoal}
              fill="#F78F2D"
              fontSize={14}
              fontWeight={700}
            />
          </Bar>
          <Bar
            dataKey="q3"
            stackId="projects"
            fill="#7EBC41"
            maxBarSize={64}
            name="Q3"
          >
            {DIRECTLY_INFLUENCED_DATA.map((row) => (
              <Cell
                key={`projects-q3-${row.year}`}
                radius={conditionalTopCellRadius(row.totalOnQ3 != null, 5)}
              />
            ))}
            <LabelList
              dataKey="q3"
              {...insideLabelProps}
              fill="#255D38"
            />
            <LabelList dataKey="totalOnQ3" {...totalLabelProps} />
            <LabelList
              dataKey="goalOnQ3"
              position="top"
              offset={25}
              formatter={formatGoal}
              fill="#F78F2D"
              fontSize={14}
              fontWeight={700}
            />
          </Bar>
          <Bar
            dataKey="q4"
            stackId="projects"
            fill="#F78F2D"
            maxBarSize={64}
            radius={[5, 5, 0, 0]}
            name="Q4"
          >
            <LabelList
              dataKey="q4"
              {...insideLabelProps}
              fill="#ffffff"
            />
            <LabelList dataKey="totalOnQ4" {...totalLabelProps} />
            <LabelList
              dataKey="goalOnQ4"
              position="top"
              offset={25}
              formatter={formatGoal}
              fill="#F78F2D"
              fontSize={14}
              fontWeight={700}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <SubchartLogo />
    </div>
  );
}

function SystemTypeChart() {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-gray-200 bg-white px-2 pb-4 pt-4">
      <div className="min-h-12 px-2 text-center">
        <h4 className="text-base font-semibold text-[var(--slb-charcoal)]">
          Converted Projects by System Type
        </h4>
      </div>
      <ResponsiveContainer width="100%" height={402}>
        <BarChart
          data={SYSTEM_TYPE_DATA}
          margin={{ top: 30, right: 10, left: 0, bottom: 12 }}
          barCategoryGap="20%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 14 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            height={46}
          />
          <YAxis
            domain={[0, 480]}
            tick={{ fill: "#374151", fontSize: 13 }}
            tickFormatter={(value) => Number(value).toLocaleString("en-US")}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            width={36}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            height={52}
            content={<SystemTypeLegend />}
            wrapperStyle={{
              left: 0,
              right: 0,
              width: "100%",
              fontSize: 12,
              textAlign: "center",
            }}
          />
          <Bar
            dataKey="lightFrame"
            stackId="systemType"
            fill="#005F33"
            maxBarSize={64}
            name="Light-Frame"
          >
            <LabelList
              dataKey="lightFrame"
              {...insideLabelProps}
              fill="#ffffff"
            />
          </Bar>
          <Bar
            dataKey="hybridMtLf"
            stackId="systemType"
            fill="#42B245"
            maxBarSize={64}
            name="Hybrid MT/LF"
          >
            <LabelList
              dataKey="hybridMtLf"
              {...insideLabelProps}
              fill="#ffffff"
            />
          </Bar>
          <Bar
            dataKey="heavyMt"
            stackId="systemType"
            fill="#F78F2D"
            maxBarSize={64}
            radius={[5, 5, 0, 0]}
            name="Heavy/MT"
          >
            <LabelList
              dataKey="heavyMt"
              {...insideLabelProps}
              fill="#ffffff"
            />
            <LabelList dataKey="total" {...totalLabelProps} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <SubchartLogo />
    </div>
  );
}

function BuildingTypeChart() {
  const segments = [
    { dataKey: "multifamily" as const, fill: "#005F33", labelFill: "#ffffff" },
    { dataKey: "commercial" as const, fill: "#42B245", labelFill: "#ffffff" },
    {
      dataKey: "institutional" as const,
      fill: "#7EBC41",
      labelFill: "#255D38",
    },
    { dataKey: "warehouse" as const, fill: "#F78F2D", labelFill: "#ffffff" },
    { dataKey: "other" as const, fill: "#4A93BB", labelFill: "#ffffff" },
  ];

  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-gray-200 bg-white px-2 pb-4 pt-4">
      <div className="min-h-12 px-2 text-center">
        <h4 className="text-base font-semibold text-[var(--slb-charcoal)]">
          Converted Projects by Building Type
        </h4>
      </div>
      <ResponsiveContainer width="100%" height={402}>
        <BarChart
          data={BUILDING_TYPE_DATA}
          margin={{ top: 30, right: 10, left: 0, bottom: 12 }}
          barCategoryGap="20%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 14 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            height={46}
          />
          <YAxis
            domain={[0, 480]}
            tick={{ fill: "#374151", fontSize: 13 }}
            tickFormatter={(value) => Number(value).toLocaleString("en-US")}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            width={36}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            height={58}
            content={<BuildingTypeLegend />}
            wrapperStyle={{
              left: 0,
              right: 0,
              width: "100%",
              fontSize: 11,
              textAlign: "center",
            }}
          />
          {segments.map((segment) => (
            <Bar
              key={segment.dataKey}
              dataKey={segment.dataKey}
              stackId="buildingType"
              fill={segment.fill}
              maxBarSize={64}
              name={segment.dataKey}
            >
              {BUILDING_TYPE_DATA.map((row) => (
                <Cell
                  key={`${segment.dataKey}-${row.year}`}
                  radius={conditionalTopCellRadius(
                    row.topKey === segment.dataKey,
                    5
                  )}
                />
              ))}
              <LabelList
                dataKey={segment.dataKey}
                {...insideLabelProps}
                fill={segment.labelFill}
              />
              <LabelList
                dataKey="total"
                content={({ x, y, width, value, index }) => {
                  const row = BUILDING_TYPE_DATA[index ?? 0];
                  if (row?.topKey !== segment.dataKey) return null;
                  if (
                    x == null ||
                    y == null ||
                    width == null ||
                    value == null
                  ) {
                    return null;
                  }
                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(y) - 7}
                      fill="#255D38"
                      fontSize={14}
                      fontWeight={700}
                      textAnchor="middle"
                    >
                      {formatWholeNumber(value)}
                    </text>
                  );
                }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      <SubchartLogo />
    </div>
  );
}

export default function ConvertedProjectsChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-6 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        Converted Projects
      </h3>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DirectlyInfluencedChart />
        <SystemTypeChart />
        <BuildingTypeChart />
      </div>
    </div>
  );
}
