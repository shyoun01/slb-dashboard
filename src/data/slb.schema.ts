import { z } from "zod";

/** One row per calendar year */
export const YearRow = z.object({
  year: z.number().int(),
  incrementalRevenueMM: z.number(),    // $MM (e.g., 634)
  spendMM: z.number(),                 // $MM (e.g., 19.4)
  incBF_MM: z.number(),                // In-year incremental MM BF
  tailBF_MM: z.number(),               // 3-year tail MM BF
  totalBF_MM: z.number(),              // incBF_MM + tailBF_MM
  avgPrice_perMBF: z.number(),         // $ per M BF (e.g., 399)
  roiPerDollar: z.number(),            // $ benefit per $1 spent (yearly)
  cumulativeRoiPerDollar: z.number(),  // cumulative through this year
  slbShare_pct: z.number().optional(), // SLB share of industry volume (%)
  volumePortion_pct: z.number().optional(), // % of revenue driven by volume
  pricePortion_pct: z.number().optional(),  // % driven by price
});

export type YearRow = z.infer<typeof YearRow>;
export const Years = z.array(YearRow);
