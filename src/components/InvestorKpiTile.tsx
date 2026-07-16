import React from "react";

interface InvestorKpiTileProps {
  label: string;
  value: string | number | null | undefined;
  sub?: string | null | undefined;
}

export default function InvestorKpiTile({
  label,
  value,
  sub,
}: InvestorKpiTileProps) {
  return (
    <div className="kpi-tile flex flex-col justify-between">
      <p className="kpi-label">{label}</p>
      <h3 className="kpi-value">
        {value !== null && value !== undefined ? value : "—"}
      </h3>
      {sub && <p className="kpi-sub">{sub}</p>}
    </div>
  );
}
