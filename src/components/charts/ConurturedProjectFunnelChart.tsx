"use client";

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

type FunnelStage = {
  label: string;
  value: string;
  change: string;
  description: string;
  fill: string;
  textColor: string;
  points: string;
};

const FUNNEL_STAGES: FunnelStage[] = [
  {
    label: "Subscriber",
    value: "26,177",
    change: "-17%",
    description: "Contacts with email only or outside of the priority audience",
    fill: "#005F33",
    textColor: "#ffffff",
    points: "0,0 100,0 95,64 5,64",
  },
  {
    label: "Prospects",
    value: "6,130",
    change: "-8%",
    description: "Email, name, and company within the priority target",
    fill: "#42B245",
    textColor: "#ffffff",
    points: "5,0 95,0 90,64 10,64",
  },
  {
    label: "Leads",
    value: "18,299",
    change: "-16%",
    description: "Engaged projects",
    fill: "#A8D649",
    textColor: "#183B27",
    points: "10,0 90,0 85,64 15,64",
  },
  {
    label: "Priority Leads (MQL)",
    value: "63,039",
    change: "+3%",
    description: "Prospects with high engagement",
    fill: "#DDEFCB",
    textColor: "#183B27",
    points: "15,0 85,0 80,64 20,64",
  },
  {
    label: "Qualified Leads (SQL)",
    value: "2,401",
    change: "+5%",
    description: "Leads sent to WoodWorks",
    fill: "#ffffff",
    textColor: "#183B27",
    points: "20,0 80,0 75,64 25,64",
  },
];

const SQL_REFERRAL_DATA = [
  {
    year: "2024",
    q1: 5,
    q2: 6,
    q3: 7,
    q4: 12,
    totalOnQ2: null,
    totalOnQ4: 30,
  },
  {
    year: "2025",
    q1: 6,
    q2: 5,
    q3: 9,
    q4: 12,
    totalOnQ2: null,
    totalOnQ4: 32,
  },
  {
    year: "2026",
    q1: 11,
    q2: 11,
    q3: null,
    q4: null,
    totalOnQ2: 22,
    totalOnQ4: null,
  },
];

function formatLabel(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number.toLocaleString("en-US") : "";
}

function SqlReferralConversionsChart() {
  const insideLabelProps = {
    position: "center" as const,
    formatter: formatLabel,
    fontSize: 11,
    fontWeight: 700,
  };
  const totalLabelProps = {
    position: "top" as const,
    offset: 7,
    formatter: formatLabel,
    fill: "#255D38",
    fontSize: 12,
    fontWeight: 700,
  };

  return (
    <div className="flex h-full min-w-0 flex-col rounded-[2rem] border border-gray-200 bg-white px-3 py-7">
      <h4 className="mb-2 text-center text-lg font-semibold text-[var(--slb-charcoal)]">
        SQL Referral Conversions
      </h4>
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
        Qualified Leads Converted to Project Leads
      </p>
      <ResponsiveContainer width="100%" height={370}>
        <BarChart
          data={SQL_REFERRAL_DATA}
          margin={{ top: 30, right: 10, left: 0, bottom: 10 }}
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
            domain={[0, 40]}
            tick={{ fill: "#374151", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            width={30}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            height={36}
            formatter={(value) => String(value).toUpperCase()}
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
            stackId="conversions"
            fill="#005F33"
            maxBarSize={72}
            name="Q1"
          >
            <LabelList dataKey="q1" {...insideLabelProps} fill="#ffffff" />
          </Bar>
          <Bar
            dataKey="q2"
            stackId="conversions"
            fill="#42B245"
            maxBarSize={72}
            name="Q2"
          >
            {SQL_REFERRAL_DATA.map((row) => (
              <Cell
                key={`sql-q2-${row.year}`}
                radius={row.totalOnQ2 != null ? [5, 5, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
            <LabelList dataKey="q2" {...insideLabelProps} fill="#ffffff" />
            <LabelList dataKey="totalOnQ2" {...totalLabelProps} />
          </Bar>
          <Bar
            dataKey="q3"
            stackId="conversions"
            fill="#7EBC41"
            maxBarSize={72}
            name="Q3"
          >
            <LabelList dataKey="q3" {...insideLabelProps} fill="#255D38" />
          </Bar>
          <Bar
            dataKey="q4"
            stackId="conversions"
            fill="#F78F2D"
            maxBarSize={72}
            radius={[5, 5, 0, 0]}
            name="Q4"
          >
            <LabelList dataKey="q4" {...insideLabelProps} fill="#ffffff" />
            <LabelList dataKey="totalOnQ4" {...totalLabelProps} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-auto flex min-h-20 items-center justify-center border-t border-gray-100 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/woodworks_logo.svg"
          alt="WoodWorks"
          className="h-16 w-auto object-contain"
        />
      </div>
    </div>
  );
}

export default function ConurturedProjectFunnelChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <h3 className="text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        Co-nurtured Project Funnel
      </h3>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="flex h-full flex-col rounded-[2rem] border border-dashed border-gray-300 px-2 py-7 md:px-3">
        <h4 className="text-center text-lg font-semibold text-[var(--slb-charcoal)]">
          Lead Scoring Funnel
        </h4>
        <p className="mb-5 mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          Current and Historical Volume (QoQ Change)
        </p>

        <div className="hidden grid-cols-[105px_minmax(185px,1fr)_130px] items-stretch lg:grid">
          <div className="grid grid-rows-5">
            {FUNNEL_STAGES.map((stage) => (
              <div
                key={stage.label}
                className="flex h-16 items-center justify-end pr-2 text-right text-[10px] font-bold uppercase leading-tight text-[var(--slb-charcoal)]"
              >
                {stage.label}
              </div>
            ))}
          </div>

          <div className="grid grid-rows-5">
            {FUNNEL_STAGES.map((stage) => (
              <div
                key={stage.label}
                className="relative flex h-16 items-center justify-center text-sm font-bold"
                style={{ color: stage.textColor }}
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 64"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <polygon
                    points={stage.points}
                    fill={stage.fill}
                    stroke={
                      stage.label === "Qualified Leads (SQL)"
                        ? "#9CA3AF"
                        : "#ffffff"
                    }
                    strokeWidth={
                      stage.label === "Qualified Leads (SQL)" ? 2 : 0.75
                    }
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className="relative z-10">
                  {stage.value} ({stage.change})
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-rows-5">
            {FUNNEL_STAGES.map((stage) => (
              <div
                key={stage.label}
                className="flex h-16 items-center pl-2 text-[10px] font-medium leading-snug text-gray-700"
              >
                {stage.description}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          {FUNNEL_STAGES.map((stage) => (
            <div
              key={stage.label}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div
                className="px-4 py-3 text-center text-base font-bold"
                style={{
                  backgroundColor: stage.fill,
                  color: stage.textColor,
                }}
              >
                {stage.value} ({stage.change})
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-xs font-bold uppercase text-[var(--slb-charcoal)]">
                  {stage.label}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto flex min-h-20 items-center justify-center border-t border-gray-100 pt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/thinkwood_logo.png"
            alt="Think Wood"
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>
        <SqlReferralConversionsChart />
      </div>
    </div>
  );
}
