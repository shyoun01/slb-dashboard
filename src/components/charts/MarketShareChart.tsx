"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { YearRow } from "@/data/slb.schema";

export default function MarketShareChart({ data }: { data: YearRow[] }) {
  const rows = data.map((r) => ({
    year: r.year,
    share: r.slbShare_pct ? r.slbShare_pct * 100 : null, // convert from 0.035 → 3.5%
  }));

  return (
    <div className="h-80 w-full rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        SLB Market Share Impact
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={rows}
          margin={{ top: 10, right: 30, bottom: 10, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(1)}%`}
            domain={[0, "auto"]}
          />
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
            formatter={(v: any) => [`${v.toFixed(2)}%`, "Market Share"]}
            separator=": "
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="share"
            name="SLB Market Share"
            stroke="#2563eb"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
