import type { EnsembleType } from "@/types/spectral";

export function mapFrequencyToInstrument(
  freq: number,
  ensemble: EnsembleType,
  role?: string,
): string {
  if (ensemble === "String Quartet") {
    if (freq < 180) return "Cello";
    if (freq < 420) return "Viola";
    if (freq < 980) return "Violin II";
    return "Violin I / natural harmonic";
  }

  if (ensemble === "Small Ensemble") {
    if (freq < 180) return "Cello / bass clarinet";
    if (freq < 520) return "Viola / clarinet";
    if (freq < 1500) return "Flute / violin";
    return "Flute harmonic / violin harmonic";
  }

  if (ensemble === "Winds + Strings") {
    if (role === "noise/resonance") return "Breath tone / sul ponticello";
    if (freq < 180) return "Bass clarinet / cello";
    if (freq < 620) return "Clarinet / viola";
    return "Flute / violin";
  }

  if (freq < 180) return "Cello / bassoon / trombone";
  if (freq < 680) return "Horn / viola / clarinet";
  if (freq < 1800) return "Flute / violin / oboe";
  return "Piccolo / violin harmonic";
}
