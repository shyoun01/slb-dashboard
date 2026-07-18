"use client";

import { conditionalTopCellRadius } from "@/components/charts/chartUtils";
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

type OnDemandRow = {
  year: string;
  q1: number;
  q2: number;
  q3: number | null;
  q4: number | null;
  newAccounts: number;
  totalOnQ2: number | null;
  totalOnQ4: number | null;
  goal: number | null;
};

const ON_DEMAND_DATA: OnDemandRow[] = [
  {
    year: "2024",
    q1: 1363,
    q2: 2804,
    q3: 2537,
    q4: 6280,
    newAccounts: 4491,
    totalOnQ2: null,
    totalOnQ4: 12984,
    goal: null,
  },
  {
    year: "2025",
    q1: 3128,
    q2: 3413,
    q3: 3439,
    q4: 7446,
    newAccounts: 5170,
    totalOnQ2: null,
    totalOnQ4: 17426,
    goal: null,
  },
  {
    year: "2026",
    q1: 3438,
    q2: 3438,
    q3: null,
    q4: null,
    newAccounts: 1020,
    totalOnQ2: 6876,
    totalOnQ4: null,
    goal: 17805,
  },
];

type UniversityEducationRow = Omit<OnDemandRow, "newAccounts">;

const UNIVERSITY_EDUCATION_DATA: UniversityEducationRow[] = [
  {
    year: "2024",
    q1: 1640,
    q2: 971,
    q3: 1109,
    q4: 1322,
    totalOnQ2: null,
    totalOnQ4: 5042,
    goal: null,
  },
  {
    year: "2025",
    q1: 1444,
    q2: 1091,
    q3: 1272,
    q4: 1856,
    totalOnQ2: null,
    totalOnQ4: 5663,
    goal: null,
  },
  {
    year: "2026",
    q1: 2173,
    q2: 2173,
    q3: null,
    q4: null,
    totalOnQ2: 4346,
    totalOnQ4: null,
    goal: 5994,
  },
];

const FACULTY_ENGAGEMENT_DATA: UniversityEducationRow[] = [
  {
    year: "2024",
    q1: 210,
    q2: 322,
    q3: 165,
    q4: 151,
    totalOnQ2: null,
    totalOnQ4: 848,
    goal: null,
  },
  {
    year: "2025",
    q1: 282,
    q2: 320,
    q3: 184,
    q4: 576,
    totalOnQ2: null,
    totalOnQ4: 1362,
    goal: null,
  },
  {
    year: "2026",
    q1: 397,
    q2: 397,
    q3: null,
    q4: null,
    totalOnQ2: 794,
    totalOnQ4: null,
    goal: 993,
  },
];

function formatWholeNumber(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return number.toLocaleString("en-US");
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

const LEGEND_ITEMS = [
  { label: "Q1", color: "#005F33" },
  { label: "Q2", color: "#42B245" },
  { label: "Q3", color: "#7EBC41" },
  { label: "Q4", color: "#F78F2D" },
  { label: "New Accounts", color: "#25608F" },
];

function OnDemandLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-3 text-[10px] font-medium uppercase text-gray-600">
      {LEGEND_ITEMS.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          {item.label === "New Accounts" ? (
            <span className="inline-block h-2.5 w-5 rounded-full border border-[#9CC2DA] bg-[#EAF3F8]" />
          ) : (
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
          )}
          {item.label}
        </span>
      ))}
    </div>
  );
}

function QuarterlyLegend() {
  return (
    <div className="flex items-center justify-center gap-x-3 pt-3 text-[10px] font-medium uppercase text-gray-600">
      {LEGEND_ITEMS.slice(0, 4).map((item) => (
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

function formatGoal(value: unknown) {
  const formatted = formatWholeNumber(value);
  return formatted ? `${formatted} Goal` : "";
}

type AccountTickProps = {
  x?: number;
  y?: number;
  payload?: { value?: string };
};

function AccountTick({
  x = 0,
  y = 0,
  payload,
}: AccountTickProps) {
  const row = ON_DEMAND_DATA.find((item) => item.year === payload?.value);

  return (
    <g transform={`translate(${x},${y})`} textAnchor="middle">
      <text y={14} fill="#374151" fontSize={11}>
        {payload?.value}
      </text>
      <rect
        x={-30}
        y={20}
        width={60}
        height={21}
        rx={10.5}
        fill="#EAF3F8"
        stroke="#9CC2DA"
      />
      <text y={35} fill="#25608F" fontSize={11} fontWeight={700}>
        {formatWholeNumber(row?.newAccounts)}
      </text>
    </g>
  );
}

function OnDemandChart() {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white px-2 pb-4 pt-4">
      <div className="min-h-12 px-2 text-center">
        <h4 className="text-base font-semibold text-[var(--slb-charcoal)]">
          On-Demand Education
        </h4>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          Completions by Quarter
        </p>
      </div>
      <ResponsiveContainer width="100%" height={402}>
        <BarChart
          data={ON_DEMAND_DATA}
          margin={{ top: 48, right: 10, left: 0, bottom: 12 }}
          barCategoryGap="20%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={<AccountTick />}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            height={46}
          />
          <YAxis
            domain={[0, 21000]}
            tick={{ fill: "#374151", fontSize: 10 }}
            tickFormatter={(value) => Number(value).toLocaleString("en-US")}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            width={45}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            height={46}
            content={<OnDemandLegend />}
            wrapperStyle={{
              left: 0,
              right: 0,
              width: "100%",
              fontSize: 10,
              textAlign: "center",
            }}
          />
          <Bar
            dataKey="q1"
            stackId="completions"
            fill="#005F33"
            maxBarSize={64}
            name="Q1"
          >
            <LabelList
              dataKey="q1"
              {...insideLabelProps}
              fill="#ffffff"
            />
          </Bar>
          <Bar
            dataKey="q2"
            stackId="completions"
            fill="#42B245"
            maxBarSize={64}
            name="Q2"
          >
            {ON_DEMAND_DATA.map((row) => (
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
            stackId="completions"
            fill="#7EBC41"
            maxBarSize={64}
            name="Q3"
          >
            <LabelList
              dataKey="q3"
              {...insideLabelProps}
              fill="#255D38"
            />
          </Bar>
          <Bar
            dataKey="q4"
            stackId="completions"
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
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex min-h-20 items-center justify-center border-t border-gray-100 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/woodinstitute_logo.png"
          alt="Wood Institute"
          className="h-16 w-auto object-contain"
        />
      </div>
    </div>
  );
}

function UniversityEducationChart({
  subhead,
  data,
  domainMax,
  stackId,
}: {
  subhead: string;
  data: UniversityEducationRow[];
  domainMax: number;
  stackId: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white px-2 pb-4 pt-4">
      <div className="min-h-12 px-2 text-center">
        <h4 className="text-base font-semibold text-[var(--slb-charcoal)]">
          University Education
        </h4>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          {subhead}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={402}>
        <BarChart
          data={data}
          margin={{ top: 48, right: 10, left: 0, bottom: 12 }}
          barCategoryGap="20%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            height={46}
          />
          <YAxis
            domain={[0, domainMax]}
            tick={{ fill: "#374151", fontSize: 10 }}
            tickFormatter={(value) => Number(value).toLocaleString("en-US")}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            width={40}
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
              fontSize: 10,
              textAlign: "center",
            }}
          />
          <Bar
            dataKey="q1"
            stackId={stackId}
            fill="#005F33"
            maxBarSize={64}
            name="Q1"
          >
            <LabelList
              dataKey="q1"
              {...insideLabelProps}
              fill="#ffffff"
            />
          </Bar>
          <Bar
            dataKey="q2"
            stackId={stackId}
            fill="#42B245"
            maxBarSize={64}
            name="Q2"
          >
            {data.map((row) => (
              <Cell
                key={`${stackId}-q2-${row.year}`}
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
            stackId={stackId}
            fill="#7EBC41"
            maxBarSize={64}
            name="Q3"
          >
            <LabelList
              dataKey="q3"
              {...insideLabelProps}
              fill="#255D38"
            />
          </Bar>
          <Bar
            dataKey="q4"
            stackId={stackId}
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
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex min-h-20 items-center justify-center border-t border-gray-100 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/slb_logo.jpg"
          alt="Softwood Lumber Board"
          className="h-16 w-auto object-contain"
        />
      </div>
    </div>
  );
}

export default function OnDemandUniversityEducationChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-6 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        On-Demand and University Education
      </h3>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <OnDemandChart />
        <UniversityEducationChart
          subhead="Student Engagements by Quarter"
          data={UNIVERSITY_EDUCATION_DATA}
          domainMax={7000}
          stackId="student-engagements"
        />
        <UniversityEducationChart
          subhead="Faculty Engagements by Quarter"
          data={FACULTY_ENGAGEMENT_DATA}
          domainMax={1600}
          stackId="faculty-engagements"
        />
      </div>
    </div>
  );
}
