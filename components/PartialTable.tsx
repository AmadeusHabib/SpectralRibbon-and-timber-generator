import type { RibbonResult } from "@/types/spectral";
import { centsLabel, formatMicrotonalPitch } from "@/lib/pitch";

export function PartialTable({ result }: { result: RibbonResult }) {
  return (
    <section className="panel min-w-0 rounded-lg p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Partial Table</h2>
          <p className="mt-1 text-sm text-[#9aa8a9]">
            Frequencies, approximations, amplitudes, windows, and instrumental suggestions.
          </p>
        </div>
        <div className="text-xs text-[#7f908f]">{result.notation}</div>
      </div>
      <div className="overflow-x-auto quiet-scrollbar">
        <table className="w-full min-w-[820px] table-fixed border-collapse text-left text-[13px] sm:text-sm">
          <colgroup>
            <col className="w-[9%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[15%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-[#7f908f]">
              <th className="py-3 pr-3 font-medium">Partial #</th>
              <th className="py-3 pr-3 font-medium">Role</th>
              <th className="py-3 pr-3 font-medium">Frequency</th>
              <th className="py-3 pr-3 font-medium">Nearest Pitch</th>
              <th className="py-3 pr-3 font-medium">Cents</th>
              <th className="py-3 pr-3 font-medium">Amplitude</th>
              <th className="py-3 pr-3 font-medium">Time Window</th>
              <th className="py-3 font-medium">Instrument</th>
            </tr>
          </thead>
          <tbody>
            {result.partials.map((partial) => (
              <tr key={partial.index} className="border-b border-white/10 text-[#dce6e3]">
                <td className="py-3 pr-3 font-medium text-white">{partial.index}</td>
                <td className="py-3 pr-3 capitalize text-[#c4cecc]">{partial.role}</td>
                <td className="py-3 pr-3">{partial.frequency.toFixed(2)} Hz</td>
                <td className="py-3 pr-3">
                  {formatMicrotonalPitch(partial.nearestPitch, partial.cents, result.notation)}
                </td>
                <td className="py-3 pr-3">{centsLabel(partial.cents)}</td>
                <td className="py-3 pr-3">{partial.amplitude.toFixed(3)}</td>
                <td className="py-3 pr-3">
                  {partial.timeStart.toFixed(1)}-{partial.timeEnd.toFixed(1)}s
                </td>
                <td className="py-3 leading-5">{partial.instrument}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
