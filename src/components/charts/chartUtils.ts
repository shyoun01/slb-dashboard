import type { CellProps } from "recharts";

export type CornerRadius = [number, number, number, number];

/** Recharts Cell radius accepts tuples at runtime; typings are narrower. */
export function cellRadius(r: CornerRadius): CellProps["radius"] {
  return r as unknown as CellProps["radius"];
}

export function topCellRadius(size = 6): CellProps["radius"] {
  return cellRadius([size, size, 0, 0]);
}

export function flatCellRadius(): CellProps["radius"] {
  return cellRadius([0, 0, 0, 0]);
}

export function conditionalTopCellRadius(
  active: boolean,
  size = 6
): CellProps["radius"] {
  return active ? topCellRadius(size) : flatCellRadius();
}
