import type {
  EnsembleType,
  Partial,
  PartialRole,
  ParameterState,
  RibbonBehaviour,
  RibbonResult,
  SpectrumType,
} from "@/types/spectral";
import { frequencyToNearestPitch, midiToFrequency, noteToMidi } from "@/lib/pitch";
import { mapFrequencyToInstrument } from "@/lib/orchestration";
import { generateComposerDescription, generateRehearsalNotes } from "@/lib/textGeneration";

const BELL_RATIOS = [1, 2.01, 2.76, 3.92, 5.12, 6.78, 8.21, 10.5, 13.2, 15.6];

function partialCount(density: number): number {
  return Math.round(3 + ((density - 1) / 9) * 13);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

function deterministicOffset(index: number, spread: number): number {
  const pattern = [-0.18, 0.08, 0.23, -0.11, 0.15, -0.05, 0.19, -0.21];
  return pattern[index % pattern.length] * spread;
}

function buildRatio(index: number, spectrumType: SpectrumType): number {
  if (spectrumType === "Harmonic") {
    return index + 1;
  }

  if (spectrumType === "Inharmonic Bell") {
    const base = BELL_RATIOS[index % BELL_RATIOS.length];
    const octaveLift = Math.floor(index / BELL_RATIOS.length) * 4.7;
    return base + octaveLift;
  }

  if (spectrumType === "Formant-Centred") {
    const zones = [2, 3.5, 5.2];
    const zone = zones[index % zones.length];
    const cluster = Math.floor(index / zones.length) * 0.34;
    return zone + cluster + deterministicOffset(index, 0.6);
  }

  const stable = [1, 2, 3, 4.15];
  if (index < stable.length) return stable[index];
  return 5.2 + index * 0.92 + deterministicOffset(index, 1.2);
}

function roleFor(index: number, count: number, spectrumType: SpectrumType): PartialRole {
  if (index === 0) return "anchor";
  if (spectrumType === "Noise-Weighted" && index > Math.max(3, count * 0.45)) {
    return "noise/resonance";
  }
  if (index < count * 0.52) return "inner partial";
  return "upper partial";
}

function amplitudeFor(index: number, count: number, role: PartialRole, spectrumType: SpectrumType): number {
  if (role === "anchor") return 0.42;

  const contour = 0.29 - (index / Math.max(1, count - 1)) * 0.18;
  const spectralFactor = spectrumType === "Noise-Weighted" && role === "noise/resonance" ? 0.38 : 1;
  return round(clamp(contour * spectralFactor, 0.035, 0.28), 3);
}

function timeWindow(
  index: number,
  count: number,
  duration: number,
  behaviour: RibbonBehaviour,
): { timeStart: number; timeEnd: number } {
  const progress = count <= 1 ? 0 : index / (count - 1);
  const minSpan = Math.max(4, duration * 0.18);

  if (index === 0) {
    return { timeStart: 0, timeEnd: duration };
  }

  switch (behaviour) {
    case "Expand": {
      const start = duration * 0.72 * progress;
      return { timeStart: start, timeEnd: duration };
    }
    case "Contract": {
      const end = duration * (1 - 0.68 * progress);
      return { timeStart: 0, timeEnd: Math.max(minSpan, end) };
    }
    case "Drift Upward": {
      const start = duration * 0.66 * progress;
      return { timeStart: start, timeEnd: Math.min(duration, start + duration * 0.34 + minSpan * 0.3) };
    }
    case "Drift Downward": {
      const reverse = 1 - progress;
      const start = duration * 0.62 * progress;
      return { timeStart: start, timeEnd: Math.min(duration, start + duration * (0.22 + reverse * 0.34)) };
    }
    case "Dissolve": {
      const end = duration * (0.86 - progress * 0.42);
      return { timeStart: duration * 0.06 * progress, timeEnd: Math.max(minSpan, end) };
    }
    case "Merge": {
      const groupA = index % 2 === 0;
      const start = groupA ? duration * 0.05 * progress : duration * (0.42 - 0.22 * progress);
      const end = groupA ? duration * (0.62 + 0.22 * progress) : duration * (0.95 - 0.04 * progress);
      return { timeStart: clamp(start, 0, duration - 1), timeEnd: clamp(end, minSpan, duration) };
    }
    case "Split": {
      const start = duration * 0.03;
      const group = index % 3;
      const end = duration * (0.42 + group * 0.22 + progress * 0.08);
      return { timeStart: start, timeEnd: clamp(end, minSpan, duration) };
    }
  }
}

function orderIndex(index: number, count: number, behaviour: RibbonBehaviour): number {
  if (behaviour === "Drift Downward") return count - index - 1;
  return index;
}

export function generatePartials(
  anchorFreq: number,
  spectrumType: SpectrumType,
  density: number,
  duration: number,
  behaviour: RibbonBehaviour,
  ensemble: EnsembleType,
  a4 = 440,
): Partial[] {
  const count = partialCount(density);

  return Array.from({ length: count }, (_, sourceIndex) => {
    const index = orderIndex(sourceIndex, count, behaviour);
    const role = roleFor(index, count, spectrumType);
    const ratio = buildRatio(index, spectrumType);
    const driftFactor =
      behaviour === "Drift Upward"
        ? 1 + sourceIndex * 0.018
        : behaviour === "Drift Downward"
          ? 1 - sourceIndex * 0.012
          : 1;
    const frequency = anchorFreq * ratio * driftFactor;
    const nearest = frequencyToNearestPitch(frequency, a4);
    const amplitude = amplitudeFor(index, count, role, spectrumType);
    const window = timeWindow(sourceIndex, count, duration, behaviour);

    return {
      index: sourceIndex + 1,
      frequency: round(frequency, 2),
      nearestPitch: nearest.pitch,
      cents: nearest.cents,
      amplitude,
      timeStart: round(window.timeStart, 1),
      timeEnd: round(Math.max(window.timeStart + 1.5, window.timeEnd), 1),
      instrument: mapFrequencyToInstrument(frequency, ensemble, role),
      role,
    };
  }).sort((a, b) => a.index - b.index);
}

export function generateRibbon(params: ParameterState): RibbonResult {
  const midi = noteToMidi(params.note, params.octave);
  const anchorFrequency = midiToFrequency(midi, params.a4);
  const anchorPitch = `${params.note}${params.octave}`;
  const baseResult = {
    id: `ribbon-${Date.now().toString(36)}`,
    anchorPitch,
    anchorFrequency: round(anchorFrequency, 2),
    duration: params.duration,
    density: params.density,
    ensemble: params.ensemble,
    spectrumType: params.spectrumType,
    behaviour: params.behaviour,
    dynamicRange: params.dynamicRange,
    notation: params.notation,
    partials: generatePartials(
      anchorFrequency,
      params.spectrumType,
      params.density,
      params.duration,
      params.behaviour,
      params.ensemble,
      params.a4,
    ),
    composerDescription: "",
    rehearsalNotes: [],
  } satisfies RibbonResult;

  return {
    ...baseResult,
    composerDescription: generateComposerDescription(baseResult),
    rehearsalNotes: generateRehearsalNotes(baseResult),
  };
}
