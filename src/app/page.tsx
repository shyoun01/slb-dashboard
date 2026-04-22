"use client";

import { useState } from "react";
import { loadYears } from "@/data/load";
import { buildCsv, downloadCsv } from "@/data/exportCsv";
import KpiTile from "@/components/KpiTile";
import YearStepper from "@/components/YearStepper";
import RevenueSpendChart from "@/components/charts/RevenueSpendChart";
import RoiTrend from "@/components/charts/RoiTrend";
import PortionArea from "@/components/charts/PortionArea";
import IncrementalLumberChart from "@/components/charts/IncrementalLumberChart";
import CumulativeRoiSummary from "@/components/charts/CumulativeRoiSummary";
import MarketShareChart from "@/components/charts/MarketShareChart";
import InfluenceProjectsChart from "@/components/charts/InfluenceProjectsChart";
import ProgramImpactInYearChart from "@/components/charts/ProgramImpactInYearChart";
import ProgramImpactVsMacrosChart from "@/components/charts/ProgramImpactVsMacrosChart";

export default function Page() {
  const allData = loadYears();
  if (!allData || allData.length === 0) {
    return <div className="p-6 text-red-700">Error: No data loaded</div>;
  }

  // Keep annual KPIs/stepper anchored to the latest *annual* year (currently through 2025),
  // while allowing the quarterly dashboard to include partial-year updates (e.g., 2026 Q1).
  const annualData = allData.filter((r) => r.year <= 2025);
  const latest = annualData[annualData.length - 1] ?? allData[allData.length - 1];
  const [year, setYear] = useState(latest.year);
  const row = annualData.find((r) => r.year === year)!;

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-12 min-h-screen bg-[var(--slb-light)]">
      {/* === Dashboard Header === */}
      <header className="text-center mb-8 border-b-4 border-[var(--slb-green)] pb-4">
        <h1 className="text-4xl font-bold tracking-wide text-[var(--slb-charcoal)]">
          SLB ROI Analysis
        </h1>
        <p className="text-[var(--slb-gray)] text-sm mt-2 uppercase tracking-wider">
          Softwood Lumber Board | Investment Impact Dashboard
        </p>
        <p className="mt-3">
          <button
            type="button"
            onClick={() => {
              const csv = buildCsv(allData);
              downloadCsv(csv);
            }}
            className="text-sm font-medium text-[var(--slb-charcoal)] underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--slb-green)] rounded px-1"
          >
            Download data (CSV)
          </button>
        </p>
      </header>

      {/* === SECTION: Quarterly Dashboard === */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--slb-charcoal)] border-b-2 border-[var(--slb-green)] pb-2 mb-4">
          Quarterly Dashboard
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <InfluenceProjectsChart data={allData} />
          <ProgramImpactInYearChart data={allData} />
        </div>
      </section>

      {/* === KPI OVERVIEW === */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--slb-green)] pb-2 mb-4">
          <h2 className="text-xl font-semibold text-[var(--slb-charcoal)]">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* 1. ROI */}
          <KpiTile
            label={`ROI (${year})`}
            value={
              row.roiPerDollar != null
                ? `$${Number(row.roiPerDollar).toFixed(2)} per $1`
                : "—"
            }
          />

          {/* 2. Incremental Revenue */}
          <KpiTile
            label={`Incremental Revenue (${year})`}
            value={
              row.incrementalRevenueMM
                ? `$${row.incrementalRevenueMM.toLocaleString("en-US")} MM`
                : "—"
            }
          />

          {/* 3. Incremental Lumber */}
          <KpiTile
            label={`Incremental Lumber (${year})`}
            value={
              row.totalBF_MM
                ? `${row.totalBF_MM.toLocaleString("en-US")} MM BF`
                : "—"
            }
            sub={`In-year: ${
              row.incBF_MM !== null && row.incBF_MM !== undefined
                ? row.incBF_MM.toLocaleString("en-US")
                : "—"
            } | Tail: ${
              row.tailBF_MM !== null && row.tailBF_MM !== undefined
                ? row.tailBF_MM.toLocaleString("en-US")
                : "—"
            }`}
          />

          {/* 4. SLB Spend */}
          <KpiTile
            label={`SLB Spend (${year})`}
            value={
              row.spendMM != null
                ? `$${row.spendMM.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })} MM`
                : "—"
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
    </main>
  );
}
