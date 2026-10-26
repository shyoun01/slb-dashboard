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
import { num, quarterlyRows, yearRec, type QuarterlyRow } from "@/data/airtable";

type OnDemandRow = QuarterlyRow & {
  /** New accounts for the year (YTD for the current year). */
  newAccounts: number | null;
};

const ON_DEMAND_DATA: OnDemandRow[] = quarterlyRows("On-Demand Completions", "On-Demand Completions").map((row) => ({
  ...row,
  newAccounts: num(yearRec(Number(row.year)), "On-Demand New Accounts"),
}));

type UniversityEducationRow = QuarterlyRow;

const UNIVERSITY_EDUCATION_DATA: UniversityEducationRow[] = quarterlyRows("Student Engagements", "Student Engagements");

const FACULTY_ENGAGEMENT_DATA: UniversityEducationRow[] = quarterlyRows("Faculty Engagements", "Faculty Engagements");

function formatWholeNumber(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return number.toLocaleString("en-US");
}

function newAccountsYtd(row: OnDemandRow | undefined) {
  return row?.newAccounts ?? null;
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
        {formatWholeNumber(newAccountsYtd(row))}
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
            {ON_DEMAND_DATA.map((row) => (
              <Cell
                key={`q1-${row.year}`}
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
              fontSize={11}
              fontWeight={700}
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
              dataKey="goalOnQ2"
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
            {ON_DEMAND_DATA.map((row) => (
              <Cell
                key={`q3-${row.year}`}
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
              fontSize={11}
              fontWeight={700}
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
            <LabelList
              dataKey="goalOnQ4"
              position="top"
              offset={25}
              formatter={formatGoal}
              fill="#F78F2D"
              fontSize={11}
              fontWeight={700}
            />
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
            {data.map((row) => (
              <Cell
                key={`${stackId}-q1-${row.year}`}
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
              fontSize={11}
              fontWeight={700}
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
              dataKey="goalOnQ2"
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
            {data.map((row) => (
              <Cell
                key={`${stackId}-q3-${row.year}`}
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
              fontSize={11}
              fontWeight={700}
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
            <LabelList
              dataKey="goalOnQ4"
              position="top"
              offset={25}
              formatter={formatGoal}
              fill="#F78F2D"
              fontSize={11}
              fontWeight={700}
            />
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
