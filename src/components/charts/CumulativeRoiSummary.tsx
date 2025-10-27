"use client";
import { useMemo } from "react";
import { YearRow } from "@/data/slb.schema";

export default function CumulativeRoiSummary({ data }: { data: YearRow[] }) {
  const totals = useMemo(() => {
    const totalRevenue = data.reduce((sum, r) => sum + (r.incrementalRevenueMM ?? 0), 0);
    const totalSpend = data.reduce((sum, r) => sum + (r.spendMM ?? 0), 0);
    const roi = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    return {
      totalRevenue,
      totalSpend,
      roi,
    };
  }, [data]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side - Title and main ROI */}
        <div className="flex items-center gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cumulative ROI Summary (2012–2024)
            </h3>
            <div className="text-3xl font-bold text-[var(--slb-blue)] mt-1">
              ${totals.roi.toFixed(2)} <span className="text-base font-normal text-gray-600">per $1</span>
            </div>
          </div>
        </div>

        {/* Right side - Revenue and Spend metrics */}
        <div className="flex flex-col md:flex-row gap-8 text-sm">
          <div className="text-center md:text-left">
            <p className="text-gray-600 font-medium">Total Incremental Revenue</p>
            <p className="text-xl font-semibold text-gray-900">
              ${totals.totalRevenue.toLocaleString("en-US")} MM
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-gray-600 font-medium">Total Program Spend</p>
            <p className="text-xl font-semibold text-gray-900">
              ${totals.totalSpend.toLocaleString("en-US")} MM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}