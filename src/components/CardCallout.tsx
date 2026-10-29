import React from "react";

/**
 * Short highlight shown under a dashboard card (one sentence, ideally good news).
 */
export default function CardCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <span className="mt-0.5 shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Highlight
      </span>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}
