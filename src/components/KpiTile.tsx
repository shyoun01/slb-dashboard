import { ReactNode } from "react";

export default function KpiTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border p-5 shadow bg-white">
      {/* Label - darker gray for better contrast */}
      <div className="text-sm text-gray-700 font-medium">{label}</div>

      {/* Value - darker text, bold */}
      <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>

      {/* Subtext - slightly lighter but still legible */}
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}
