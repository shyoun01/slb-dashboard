"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { YearRow } from "@/data/slb.schema";

const YEAR_MIN = 2018;
const YEAR_MAX = 2025;

interface ProgramImpactVsMacrosChartProps {
  data: YearRow[];
}

/**
 * Program Impact vs. Construction Macros (Beta)
 * --------------------------------------------
 * Bars: total program impact (totalBF_MM, MM BF).
 * Line: Projects converted (orange trend).
 * Years 2018–2025 where data exists.
 */
export default function ProgramImpactVsMacrosChart({
  data,
}: ProgramImpactVsMacrosChartProps) {
  const [showMfStarts, setShowMfStarts] = useState(true);
  const [showMfPermits, setShowMfPermits] = useState(false);
  const [showAbi, setShowAbi] = useState(false);
  const [showNahb, setShowNahb] = useState(false);
  const [showConstructionGrowth, setShowConstructionGrowth] = useState(false);
  const [showMortgageRate, setShowMortgageRate] = useState(false);
  const [showTreasury, setShowTreasury] = useState(false);
  const [showFedFunds, setShowFedFunds] = useState(false);
  const [showLumberPrice, setShowLumberPrice] = useState(false);
  const [showBankTightening, setShowBankTightening] = useState(false);

  const chartData = data
    .filter((d) => d.year >= YEAR_MIN && d.year <= YEAR_MAX)
    .map((d) => ({
      year: d.year,
      totalBF_MM: d.totalBF_MM ?? null,
      projects: d.projects ?? null,
      mfStarts_k: d.mfStarts_k ?? null,
      mfPermits_k: d.mfPermits_k ?? null,
      abiAvg: d.abiAvg ?? null,
      nahbHmi: d.nahbHmi ?? null,
      constructionSpendingGrowth_pct: d.constructionSpendingGrowth_pct ?? null,
      mortgage30yr_pct: d.mortgage30yr_pct ?? null,
      treasury10yr_pct: d.treasury10yr_pct ?? null,
      fedFunds_pct: d.fedFunds_pct ?? null,
      lumberPrice_usdPerMbf: d.lumberPrice_usdPerMbf ?? null,
      bankLendingTighteningIndex_pct: d.bankLendingTighteningIndex_pct ?? null,
    }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-2 border-[var(--slb-green)] rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--slb-charcoal)] text-center mb-4">
        Program Impact vs. Construction Macros (Beta)
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 60, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="year"
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
          />

          <YAxis
            yAxisId="impact"
            tickFormatter={(v) => `${v.toLocaleString()} MM`}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{
              value: "Total Program Impact (MM BF)",
              angle: -90,
              position: "insideLeft",
              dy: 65,
            }}
          />

          <YAxis
            yAxisId="projects"
            orientation="right"
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            label={{
              value: "Projects & Macros (various units)",
              angle: 90,
              position: "insideRight",
              dy: 65,
            }}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const row = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      padding: "10px 12px",
                      color: "#111827",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem",
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: "6px" }}>{label}</p>
                    <p style={{ fontWeight: 600, color: "#005F33" }}>
                      Total Program Impact:{" "}
                      {row.totalBF_MM != null
                        ? `${row.totalBF_MM.toLocaleString()} MM BF`
                        : "—"}
                    </p>
                    <p style={{ fontWeight: 600, color: "#EA580C" }}>
                      Projects:{" "}
                      {row.projects != null
                        ? row.projects.toLocaleString()
                        : "—"}
                    </p>
                    {showMfStarts && (
                      <p style={{ fontWeight: 600, color: "#0EA5E9" }}>
                        MF Starts (000s):{" "}
                        {row.mfStarts_k != null
                          ? row.mfStarts_k.toLocaleString()
                          : "—"}
                      </p>
                    )}
                    {showMfPermits && (
                      <p style={{ fontWeight: 600, color: "#6366F1" }}>
                        MF Permits (000s):{" "}
                        {row.mfPermits_k != null
                          ? row.mfPermits_k.toLocaleString()
                          : "—"}
                      </p>
                    )}
                    {showAbi && (
                      <p style={{ fontWeight: 600, color: "#22C55E" }}>
                        ABI Avg:{" "}
                        {row.abiAvg != null ? row.abiAvg.toFixed(1) : "—"}
                      </p>
                    )}
                    {showNahb && (
                      <p style={{ fontWeight: 600, color: "#A855F7" }}>
                        NAHB HMI:{" "}
                        {row.nahbHmi != null ? row.nahbHmi.toFixed(0) : "—"}
                      </p>
                    )}
                    {showConstructionGrowth && (
                      <p style={{ fontWeight: 600, color: "#F97316" }}>
                        Construction Spending Growth:{" "}
                        {row.constructionSpendingGrowth_pct != null
                          ? `${row.constructionSpendingGrowth_pct.toFixed(1)}%`
                          : "—"}
                      </p>
                    )}
                    {showMortgageRate && (
                      <p style={{ fontWeight: 600, color: "#0F766E" }}>
                        30-yr Mortgage Rate:{" "}
                        {row.mortgage30yr_pct != null
                          ? `${row.mortgage30yr_pct.toFixed(2)}%`
                          : "—"}
                      </p>
                    )}
                    {showTreasury && (
                      <p style={{ fontWeight: 600, color: "#FACC15" }}>
                        10-yr Treasury:{" "}
                        {row.treasury10yr_pct != null
                          ? `${row.treasury10yr_pct.toFixed(2)}%`
                          : "—"}
                      </p>
                    )}
                    {showFedFunds && (
                      <p style={{ fontWeight: 600, color: "#FB7185" }}>
                        Fed Funds:{" "}
                        {row.fedFunds_pct != null
                          ? `${row.fedFunds_pct.toFixed(2)}%`
                          : "—"}
                      </p>
                    )}
                    {showLumberPrice && (
                      <p style={{ fontWeight: 600, color: "#4B5563" }}>
                        Lumber Price:{" "}
                        {row.lumberPrice_usdPerMbf != null
                          ? `$${row.lumberPrice_usdPerMbf.toLocaleString()}/mbf`
                          : "—"}
                      </p>
                    )}
                    {showBankTightening && (
                      <p style={{ fontWeight: 600, color: "#7C2D12" }}>
                        Bank Lending Tightening Index:{" "}
                        {row.bankLendingTighteningIndex_pct != null
                          ? `${row.bankLendingTighteningIndex_pct.toFixed(0)}`
                          : "—"}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              if (value === "totalBF_MM") return "Total Program Impact (MM BF)";
              if (value === "projects") return "Projects";
              if (value === "mfStarts_k") return "MF Starts (000s)";
              if (value === "mfPermits_k") return "MF Permits (000s)";
              if (value === "abiAvg") return "ABI Avg";
              if (value === "nahbHmi") return "NAHB HMI";
              if (value === "constructionSpendingGrowth_pct")
                return "Construction Spending Growth (%)";
              if (value === "mortgage30yr_pct")
                return "30-yr Mortgage Rate (%)";
              if (value === "treasury10yr_pct")
                return "10-yr Treasury Yield (%)";
              if (value === "fedFunds_pct") return "Fed Funds Rate (%)";
              if (value === "lumberPrice_usdPerMbf")
                return "Lumber Price ($/mbf)";
              if (value === "bankLendingTighteningIndex_pct")
                return "Bank Lending Tightening Index";
              return value;
            }}
          />

          <Bar
            yAxisId="impact"
            dataKey="totalBF_MM"
            fill="#005F33"
            name="totalBF_MM"
            radius={[6, 6, 0, 0]}
          />

          <Line
            yAxisId="projects"
            type="monotone"
            dataKey="projects"
            stroke="#EA580C"
            strokeWidth={3}
            dot={{ fill: "#EA580C", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="projects"
          />

          {showMfStarts && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="mfStarts_k"
              stroke="#0EA5E9"
              strokeWidth={2.5}
              dot={{ fill: "#0EA5E9", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="mfStarts_k"
            />
          )}

          {showMfPermits && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="mfPermits_k"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="mfPermits_k"
            />
          )}

          {showAbi && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="abiAvg"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ fill: "#22C55E", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="abiAvg"
            />
          )}

          {showNahb && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="nahbHmi"
              stroke="#A855F7"
              strokeWidth={2}
              dot={{ fill: "#A855F7", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="nahbHmi"
            />
          )}

          {showConstructionGrowth && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="constructionSpendingGrowth_pct"
              stroke="#F97316"
              strokeWidth={2}
              dot={{ fill: "#F97316", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="constructionSpendingGrowth_pct"
            />
          )}

          {showMortgageRate && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="mortgage30yr_pct"
              stroke="#0F766E"
              strokeWidth={2}
              dot={{ fill: "#0F766E", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="mortgage30yr_pct"
            />
          )}

          {showTreasury && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="treasury10yr_pct"
              stroke="#FACC15"
              strokeWidth={2}
              dot={{ fill: "#FACC15", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="treasury10yr_pct"
            />
          )}

          {showFedFunds && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="fedFunds_pct"
              stroke="#FB7185"
              strokeWidth={2}
              dot={{ fill: "#FB7185", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="fedFunds_pct"
            />
          )}

          {showLumberPrice && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="lumberPrice_usdPerMbf"
              stroke="#4B5563"
              strokeWidth={2}
              dot={{ fill: "#4B5563", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="lumberPrice_usdPerMbf"
            />
          )}

          {showBankTightening && (
            <Line
              yAxisId="projects"
              type="monotone"
              dataKey="bankLendingTighteningIndex_pct"
              stroke="#7C2D12"
              strokeWidth={2}
              dot={{ fill: "#7C2D12", strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5 }}
              name="bankLendingTighteningIndex_pct"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--slb-gray)]">
        <span className="font-medium text-[var(--slb-charcoal)]">
          Overlays:
        </span>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showMfStarts}
            onChange={(e) => setShowMfStarts(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            MF Starts
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Multifamily housing starts (5+ units), measured in thousands of units. Source: U.S. Census Bureau."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showMfPermits}
            onChange={(e) => setShowMfPermits(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            MF Permits
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Multifamily building permits, a leading indicator for future multifamily construction. Source: U.S. Census Bureau."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showAbi}
            onChange={(e) => setShowAbi(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            ABI Avg
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Architectural Billings Index (ABI) – average architecture firm billings, a leading indicator for construction activity. Source: AIA."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showNahb}
            onChange={(e) => setShowNahb(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            NAHB HMI
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "NAHB Housing Market Index – homebuilder sentiment for single-family housing. Source: NAHB."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showConstructionGrowth}
            onChange={(e) => setShowConstructionGrowth(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            Construction Spending Growth
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Annual growth in U.S. construction spending (Census/BEA proxy)."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showMortgageRate}
            onChange={(e) => setShowMortgageRate(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            30-yr Mortgage Rate
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Average 30-year fixed mortgage rate. Source: Freddie Mac / FRED."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showTreasury}
            onChange={(e) => setShowTreasury(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            10-yr Treasury
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Average 10-year U.S. Treasury yield. Source: Federal Reserve / FRED."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showFedFunds}
            onChange={(e) => setShowFedFunds(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            Fed Funds
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Average Federal Funds policy rate. Source: Federal Reserve."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showLumberPrice}
            onChange={(e) => setShowLumberPrice(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            Lumber Price
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Average U.S. lumber price per thousand board feet. Source: CME / Random Lengths proxy."
              }
            >
              i
            </span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[var(--slb-green)] focus:ring-[var(--slb-green)]"
            checked={showBankTightening}
            onChange={(e) => setShowBankTightening(e.target.checked)}
          />
          <span className="flex items-center gap-1">
            Bank Lending Tightening
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.6rem] text-gray-700 cursor-help"
              title={
                "Net percentage of banks tightening construction lending standards. Source: Federal Reserve Senior Loan Officer Opinion Survey (SLOOS)."
              }
            >
              i
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
