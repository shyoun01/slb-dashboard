import React from "react";

export function fmtSpendLabel(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}`;
}

export function SpendLineLabel({
  x,
  y,
  value,
}: {
  x?: number;
  y?: number;
  value?: number;
}) {
  if (typeof x !== "number" || typeof y !== "number" || value == null) {
    return null;
  }

  const text = fmtSpendLabel(Number(value));
  const boxWidth = 40;
  const boxHeight = 18;
  const gapAbovePoint = 10;

  return (
    <g>
      <rect
        x={x - boxWidth / 2}
        y={y - boxHeight - gapAbovePoint}
        width={boxWidth}
        height={boxHeight}
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth={1}
        rx={4}
        ry={4}
      />
      <text
        x={x}
        y={y - gapAbovePoint - boxHeight / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#EF7328"
        fontSize={11}
        fontWeight={600}
      >
        {text}
      </text>
    </g>
  );
}
