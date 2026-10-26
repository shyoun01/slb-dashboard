"use client";

import { useState } from "react";
import { loadYears } from "@/data/load";
import { buildCsv, downloadCsv } from "@/data/exportCsv";
import KpiTile from "@/components/KpiTile";
import YearStepper from "@/components/YearStepper";
import RevenueSpendChart from "@/components/charts/RevenueSpendChart";
import RoiTrend from "@/components/charts/RoiTrend";
import IncrementalLumberChart from "@/components/charts/IncrementalLumberChart";
import CumulativeRoiSummary from "@/components/charts/CumulativeRoiSummary";
import MarketShareChart from "@/components/charts/MarketShareChart";
import InfluenceProjectsChart from "@/components/charts/InfluenceProjectsChart";
import ProgramImpactInYearChart from "@/components/charts/ProgramImpactInYearChart";
import ProgramImpactVsMacrosChart from "@/components/charts/ProgramImpactVsMacrosChart";
import { lastAnnualYear } from "@/data/airtable";

export default function Page() {
  const allData = loadYears();
  if (!allData || allData.length === 0) {
    return <div className="p-6 text-red-700">Error: No data loaded</div>;
  }

  // Keep annual KPIs/stepper anchored to the latest *annual* year (the last year with spend reported),
  // while allowing the quarterly dashboard to include partial-year updates (e.g., 2026 Q1).
  const annualData = allData.filter((r) => r.year <= lastAnnualYear());
  const latest = annualData[annualData.length - 1] ?? allData[allData.length - 1];
  const [year, setYear] = useState(latest.year);
  const row = annualData.find((r) => r.year === year)!;

  return (
    <main className="mx-auto max-w-7xl min-h-screen bg-[var(--slb-light)]">
      {/* === Header === */}
      <header className="bg-[var(--slb-charcoal)] px-12 py-7 flex items-center justify-between">
        <div>
          <p className="text-[var(--slb-light-green)] text-[13px] font-extrabold tracking-[0.12em] mb-1">
            SOFTWOOD LUMBER BOARD
          </p>
          <h1 className="text-white text-3xl font-bold">SLB ROI Analysis</h1>
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(buildCsv(allData))}
          className="bg-[var(--slb-green)] text-white text-sm font-bold px-4 py-2 rounded-full hover:opacity-90"
        >
          Download CSV
        </button>
      </header>

      <div className="p-12 space-y-14">
        <section>
          <h2 className="text-xl font-bold text-[var(--slb-charcoal)] mb-6">
            Quarterly Dashboard
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <InfluenceProjectsChart data={allData} />
            <ProgramImpactInYearChart data={allData} />
          </div>
        </section>

        {/* === KPI OVERVIEW === */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[var(--slb-charcoal)]">
              Annual ROI Overview
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--slb-gray)]">Data for</span>
              <YearStepper
                min={annualData[0].year}
                max={annualData[annualData.length - 1].year}
                value={year}
                onChange={setYear}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            <KpiTile
              label={`ROI (${year})`}
              value={
                row.roiPerDollar != null
                  ? `$${Number(row.roiPerDollar).toFixed(2)}`
                  : "—"
              }
            />
            <KpiTile
              label={`Incremental Revenue (${year})`}
              value={
                row.incrementalRevenueMM
                  ? `$${row.incrementalRevenueMM}M`
                  : "—"
              }
            />
            <KpiTile
              label={`Incremental Lumber (${year})`}
              value={
                row.totalBF_MM ? `${row.totalBF_MM} MM BF` : "—"
              }
              sub={`In-year: ${row.incBF_MM ?? "—"} | Tail: ${row.tailBF_MM ?? "—"}`}
            />
            <KpiTile
              label={`SLB Spend (${year})`}
              value={
                row.spendMM != null ? `$${row.spendMM.toFixed(1)}M` : "—"
              }
            />
          </div>

          <div className="mt-8 space-y-6">
            <CumulativeRoiSummary data={annualData} />
            <RevenueSpendChart data={annualData} />
            <IncrementalLumberChart data={annualData} />
            <RoiTrend data={annualData} />
            <MarketShareChart data={annualData} />
            <ProgramImpactVsMacrosChart data={annualData} />
          </div>
        </section>
      </div>
    </main>
  );
}
