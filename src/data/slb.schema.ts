import { z } from "zod";

export const YearRow = z.object({
  year: z.number().int(),

  // Core financial metrics
  incrementalRevenueMM: z.number().nullable().optional(),
  spendMM: z.number().nullable().optional(),

  // ROI metrics
  roiPerDollar: z.number().nullable().optional(),
  cumulativeRoiPerDollar: z.number().nullable().optional(),

  // Lumber metrics
  incBF_MM: z.number().nullable().optional(),
  tailBF_MM: z.number().nullable().optional(),
  totalBF_MM: z.number().nullable().optional(),

  // Market share
  slbShare_pct: z.number().nullable().optional(),

  // Revenue contribution breakdown
  volumePortion_pct: z.number().nullable().optional(),
  pricePortion_pct: z.number().nullable().optional(),
});

export type YearRow = z.infer<typeof YearRow>;
export const Years = z.array(YearRow);
