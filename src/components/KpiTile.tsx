import React from "react";

interface KpiTileProps {
  label: string;
  value: string | number | null | undefined;
  sub?: string | null | undefined;
}

/**
 * KPI Tile Component
 * ------------------
 * Displays a primary metric (e.g., ROI, Revenue, Lumber, Spend) and an optional subtitle.
 * Handles missing or null data gracefully.
 */
export default function KpiTile({ label, value, sub }: KpiTileProps) {
  return (
    <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Label */}
      <p className="text-sm font-semibold text-[var(--slb-charcoal)] mb-2 leading-tight">
        {label}
      </p>

      {/* Main Value */}
      <h3 className="text-3xl font-extrabold text-[var(--slb-charcoal)] leading-tight">
        {value !== null && value !== undefined ? value : "—"}
      </h3>

      {/* Optional Subtext */}
      {sub && (
        <p className="text-sm text-gray-600 mt-1 leading-snug">{sub}</p>
      )}
    </div>
  );
}
