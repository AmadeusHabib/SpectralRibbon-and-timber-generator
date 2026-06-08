const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteToMidi(note: string, octave: number): number {
  const noteIndex = NOTES.indexOf(note);
  if (noteIndex === -1) {
    throw new Error(`Unknown note name: ${note}`);
  }

  return (octave + 1) * 12 + noteIndex;
}

export function midiToFrequency(midi: number, a4: number): number {
  return a4 * 2 ** ((midi - 69) / 12);
}

export function frequencyToNearestPitch(
  freq: number,
  a4: number,
): { pitch: string; cents: number } {
  const exactMidi = 69 + 12 * Math.log2(freq / a4);
  const nearestMidi = Math.round(exactMidi);
  const cents = Math.round((exactMidi - nearestMidi) * 100);
  const note = NOTES[((nearestMidi % 12) + 12) % 12];
  const octave = Math.floor(nearestMidi / 12) - 1;

  return {
    pitch: `${note}${octave}`,
    cents,
  };
}

export function centsLabel(cents: number): string {
  if (cents > 0) return `+${cents}c`;
  if (cents < 0) return `${cents}c`;
  return "0c";
}

export function formatMicrotonalPitch(
  nearestPitch: string,
  cents: number,
  notation: "Cents" | "Quarter-tone approximation" | "Eighth-tone approximation",
): string {
  if (notation === "Cents") {
    return `${nearestPitch} ${centsLabel(cents)}`;
  }

  const step = notation === "Quarter-tone approximation" ? 50 : 25;
  const rounded = Math.round(cents / step) * step;
  const marker =
    notation === "Quarter-tone approximation" ? "quarter-tone" : "eighth-tone";

  return `${nearestPitch} ${centsLabel(rounded)} ${marker}`;
}
