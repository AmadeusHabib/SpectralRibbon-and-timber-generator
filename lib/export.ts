import type { RibbonResult } from "@/types/spectral";
import { centsLabel } from "@/lib/pitch";

function downloadFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(result: RibbonResult): void {
  downloadFile(
    `${result.id}.json`,
    JSON.stringify(result, null, 2),
    "application/json;charset=utf-8",
  );
}

export function resultToTXT(result: RibbonResult): string {
  const parameters = [
    `Anchor: ${result.anchorPitch} (${result.anchorFrequency.toFixed(2)} Hz)`,
    `Duration: ${result.duration}s`,
    `Density: ${result.density}`,
    `Ensemble: ${result.ensemble}`,
    `Spectrum: ${result.spectrumType}`,
    `Behaviour: ${result.behaviour}`,
    `Dynamic range: ${result.dynamicRange}`,
    `Notation: ${result.notation}`,
  ].join("\n");

  const partialRows = result.partials
    .map(
      (partial) =>
        `${partial.index}. ${partial.role} | ${partial.frequency.toFixed(2)} Hz | ${
          partial.nearestPitch
        } ${centsLabel(partial.cents)} | amp ${partial.amplitude.toFixed(3)} | ${
          partial.timeStart
        }-${partial.timeEnd}s | ${partial.instrument}`,
    )
    .join("\n");

  const rehearsal = result.rehearsalNotes.map((note) => `- ${note}`).join("\n");

  return `Spectral Ribbon Lab

Parameters
${parameters}

Partial Table
${partialRows}

Composer Description
${result.composerDescription}

Performer / Rehearsal Notes
${rehearsal}
`;
}

export function exportTXT(result: RibbonResult): void {
  downloadFile(`${result.id}.txt`, resultToTXT(result), "text/plain;charset=utf-8");
}
