"use client";

import { cellRadius, conditionalTopCellRadius } from "@/components/charts/chartUtils";
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
import { convertedByBuilding, convertedBySystem, quarterlyRows } from "@/data/airtable";

type VolumeRow = {
  year: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  /** Year total, set only on the top (latest) quarter segment. */
  totalLabelQ1: number | null;
  totalLabelQ2: number | null;
  totalLabelQ3: number | null;
  totalLabelQ4: number | null;
  /** Goal callout, set only on the top quarter segment. */
  goalQ1: number | null;
  goalQ2: number | null;
  goalQ3: number | null;
  goalQ4: number | null;
};

type SystemRow = {
  year: string;
  lightFrame: number;
  hybridMtLf: number;
  heavyMt: number;
  total: number;
};

type BuildingRow = {
  year: string;
  multifamily: number;
  commercial: number;
  institutional: number;
  other: number;
  total: number;
};

type YearGroup = {
  year: string;
  volume: VolumeRow;
  system: SystemRow;
  building: BuildingRow;
};

const SYSTEM_BY_YEAR = convertedBySystem();
const BUILDING_BY_YEAR = convertedByBuilding();

const YEAR_GROUPS: YearGroup[] = quarterlyRows("Directly Influenced Projects", "Directly Influenced Projects").map((r) => {
  const system = SYSTEM_BY_YEAR.find((x) => x.year === r.year)!;
  const b = BUILDING_BY_YEAR.find((x) => x.year === r.year)!;
  return {
    year: r.year,
    volume: {
      year: r.year,
      q1: r.q1 ?? 0,
      q2: r.q2 ?? 0,
      q3: r.q3 ?? 0,
      q4: r.q4 ?? 0,
      totalLabelQ1: r.totalOnQ1,
      totalLabelQ2: r.totalOnQ2,
      totalLabelQ3: r.totalOnQ3,
      totalLabelQ4: r.totalOnQ4,
      goalQ1: r.goalOnQ1,
      goalQ2: r.goalOnQ2,
      goalQ3: r.goalOnQ3,
      goalQ4: r.goalOnQ4,
    },
    system,
    building: {
      year: r.year,
      multifamily: b.multifamily,
      commercial: b.commercial,
      institutional: b.institutional,
      // The strip view folds Warehouse/Mfg into Other
      other: b.warehouse + b.other,
      total: b.total,
    },
  };
});

const CHART_MARGIN = { top: 4, right: 56, left: 8, bottom: 4 };
const BAR_SIZE = 54;
const CHART_ROW_HEIGHT = BAR_SIZE + 12;
const STRIP_CHART_HEIGHT_ABOVE = CHART_ROW_HEIGHT + 6;
const STRIP_CHART_HEIGHT_BELOW = 52;

const SYSTEM_COLORS = {
  lightFrame: "#005F33",
  hybridMtLf: "#42B245",
  heavyMt: "#F78F2D",
} as const;

const BUILDING_COLORS = {
  multifamily: "#005F33",
  commercial: "#42B245",
  institutional: "#7EBC41",
  other: "#4A93BB",
} as const;

function formatWholeNumber(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return number.toLocaleString("en-US");
}

function formatGoal(value: unknown) {
  const formatted = formatWholeNumber(value);
  return formatted ? `${formatted} Goal` : "";
}

function getSystemPercent(value: unknown, total: number) {
  const segment = Number(value);
  if (!Number.isFinite(segment) || segment <= 0 || total <= 0) return null;
  return (segment / total) * 100;
}

function formatSegmentPercent(value: unknown, total: number) {
  const pct = getSystemPercent(value, total);
  if (pct == null) return "";
  return `${pct.toFixed(1)}%`;
}

type TypeStripSegment = {
  key: string;
  value: number;
  color: string;
  suffix: string;
};

function TypeStrip({
  total,
  segments,
  labelPosition,
}: {
  total: number;
  segments: TypeStripSegment[];
  labelPosition: "above" | "below";
}) {
  const visibleSegments = segments.filter((segment) => segment.value > 0);

  let cumulative = 0;
  const boundaries = [0];
  const segmentLayouts = visibleSegments.map((segment) => {
    const startPct = cumulative;
    const widthPct = segment.value / total;
    cumulative += widthPct;
    boundaries.push(cumulative);
    return {
      ...segment,
      startPct,
      widthPct,
      centerPct: startPct + widthPct / 2,
    };
  });

  const stripHeight =
    labelPosition === "above"
      ? STRIP_CHART_HEIGHT_ABOVE
      : STRIP_CHART_HEIGHT_BELOW;
  const lineWidthPct = (total / 480) * 100;
  const lineY = labelPosition === "above" ? stripHeight - 20 : 20;
  const tickTop = lineY - 8;
  const tickBottom = lineY + 8;

  return (
    <div
      className="relative shrink-0"
      style={{
        height: stripHeight,
        paddingLeft: CHART_MARGIN.left,
        paddingRight: CHART_MARGIN.right,
      }}
    >
      <div className="relative h-full" style={{ width: `${lineWidthPct}%` }}>
        <svg
          width="100%"
          height={stripHeight}
          className="overflow-visible"
          aria-hidden="true"
        >
          {segmentLayouts.map((segment) => (
            <line
              key={`segment-line-${segment.key}`}
              x1={`${segment.startPct * 100}%`}
              y1={lineY}
              x2={`${(segment.startPct + segment.widthPct) * 100}%`}
              y2={lineY}
              stroke={segment.color}
              strokeWidth={2.5}
            />
          ))}
          {boundaries.map((boundary, index) => (
            <line
              key={`tick-${index}`}
              x1={`${boundary * 100}%`}
              y1={tickTop}
              x2={`${boundary * 100}%`}
              y2={tickBottom}
              stroke="#374151"
              strokeWidth={1.5}
            />
          ))}
          {segmentLayouts.map((segment) => {
            const pctLabel = formatSegmentPercent(segment.value, total);
            if (!pctLabel) return null;

            const label = segment.suffix
              ? `${pctLabel} ${segment.suffix}`
              : pctLabel;
            const centerX = `${segment.centerPct * 100}%`;

            if (labelPosition === "above") {
              const calloutBottom = tickTop;
              const calloutTop = calloutBottom - 6;
              const textY = calloutBottom - 8;

              return (
                <g key={segment.key}>
                  <line
                    x1={centerX}
                    y1={calloutBottom}
                    x2={centerX}
                    y2={calloutTop}
                    stroke={segment.color}
                    strokeWidth={1}
                  />
                  <text
                    x={centerX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="auto"
                    fill={segment.color}
                    fontSize={9}
                    fontWeight={700}
                  >
                    {label}
                  </text>
                </g>
              );
            }

            const calloutTop = tickBottom;
            const calloutBottom = calloutTop + 6;
            const textY = calloutBottom + 2;

            return (
              <g key={segment.key}>
                <line
                  x1={centerX}
                  y1={calloutTop}
                  x2={centerX}
                  y2={calloutBottom}
                  stroke={segment.color}
                  strokeWidth={1}
                />
                <text
                  x={centerX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  fill={segment.color}
                  fontSize={9}
                  fontWeight={700}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

const insideLabelProps = {
  position: "center" as const,
  formatter: formatWholeNumber,
  fontSize: 11,
  fontWeight: 700,
};

const totalLabelProps = {
  position: "right" as const,
  offset: 8,
  formatter: formatWholeNumber,
  fill: "#255D38",
  fontSize: 12,
  fontWeight: 700,
};

function VolumeChart({ row }: { row: VolumeRow }) {
  const data = [{ ...row, yLabel: "" }];

  return (
    <ResponsiveContainer width="100%" height={CHART_ROW_HEIGHT}>
      <BarChart
        layout="vertical"
        data={data}
        margin={CHART_MARGIN}
        barCategoryGap={0}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          horizontal={false}
        />
        <XAxis type="number" domain={[0, 480]} hide />
        <YAxis type="category" dataKey="yLabel" hide width={0} />
        <Bar dataKey="q1" stackId="volume" fill="#005F33" barSize={BAR_SIZE}>
          <LabelList dataKey="q1" {...insideLabelProps} fill="#ffffff" />
          <LabelList dataKey="totalLabelQ1" {...totalLabelProps} />
          <LabelList
            dataKey="goalQ1"
            position="right"
            offset={44}
            formatter={formatGoal}
            fill="#F78F2D"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>
        <Bar dataKey="q2" stackId="volume" fill="#42B245" barSize={BAR_SIZE}>
          <Cell
            radius={
              row.q3 <= 0 && row.q4 <= 0
                ? cellRadius([0, 6, 6, 0])
                : conditionalTopCellRadius(false)
            }
          />
          <LabelList dataKey="q2" {...insideLabelProps} fill="#ffffff" />
          <LabelList dataKey="totalLabelQ2" {...totalLabelProps} />
          <LabelList
            dataKey="goalQ2"
            position="right"
            offset={44}
            formatter={formatGoal}
            fill="#F78F2D"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>
        <Bar dataKey="q3" stackId="volume" fill="#7EBC41" barSize={BAR_SIZE}>
          <Cell
            radius={
              row.q4 <= 0
                ? cellRadius([0, 6, 6, 0])
                : conditionalTopCellRadius(false)
            }
          />
          <LabelList dataKey="q3" {...insideLabelProps} fill="#255D38" />
          <LabelList dataKey="totalLabelQ3" {...totalLabelProps} />
          <LabelList
            dataKey="goalQ3"
            position="right"
            offset={44}
            formatter={formatGoal}
            fill="#F78F2D"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>
        <Bar dataKey="q4" stackId="volume" fill="#F78F2D" barSize={BAR_SIZE}>
          <Cell radius={cellRadius([0, 6, 6, 0])} />
          <LabelList dataKey="q4" {...insideLabelProps} fill="#ffffff" />
          <LabelList dataKey="totalLabelQ4" {...totalLabelProps} />
          <LabelList
            dataKey="goalQ4"
            position="right"
            offset={44}
            formatter={formatGoal}
            fill="#F78F2D"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function BuildingTypeStrip({ row }: { row: BuildingRow }) {
  return (
    <TypeStrip
      total={row.total}
      labelPosition="above"
      segments={[
        {
          key: "multifamily",
          value: row.multifamily,
          color: BUILDING_COLORS.multifamily,
          suffix: "MF",
        },
        {
          key: "commercial",
          value: row.commercial,
          color: BUILDING_COLORS.commercial,
          suffix: "Commercial",
        },
        {
          key: "institutional",
          value: row.institutional,
          color: BUILDING_COLORS.institutional,
          suffix: "Inst",
        },
        {
          key: "other",
          value: row.other,
          color: BUILDING_COLORS.other,
          suffix: "Other",
        },
      ]}
    />
  );
}

function SystemTypeStrip({ row }: { row: SystemRow }) {
  return (
    <TypeStrip
      total={row.total}
      labelPosition="below"
      segments={[
        {
          key: "lightFrame",
          value: row.lightFrame,
          color: SYSTEM_COLORS.lightFrame,
          suffix: "LF",
        },
        {
          key: "hybridMtLf",
          value: row.hybridMtLf,
          color: SYSTEM_COLORS.hybridMtLf,
          suffix: "Hybrid",
        },
        {
          key: "heavyMt",
          value: row.heavyMt,
          color: SYSTEM_COLORS.heavyMt,
          suffix: "MT",
        },
      ]}
    />
  );
}

function SharedXAxis() {
  const data = [{ yLabel: "", spacer: 0 }];

  return (
    <div className="flex gap-2">
      <div className="w-[6rem] shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <ResponsiveContainer width="100%" height={28}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 56, left: 8, bottom: 0 }}
            barCategoryGap={0}
          >
            <XAxis
              type="number"
              domain={[0, 480]}
              tick={{ fill: "#374151", fontSize: 11 }}
              tickFormatter={(value) => Number(value).toLocaleString("en-US")}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <YAxis type="category" dataKey="yLabel" hide width={0} />
            <Bar dataKey="spacer" fill="transparent" barSize={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StripLegend() {
  return (
    <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-[10px] font-medium uppercase text-gray-600">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-bold text-gray-500">Projects:</span>
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
        <span className="font-bold text-gray-500">Building Type:</span>
        {[
          { label: "Multifamily", color: "#005F33" },
          { label: "Commercial", color: "#42B245" },
          { label: "Institutional", color: "#7EBC41" },
          { label: "Other", color: "#4A93BB" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-[3px] w-4 rounded-full"
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
              className="inline-block h-[3px] w-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ConvertedProjectsStripsChart() {
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

      <div className="mx-auto mt-6 max-w-5xl">
        <div className="space-y-1">
          {YEAR_GROUPS.map((group) => (
            <div key={group.year} className="pb-3">
              <div className="flex gap-2">
                <div className="w-[6rem] shrink-0" aria-hidden="true" />
                <p
                  className="min-w-0 flex-1 text-left text-sm font-semibold leading-none text-[#374151]"
                  style={{
                    paddingLeft: CHART_MARGIN.left,
                    marginBottom: "-8px",
                  }}
                >
                  {group.year}
                </p>
              </div>
              <div
                className="flex items-stretch gap-2"
                style={{ marginTop: "-16px" }}
              >
                <div className="flex w-[6rem] shrink-0 flex-col pr-2 text-right text-[10px] font-semibold uppercase leading-tight tracking-[0.1em] text-gray-500">
                  <div
                    className="flex items-center justify-end whitespace-nowrap"
                    style={{ height: STRIP_CHART_HEIGHT_ABOVE }}
                  >
                    Building Type
                  </div>
                  <div
                    className="-mt-2 flex items-center justify-end text-[13px] font-bold leading-tight"
                    style={{ height: CHART_ROW_HEIGHT }}
                  >
                    Converted Projects
                  </div>
                  <div
                    className="-mt-1 flex items-center justify-end whitespace-nowrap"
                    style={{ height: STRIP_CHART_HEIGHT_BELOW }}
                  >
                    System Type
                  </div>
                </div>
                <div className="relative min-w-0 flex-1 overflow-visible">
                  <BuildingTypeStrip row={group.building} />
                  <div className="relative z-10 -mt-2">
                    <VolumeChart row={group.volume} />
                  </div>
                  <div className="relative -mt-1">
                    <SystemTypeStrip row={group.system} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <SharedXAxis />
        </div>

        <StripLegend />
      </div>
    </div>
  );
}
