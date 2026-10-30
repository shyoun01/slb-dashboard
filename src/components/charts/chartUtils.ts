import { createElement, type ReactElement } from "react";
import type { CellProps, LabelProps } from "recharts";

type Box = { x?: unknown; y?: unknown; width?: unknown; height?: unknown };

/**
 * LabelList `content` for a value centred inside a bar segment. Draws nothing when the
 * text would not fit inside the segment (thin slices), so labels never spill onto
 * neighbouring segments or totals.
 */
export function insideLabelIfFits(props: LabelProps): ReactElement | null {
  const box = ((props.viewBox as Box | undefined) ?? props) as Box;
  const [x, y, width, height] = [box.x, box.y, box.width, box.height].map(Number);
  if (![x, y, width, height].every(Number.isFinite)) return null;
  const format = props.formatter as ((value: unknown) => unknown) | undefined;
  const text = String((format ? format(props.value) : props.value) ?? "");
  if (!text) return null;
  const fontSize = Number(props.fontSize ?? 12);
  const fitsHeight = Math.abs(height) >= fontSize + 2;
  const fitsWidth = Math.abs(width) >= text.length * fontSize * 0.6 + 4;
  if (!fitsHeight || !fitsWidth) return null;
  return createElement(
    "text",
    {
      x: x + width / 2,
      y: y + height / 2,
      textAnchor: "middle",
      dominantBaseline: "central",
      fill: props.fill,
      fontSize,
      fontWeight: props.fontWeight,
    },
    text
  );
}

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
