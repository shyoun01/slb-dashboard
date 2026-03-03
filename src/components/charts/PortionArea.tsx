"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { YearRow } from "@/data/slb.schema";

export default function PortionArea({ data }: { data: YearRow[] }) {
  const rows = data.map((r) => ({
    year: r.year,
    volume: r.volumePortion_pct ?? null,
    pricing: r.pricePortion_pct ?? null,
  }));

  return (
    <div className="h-72 w-full rounded-2xl border bg-white p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={rows}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `${v}%`} />
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
          <Area
            type="monotone"
            dataKey="volume"
            name="Volume Portion"
            stackId="1"
            fill="#7EBC41"
            stroke="#42B245"
          />
          <Area
            type="monotone"
            dataKey="pricing"
            name="Pricing Portion"
            stackId="1"
            fill="#67846A"
            stroke="#005F33"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
