import raw from "@/data/slb.json";
import { Years, YearRow } from "./slb.schema";

/**
 * When both totalBF_MM and avgPricePerThousandBF are present, compute
 * incrementalRevenueMM = (totalBF_MM * avgPricePerThousandBF) / 1000
 */
function deriveIncrementalRevenueMM(rows: YearRow[]): YearRow[] {
  return rows.map((row) => {
    const total = row.totalBF_MM;
    const price = row.avgPricePerThousandBF;
    if (total != null && price != null) {
      return { ...row, incrementalRevenueMM: Math.round((total * price) / 1000) };
    }
    return row;
  });
}

/** Load and validate the year rows; returns a year-sorted array */
export function loadYears(): YearRow[] {
  const parsed = Years.safeParse(raw);
  if (!parsed.success) {
    // If validation fails, log the error and return empty to avoid crashing the page
    console.error("SLB data failed validation:", parsed.error?.format?.() ?? parsed.error);
    return [];
  }
  const withDerivedRevenue = deriveIncrementalRevenueMM(parsed.data);
  // Sort ascending by year (2012 -> 2025)
  return withDerivedRevenue.sort((a, b) => a.year - b.year);
}
