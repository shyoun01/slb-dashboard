"use client";

import { useState } from "react";
import { loadYears } from "@/data/load";
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

export default function Page() {
  const data = loadYears();
  if (!data || data.length === 0) {
    return <div className="p-6 text-red-700">Error: No data loaded</div>;
  }

  const latest = data[data.length - 1];
  const [year, setYear] = useState(latest.year);
  const row = data.find((r) => r.year === year)!;

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
      </header>

      {/* === SECTION: Quarterly Dashboard === */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--slb-charcoal)] border-b-2 border-[var(--slb-green)] pb-2 mb-4">
          Quarterly Dashboard
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <InfluenceProjectsChart data={data} />
          <ProgramImpactInYearChart data={data} />
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
              min={data[0].year}
              max={data[data.length - 1].year}
              value={year}
              onChange={setYear}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* 1. ROI */}
          <KpiTile
            label={`ROI (${year})`}
            value={
              row.roiPerDollar
                ? `$${row.roiPerDollar.toLocaleString("en-US")} per $1`
                : "—"
            }
          />

          {/* 2. Cumulative ROI */}
          <KpiTile
            label={`Cumulative ROI (${year})`}
            value={
              row.cumulativeRoiPerDollar
                ? `$${row.cumulativeRoiPerDollar.toLocaleString("en-US")} per $1`
                : "—"
            }
          />

          {/* 3. Incremental Revenue */}
          <KpiTile
            label={`Incremental Revenue (${year})`}
            value={
              row.incrementalRevenueMM
                ? `$${row.incrementalRevenueMM.toLocaleString("en-US")} MM`
                : "—"
            }
          />

          {/* 4. Incremental Lumber */}
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

          {/* 5. SLB Spend */}
          <KpiTile
            label={`SLB Spend (${year})`}
            value={
              row.spendMM ? `$${row.spendMM.toLocaleString("en-US")} MM` : "—"
            }
          />
        </div>
      </section>

      {/* === SECTION: ROI Summary and Trend === */}
      <section className="bg-gray-50 rounded-2xl p-6 shadow-inner">
        <h2 className="text-xl font-semibold text-[var(--slb-charcoal)] border-b-2 border-[var(--slb-green)] pb-2 mb-4">
          ROI Summary and Trend
        </h2>

        <div className="space-y-6">
          <CumulativeRoiSummary data={data} />
          <RoiTrend data={data} />
        </div>
      </section>

      {/* === SECTION: Financial Performance Trends === */}
      <section className="bg-gray-50 rounded-2xl p-6 shadow-inner">
        <h2 className="text-xl font-semibold text-[var(--slb-charcoal)] border-b-2 border-[var(--slb-green)] pb-2 mb-4">
          Financial Performance Trends
        </h2>

        <div className="grid md:grid-cols-1 gap-6">
          <RevenueSpendChart data={data} />
        </div>
      </section>

      {/* === SECTION: Market & Volume Dynamics === */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--slb-charcoal)] border-b-2 border-[var(--slb-green)] pb-2 mb-4">
          Market &amp; Volume Dynamics
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <IncrementalLumberChart data={data} />
        </div>
      </section>

      {/* === SECTION: SLB Market Share Impact === */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--slb-charcoal)] border-b-2 border-[var(--slb-green)] pb-2 mb-4">
          SLB Market Share Impact
        </h2>

        <div className="grid md:grid-cols-1 gap-6">
          <MarketShareChart data={data} />
        </div>
      </section>
    </main>
  );
}
