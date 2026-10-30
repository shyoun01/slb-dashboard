"use client";

import React from "react";
import { pyramidFigures } from "@/data/airtable";

/*
 * Program impact pyramid: an inverted "Demand Generated" triangle on top of a pyramid
 * (Projects Converted → Professional Education), each tier with a slanted panel holding
 * its headline figure. Drawn as one SVG so shapes and text scale together.
 */

const W = 1000;
const CX = 300; // pyramid centre line
const SLOPE = 0.7; // half-width gained per unit of height
const GAP = 10; // horizontal gap between a tier and its panel
const PANEL_W = 430;
const PAD = 16; // text inset inside a panel

type Tier = {
  key: string;
  y0: number;
  y1: number;
  inverted?: boolean;
  label: string[];
  shape: string;
  panel: string;
  figure: string;
  description: string[];
};

const fmt = (n: number | null, digits = 0) =>
  n == null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });

/** Half-width of the upright pyramid at height y (apex at APEX_Y) */
const APEX_Y = 117;
const halfWidth = (y: number) => Math.max(0, (y - APEX_Y) * SLOPE);
/** Half-width of the inverted top triangle at height y (point at TOP_POINT_Y) */
const TOP_POINT_Y = 107;
const topHalfWidth = (y: number) => Math.max(0, (TOP_POINT_Y - y) * SLOPE);

export default function ImpactPyramidCard() {
  const f = pyramidFigures();
  const inYear = `in ${f.year}.`;

  const tiers: Tier[] = [
    {
      key: "demand", y0: 0, y1: TOP_POINT_Y, inverted: true, label: ["DEMAND", "GENERATED"],
      shape: "#F07A2B", panel: "#FCE3D3",
      figure: `${fmt(f.demandGenerated)} MM BF Generated`, description: [`Total demand generated ${inYear}`],
    },
    {
      key: "converted", y0: APEX_Y, y1: 224, label: ["PROJECTS", "CONVERTED"],
      shape: "#82C342", panel: "#E5F1D9",
      figure: `${fmt(f.projectsConverted)} Projects Converted`, description: ["Projects directly converted", inYear],
    },
    {
      key: "influenced", y0: 232, y1: 306, label: ["PROJECTS", "INFLUENCED"],
      shape: "#42B245", panel: "#DCEEDB",
      figure: `${fmt(f.projectsInfluenced)} Projects Influenced`, description: ["Projects directly and indirectly", `influenced ${inYear}`],
    },
    {
      key: "audience", y0: 314, y1: 388, label: ["AUDIENCE ENGAGED"],
      shape: "#005F33", panel: "#CCE0D6",
      figure: `${fmt(f.individualContacts)} Individual Contacts`, description: ["New professional contacts and direct", `engagements ${inYear}`],
    },
    {
      key: "education", y0: 396, y1: 470, label: ["PROFESSIONAL EDUCATION"],
      shape: "#404040", panel: "#DCDCDC",
      figure: `${fmt(f.educationHours)} Education Hours`, description: ["Total online and in-person live education", `provided ${inYear}`],
    },
  ];
  const H = tiers[tiers.length - 1].y1;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-center text-[1.6875rem] font-semibold text-[var(--slb-charcoal)]">
        Building Demand through Coordinated Programs
      </h3>
      <p className="mb-4 text-center text-lg font-semibold text-[var(--slb-charcoal)]">{f.year} year to date</p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-5xl" role="img"
        aria-label={tiers.map((t) => `${t.label.join(" ")}: ${t.figure}`).join("; ")}>
        {tiers.map((t) => {
          // tier shape (triangle or trapezoid) and the panel beside it
          const hw0 = t.inverted ? topHalfWidth(t.y0) : halfWidth(t.y0);
          const hw1 = t.inverted ? topHalfWidth(t.y1) : halfWidth(t.y1);
          const shape = [[CX - hw0, t.y0], [CX + hw0, t.y0], [CX + hw1, t.y1], [CX - hw1, t.y1]];
          const left0 = CX + hw0 + GAP;
          const left1 = CX + hw1 + GAP;
          const panel = [[left0, t.y0], [left0 + PANEL_W, t.y0], [left1 + PANEL_W, t.y1], [left1, t.y1]];
          const points = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");

          // text starts past the panel's slanted left edge at its widest point
          const textX = Math.max(left0, left1) + PAD;
          const lines = 1 + t.description.length;
          const lineH = 23;
          const firstY = (t.y0 + t.y1) / 2 - ((lines - 1) * lineH) / 2;

          // label sits in the wide part of the shape
          // triangles are only wide enough near their base (top of the inverted one)
          const labelCenterY = t.inverted ? t.y0 + 25 : t.key === "converted" ? t.y1 - 26 : (t.y0 + t.y1) / 2;
          const labelLineH = 18;
          const labelFirstY = labelCenterY - ((t.label.length - 1) * labelLineH) / 2;

          return (
            <g key={t.key}>
              <polygon points={points(shape)} fill={t.shape} />
              <polygon points={points(panel)} fill={t.panel} />
              <text textAnchor="middle" fill="#ffffff" fontSize={15} fontWeight={700} dominantBaseline="central">
                {t.label.map((line, i) => (
                  <tspan key={line} x={CX} y={labelFirstY + i * labelLineH}>{line}</tspan>
                ))}
              </text>
              <text fill="#1f2937" dominantBaseline="central">
                <tspan x={textX} y={firstY} fontSize={20} fontWeight={700}>{t.figure}</tspan>
                {t.description.map((line, i) => (
                  <tspan key={line} x={textX} y={firstY + (i + 1) * lineH} fontSize={16}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
