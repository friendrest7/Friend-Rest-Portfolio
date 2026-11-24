"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-5 text-sm text-fg transition-colors hover:border-fg-subtle"
    >
      <Printer size={15} aria-hidden="true" /> Print / Save as PDF
    </button>
  );
}
