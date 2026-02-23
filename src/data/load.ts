import raw from "@/data/slb.json";
import { Years, YearRow } from "./slb.schema";

const YEARS_WITH_CALCULATED_TOTAL_BF = [2023, 2024, 2025] as const;

/**
 * For 2023, 2024, 2025: totalBF_MM = incBF_MM (Direct) + tailBF_MM (Tail).
 * Uses existing fields: incBF_MM = Incremental Lumber, Direct; tailBF_MM = Incremental Lumber, Tail.
 */
function deriveTotalBF_MM(rows: YearRow[]): YearRow[] {
  return rows.map((row) => {
    if (!YEARS_WITH_CALCULATED_TOTAL_BF.includes(row.year as (typeof YEARS_WITH_CALCULATED_TOTAL_BF)[number])) {
      return row;
    }
    const direct = row.incBF_MM;
    const tail = row.tailBF_MM;
    if (direct != null && tail != null) {
      return { ...row, totalBF_MM: direct + tail };
    }
    return row;
  });
}

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

/**
 * When totalBF_MM, avgPricePerThousandBF, and spendMM are present, compute
 * roiPerDollar = (totalBF_MM * avgPricePerThousandBF) / spendMM, then store as
 * (value / 1000) so the dashboard can show "$37.30 per $1".
 */
function deriveRoiPerDollar(rows: YearRow[]): YearRow[] {
  return rows.map((row) => {
    const total = row.totalBF_MM;
    const price = row.avgPricePerThousandBF;
    const spend = row.spendMM;
    if (total != null && price != null && spend != null && spend !== 0) {
      const raw = (total * price) / spend;
      const perDollar = Math.round((raw / 1000) * 100) / 100;
      return { ...row, roiPerDollar: perDollar };
    }
    return row;
  });
}

/**
 * For each year, cumulative ROI = (sum of incrementalRevenueMM from start through that year)
 * / (sum of spendMM from start through that year). Matches the Cumulative ROI Summary card.
 * Rows must be sorted by year ascending.
 */
function deriveCumulativeRoiPerDollar(rows: YearRow[]): YearRow[] {
  let cumRevenue = 0;
  let cumSpend = 0;
  return rows.map((row) => {
    cumRevenue += row.incrementalRevenueMM ?? 0;
    cumSpend += row.spendMM ?? 0;
    const roi = cumSpend > 0 ? Math.round((cumRevenue / cumSpend) * 100) / 100 : null;
    return { ...row, cumulativeRoiPerDollar: roi };
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
  const withDerivedTotalBF = deriveTotalBF_MM(parsed.data);
  const withDerivedRevenue = deriveIncrementalRevenueMM(withDerivedTotalBF);
  const withDerivedRoi = deriveRoiPerDollar(withDerivedRevenue);
  const sorted = withDerivedRoi.sort((a, b) => a.year - b.year);
  const withCumulativeRoi = deriveCumulativeRoiPerDollar(sorted);
  return withCumulativeRoi;
}
