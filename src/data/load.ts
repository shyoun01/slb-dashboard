import raw from "@/data/slb.json";
import { Years, YearRow } from "./slb.schema";

/** Load and validate the year rows; returns a year-sorted array */
export function loadYears(): YearRow[] {
  const parsed = Years.safeParse(raw);
  if (!parsed.success) {
    // If validation fails, log the error and return empty to avoid crashing the page
    console.error("SLB data failed validation:", parsed.error?.format?.() ?? parsed.error);
    return [];
  }
  // Sort ascending by year (2012 -> 2024)
  return parsed.data.sort((a, b) => a.year - b.year);
}
