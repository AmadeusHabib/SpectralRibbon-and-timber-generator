import type { RibbonResult } from "@/types/spectral";

const behaviourPhrases: Record<RibbonResult["behaviour"], string> = {
  Expand: "opens from a stable low anchor into progressively brighter upper partials",
  Contract: "begins as a dense resonance and narrows toward the anchor",
  Merge: "places two registral groups into gradual contact around the middle of the span",
  Split: "starts as a unified sonority before separating into independent time regions",
  "Drift Upward": "lets later material rise in register while the anchor remains the perceptual reference",
  "Drift Downward": "begins with higher resonance and gradually returns attention toward lower partials",
  Dissolve: "keeps the anchor present while surrounding partials fade before the end",
};

const spectrumPhrases: Record<RibbonResult["spectrumType"], string> = {
  Harmonic: "The pitch field is derived from integer harmonic relationships",
  "Inharmonic Bell": "The pitch field uses stretched bell-like ratios",
  "Formant-Centred": "The pitch field clusters around several formant regions",
  "Noise-Weighted": "The pitch field combines stable partials with fragile noise-resonance components",
};

export function generateComposerDescription(result: RibbonResult): string {
  const density =
    result.density <= 3
      ? "sparse"
      : result.density >= 8
        ? "high-density"
        : "moderately dense";

  return `This ribbon begins from the anchor ${result.anchorPitch} (${result.anchorFrequency.toFixed(
    2,
  )} Hz) and ${behaviourPhrases[result.behaviour]} over ${
    result.duration
  } seconds. ${spectrumPhrases[result.spectrumType]}, so the harmonic function is created through ${density} spectral spacing, register, blend, and timbral tension rather than chord progression. The ${result.ensemble.toLowerCase()} setting should keep the dynamic field within ${result.dynamicRange}, allowing microtonal anchoring to remain audible as the ribbon changes shape.`;
}

export function generateRehearsalNotes(result: RibbonResult): string[] {
  const notes = [
    "Tune the anchor alone before adding upper partials.",
    "Add inner partials one at a time and check beats against the anchor.",
    "Maintain senza vibrato for stable microtonal anchoring unless a line is marked as noise/resonance.",
    "Upper partials should enter below the dynamic level of the anchor.",
    "Record a short sustain and compare perceived blend before increasing density.",
  ];

  if (result.behaviour === "Dissolve") {
    notes.push("For dissolving ribbons, rehearse the fade without relaxing intonation.");
  }

  if (result.behaviour === "Expand") {
    notes.push("Let low partials settle first; upper entries should feel like gradual spectral illumination.");
  }

  if (result.behaviour === "Contract") {
    notes.push("Rehearse exits from the top down so the remaining sonority does not sag in pitch.");
  }

  if (result.behaviour === "Merge") {
    notes.push("Balance the two groups at the midpoint before rehearsing the full transition.");
  }

  if (result.behaviour === "Split") {
    notes.push("Begin with a shared attack, then separate time windows without changing the anchor reference.");
  }

  if (result.behaviour === "Drift Upward" || result.behaviour === "Drift Downward") {
    notes.push("Mark the registral drift carefully; the drift is a tuning process, not an expressive glissando.");
  }

  if (result.ensemble === "String Quartet") {
    notes.push("Use open-string or natural-harmonic references where possible, then shade stopped notes by cents.");
  }

  if (result.ensemble === "Winds + Strings") {
    notes.push("Match breath-tone and sul ponticello components by color before matching loudness.");
  }

  if (result.spectrumType === "Noise-Weighted") {
    notes.push("Keep noise/resonance components low and unstable while preserving the anchor's center.");
  }

  return notes;
}
