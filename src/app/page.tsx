"use client";

import { useState } from "react";
import { loadYears } from "@/data/load";
import KpiTile from "@/components/KpiTile";
import YearSlider from "@/components/YearSlider";
import RevenueSpendChart from "@/components/charts/RevenueSpendChart";
import RoiTrend from "@/components/charts/RoiTrend";
import PortionArea from "@/components/charts/PortionArea";

export default function Page() {
  const data = loadYears();
  const latest = data[data.length - 1];
  const [year, setYear] = useState(latest.year);
  const row = data.find((r) => r.year === year)!;

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-4">SLB ROI Analysis</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiTile
          label={`ROI (${year})`}
          value={`$${row.roiPerDollar} per $1`}
          sub={`Cumulative: $${row.cumulativeRoiPerDollar} per $1`}
        />
        <KpiTile
          label={`Incremental Revenue (${year})`}
          value={`$${row.incrementalRevenueMM} MM`}
        />
        <KpiTile
          label={`Incremental Lumber (${year})`}
          value={`${row.totalBF_MM} MM BF`}
          sub={`In-year: ${row.incBF_MM} | Tail: ${row.tailBF_MM}`}
        />
        <KpiTile
          label={`SLB Spend (${year})`}
          value={`$${row.spendMM} MM`}
        />
      </div>

      <div className="rounded-2xl border p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">Select Year</div>
          <div className="text-sm text-gray-500">{year}</div>
        </div>
        <YearSlider
          min={data[0].year}
          max={data[data.length - 1].year}
          value={year}
          onChange={setYear}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RevenueSpendChart data={data} />
        <RoiTrend data={data} />
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <PortionArea data={data} />
      </div>
    </main>
  );
}
