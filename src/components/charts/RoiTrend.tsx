"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { YearRow } from "@/data/slb.schema";

export default function RoiTrend({ data }: { data: YearRow[] }) {
  const rows = data.map((r) => ({
    year: r.year,
    roi: r.roiPerDollar,
    cumulative: r.cumulativeRoiPerDollar,
  }));

  return (
    <div className="h-72 w-full rounded-2xl border bg-white p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rows}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `$${v}`} />
          <Tooltip
  contentStyle={{
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    color: "#111827",
    fontSize: "0.9rem",
  }}
  labelStyle={{
    color: "#111827",
    fontWeight: "600",
  }}
  formatter={(v: any, n: any) => [`$${v}M`, n]}
/>

          <Legend />
          <Line type="monotone" dataKey="roi" name="Yearly ROI" stroke="#2563eb" dot />
          <Line
            type="monotone"
            dataKey="cumulative"
            name="Cumulative ROI"
            stroke="#9333ea"
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
