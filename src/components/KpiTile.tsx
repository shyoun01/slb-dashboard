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
    <div className="flex flex-col justify-start pl-6 border-l border-gray-300 first:pl-0 first:border-l-0">
      <p className="text-[13px] font-bold uppercase tracking-wider text-[var(--slb-gray)] mb-2">
        {label}
      </p>
      <h3 className="text-5xl font-extrabold text-[var(--slb-green)] leading-none">
        {value !== null && value !== undefined ? value : "—"}
      </h3>
      {sub && (
        <p className="text-sm text-[var(--slb-charcoal)] font-semibold mt-2">{sub}</p>
      )}
    </div>
  );
}
