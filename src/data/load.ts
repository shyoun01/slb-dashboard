import { Years, YearRow } from "./slb.schema";
import { years, num, quarterValues, type YearRec } from "./airtable";

/**
 * Builds the annual rows the charts use from the Airtable snapshot.
 * Totals, influence, revenue, ROI, cumulative ROI and market share are
 * calculated in Airtable; nothing is derived here.
 */
function toYearRow(y: YearRec): YearRow {
  const year = y.Year;
  const inYear = num(y, "In-Year Lumber (MM BF)");
  const total = num(y, "Demand Generated (MM BF)");
  const influence = num(y, "Influence (MM BF)");
  const [q1, q2, q3, q4] = quarterValues(year, "Demand Generated (MM BF)");
  const [iq1, iq2, iq3, iq4] = quarterValues(year, "In-Year Lumber (MM BF)");

  return {
    year,
    incrementalRevenueMM: num(y, "Incremental Revenue ($MM)"),
    spendMM: num(y, "SLB Investment ($MM)"),
    roiPerDollar: num(y, "ROI per $1"),
    cumulativeRoiPerDollar: num(y, "Cumulative ROI per $1"),
    incBF_MM: inYear,
    // Legacy years (2012–15) have no in-year/tail split: Demand Generated = In-Year, no tail
    tailBF_MM: influence === 0 && inYear === total ? null : influence,
    totalBF_MM: total,
    avgPricePerThousandBF: num(y, "Avg Lumber Price ($/MBF)"),
    q1BF_MM: q1,
    q2BF_MM: q2,
    q3BF_MM: q3,
    q4BF_MM: q4,
    inYear_q1BF_MM: iq1,
    inYear_q2BF_MM: iq2,
    inYear_q3BF_MM: iq3,
    inYear_q4BF_MM: iq4,
    projects: num(y, "Projects"),
    slbShare_pct: num(y, "SLB Market Share"),
    volumePortion_pct: num(y, "Volume Portion"),
    pricePortion_pct: num(y, "Price Portion"),
    mfStarts_k: num(y, "Macro: MF Starts (k)"),
    mfPermits_k: num(y, "Macro: MF Permits (k)"),
    abiAvg: num(y, "Macro: ABI Avg"),
    nahbHmi: num(y, "Macro: NAHB HMI"),
    constructionSpendingGrowth_pct: num(y, "Macro: Construction Spending Growth (%)"),
    mortgage30yr_pct: num(y, "Macro: 30-yr Mortgage (%)"),
    treasury10yr_pct: num(y, "Macro: 10-yr Treasury (%)"),
    fedFunds_pct: num(y, "Macro: Fed Funds (%)"),
    lumberPrice_usdPerMbf: num(y, "Macro: Market Lumber Price ($/MBF)"),
    bankLendingTighteningIndex_pct: num(y, "Macro: Bank Lending Tightening (%)"),
  };
}

/** Load and validate the year rows; returns a year-sorted array */
export function loadYears(): YearRow[] {
  const parsed = Years.safeParse(years.map(toYearRow));
  if (!parsed.success) {
    // If validation fails, log the error and return empty to avoid crashing the page
    console.error("SLB data failed validation:", parsed.error?.format?.() ?? parsed.error);
    return [];
  }
  return parsed.data.sort((a, b) => a.year - b.year);
}
