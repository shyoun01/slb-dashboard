"use client";

import { useState } from "react";
import { loadYears } from "@/data/load";
import InvestorKpiTile from "@/components/InvestorKpiTile";
import YearStepper from "@/components/YearStepper";
import RevenueSpendChart from "@/components/charts/RevenueSpendChart";
import RoiTrend from "@/components/charts/RoiTrend";
import IncrementalLumberChart from "@/components/charts/IncrementalLumberChart";
import CumulativeRoiSummary from "@/components/charts/CumulativeRoiSummary";
import InfluenceProjectsChart from "@/components/charts/InfluenceProjectsChart";
import ProgramImpactInYearChart from "@/components/charts/ProgramImpactInYearChart";
import { lastAnnualYear } from "@/data/airtable";

const ANNUAL_YEAR_MAX = lastAnnualYear();

export default function InvestorsRoiPage() {
  const allData = loadYears();
  if (!allData || allData.length === 0) {
    return <div className="p-6 text-red-700">Error: No data loaded</div>;
  }

  const annualData = allData.filter((r) => r.year <= ANNUAL_YEAR_MAX);
  const latest = annualData[annualData.length - 1] ?? allData[allData.length - 1];
  const [year, setYear] = useState(latest.year);
  const row = annualData.find((r) => r.year === year)!;

  return (
    <>
      {/* Hero — dark green band (annual report style) */}
      <header className="ar-hero px-6 py-16 text-center md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
          Softwood Lumber Board
        </p>
        <h1 className="mt-4 text-4xl font-bold uppercase tracking-wide md:text-5xl">
          Investor ROI
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
          Program impact and return on investment
        </p>
      </header>

      {/* Quarterly — cream band */}
      <section className="ar-section-cream px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="ar-section-title mb-8 text-center">
            Annual Program Impact
          </h2>
          <div className="space-y-8">
            <div className="ar-chart-panel">
              <InfluenceProjectsChart data={allData} />
            </div>
            <div className="ar-chart-panel">
              <ProgramImpactInYearChart data={allData} />
            </div>
          </div>
        </div>
      </section>

      {/* Annual KPIs — white band with large green numbers */}
      <section className="ar-section-white px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="ar-section-title">Annual ROI</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--ar-dark-gray)]">Data for</span>
              <YearStepper
                min={annualData[0].year}
                max={annualData[annualData.length - 1].year}
                value={year}
                onChange={setYear}
              />
            </div>
          </div>

          <div className="ar-kpi-grid grid grid-cols-2 gap-4 border-y border-[var(--ar-tan-border)] md:grid-cols-4">
            <InvestorKpiTile
              label={`ROI (${year})`}
              value={
                row.roiPerDollar != null
                  ? `$${Number(row.roiPerDollar).toFixed(2)} per $1`
                  : "—"
              }
            />
            <InvestorKpiTile
              label={`Incremental Revenue (${year})`}
              value={
                row.incrementalRevenueMM
                  ? `$${row.incrementalRevenueMM.toLocaleString("en-US")} MM`
                  : "—"
              }
            />
            <InvestorKpiTile
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
            <InvestorKpiTile
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
        </div>
      </section>

      {/* Charts — cream band */}
      <section className="ar-section-cream px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="ar-chart-panel">
            <CumulativeRoiSummary data={annualData} />
          </div>
          <div className="ar-chart-panel">
            <RevenueSpendChart data={annualData} />
          </div>
          <div className="ar-chart-panel">
            <IncrementalLumberChart data={annualData} />
          </div>
          <div className="ar-chart-panel">
            <RoiTrend data={annualData} />
          </div>
          <div className="ar-chart-panel">
            <RevenueSpendChart data={annualData} showBfImpactTable />
          </div>
        </div>
      </section>

      <footer className="ar-footer px-6 py-8 text-center text-xs">
        Figures reflect SLB program impact analysis. For questions, contact the
        Softwood Lumber Board.
      </footer>
    </>
  );
}
