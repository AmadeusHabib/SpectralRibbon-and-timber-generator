"use client";

import type { RibbonResult } from "@/types/spectral";
import { exportJSON, exportTXT } from "@/lib/export";

export function ExportPanel({ result }: { result: RibbonResult }) {
  return (
    <section className="panel min-w-0 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white">Export Panel</h2>
      <p className="mt-1 text-sm leading-6 text-[#9aa8a9]">
        Export the current sketch as full structured data or a rehearsal-readable text file.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="rounded-md bg-[#e0b45d] px-4 py-2 text-sm font-semibold text-[#161004] transition hover:bg-[#efc978]"
          onClick={() => exportJSON(result)}
          type="button"
        >
          Export JSON
        </button>
        <button
          className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          onClick={() => exportTXT(result)}
          type="button"
        >
          Export TXT
        </button>
      </div>
    </section>
  );
}
