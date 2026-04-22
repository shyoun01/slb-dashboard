import type { YearRow } from "./slb.schema";

const CSV_COLUMNS: (keyof YearRow)[] = [
  "year",
  "incrementalRevenueMM",
  "spendMM",
  "roiPerDollar",
  "cumulativeRoiPerDollar",
  "incBF_MM",
  "tailBF_MM",
  "totalBF_MM",
  "avgPricePerThousandBF",
  "q1BF_MM",
  "q2BF_MM",
  "q3BF_MM",
  "q4BF_MM",
  "inYear_q1BF_MM",
  "inYear_q2BF_MM",
  "inYear_q3BF_MM",
  "inYear_q4BF_MM",
  "projects",
  "slbShare_pct",
  "volumePortion_pct",
  "pricePortion_pct",
  "mfStarts_k",
  "mfPermits_k",
  "abiAvg",
  "nahbHmi",
  "constructionSpendingGrowth_pct",
  "mortgage30yr_pct",
  "treasury10yr_pct",
  "fedFunds_pct",
  "lumberPrice_usdPerMbf",
  "bankLendingTighteningIndex_pct",
];

const DESCRIPTION_ROW =
  "SLB ROI Analysis dashboard data: annual metrics by year (incremental revenue, expenditures, ROI, lumber volume, quarterly breakdown, projects converted, market share) plus construction macro indicators (MF starts/permits, ABI, NAHB HMI, construction spending growth, rates, lumber price, bank tightening).";

const CSV_UNITS: string[] = [
  "year",
  "MM USD",
  "MM USD",
  "$ per $1",
  "$ per $1",
  "MM BF",
  "MM BF",
  "MM BF",
  "USD per thousand BF",
  "MM BF",
  "MM BF",
  "MM BF",
  "MM BF",
  "MM BF",
  "MM BF",
  "MM BF",
  "MM BF",
  "count",
  "proportion (0-1)",
  "proportion (0-1)",
  "proportion (0-1)",
  "000s",
  "000s",
  "index",
  "index",
  "percent",
  "percent",
  "percent",
  "percent",
  "USD per mbf",
  "net percent",
];

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

/**
 * Builds a CSV string from YearRow[] with optional description and units rows, then header and data.
 * Uses empty string for null/undefined; numbers as-is (no quoting unless needed).
 */
export function buildCsv(rows: YearRow[]): string {
  const descriptionCell = escapeCsvCell(DESCRIPTION_ROW);
  const descriptionRest = Array(CSV_COLUMNS.length - 1).fill("").join(",");
  const descriptionLine = descriptionRest ? `${descriptionCell},${descriptionRest}` : descriptionCell;

  const unitsLine = CSV_UNITS.map((u) => escapeCsvCell(u)).join(",");

  const header = CSV_COLUMNS.join(",");
  const body = rows
    .map((row) =>
      CSV_COLUMNS.map((col) => {
        const v = row[col];
        if (typeof v === "number") return v;
        return escapeCsvCell(v);
      }).join(",")
    )
    .join("\r\n");

  return "\uFEFF" + descriptionLine + "\r\n" + unitsLine + "\r\n" + header + "\r\n" + body; // BOM for Excel UTF-8
}

/**
 * Triggers a browser download of the CSV with the given filename.
 */
export function downloadCsv(csv: string, filename: string = "slb-dashboard-data.csv") {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
