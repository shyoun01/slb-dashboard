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

  // Average price ($ per thousand BF); when present with totalBF_MM, incrementalRevenueMM is derived
  avgPricePerThousandBF: z.number().nullable().optional(),

  // Quarterly TOTAL lumber subtotals (when available)
  q1BF_MM: z.number().nullable().optional(),
  q2BF_MM: z.number().nullable().optional(),
  q3BF_MM: z.number().nullable().optional(),
  q4BF_MM: z.number().nullable().optional(),

  // ✅ In-Year quarterly subtotals (when available)
  inYear_q1BF_MM: z.number().nullable().optional(),
  inYear_q2BF_MM: z.number().nullable().optional(),
  inYear_q3BF_MM: z.number().nullable().optional(),
  inYear_q4BF_MM: z.number().nullable().optional(),

  // Projects converted (new series)
  projects: z.number().nullable().optional(),

  // Market share
  slbShare_pct: z.number().nullable().optional(),

  // Revenue contribution breakdown
  volumePortion_pct: z.number().nullable().optional(),
  pricePortion_pct: z.number().nullable().optional(),

  // Construction macro indicators (stored only; not yet visualized)
  mfStarts_k: z.number().nullable().optional(),
  mfPermits_k: z.number().nullable().optional(),
  abiAvg: z.number().nullable().optional(),
  nahbHmi: z.number().nullable().optional(),
  constructionSpendingGrowth_pct: z.number().nullable().optional(),
  mortgage30yr_pct: z.number().nullable().optional(),
  treasury10yr_pct: z.number().nullable().optional(),
  fedFunds_pct: z.number().nullable().optional(),
  lumberPrice_usdPerMbf: z.number().nullable().optional(),
  bankLendingTighteningIndex_pct: z.number().nullable().optional(),
});

export type YearRow = z.infer<typeof YearRow>;
export const Years = z.array(YearRow);
