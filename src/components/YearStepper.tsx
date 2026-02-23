"use client";

export default function YearStepper({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (y: number) => void;
}) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={atMin}
        aria-label="Previous year"
        className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--slb-charcoal)] bg-white text-[var(--slb-charcoal)] transition hover:bg-[var(--slb-light)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
      >
        <span className="text-lg font-bold leading-none">‹</span>
      </button>
      <span
        className="min-w-[4rem] text-center text-xl font-bold text-[var(--slb-blue)]"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        aria-label="Next year"
        className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--slb-charcoal)] bg-white text-[var(--slb-charcoal)] transition hover:bg-[var(--slb-light)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
      >
        <span className="text-lg font-bold leading-none">›</span>
      </button>
    </div>
  );
}
