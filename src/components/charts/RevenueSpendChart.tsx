"use client";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import { YearRow } from "@/data/slb.schema";

export default function RevenueSpendChart({ data }: { data: YearRow[] }) {
  const rows = data.map((r) => ({
    year: r.year,
    revenue: r.incrementalRevenueMM,
    spend: r.spendMM,
  }));

  return (
    <div className="h-72 w-full rounded-2xl border bg-white p-3">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={rows}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" tickFormatter={(v) => `$${v}M`} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${v}M`} />
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
          <Bar yAxisId="left" dataKey="revenue" name="Incremental Revenue ($MM)" fill="#60a5fa" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="spend"
            name="SLB Spend ($MM)"
            stroke="#1e3a8a"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
