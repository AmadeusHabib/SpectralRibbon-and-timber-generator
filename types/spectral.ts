export type EnsembleType =
  | "String Quartet"
  | "Small Ensemble"
  | "Winds + Strings"
  | "Medium Ensemble";

export type SpectrumType =
  | "Harmonic"
  | "Inharmonic Bell"
  | "Formant-Centred"
  | "Noise-Weighted";

export type RibbonBehaviour =
  | "Expand"
  | "Contract"
  | "Merge"
  | "Split"
  | "Drift Upward"
  | "Drift Downward"
  | "Dissolve";

export type DynamicRange = "ppp–pp" | "pp–p" | "p–mp" | "ppp–mp";

export type MicrotonalNotation =
  | "Cents"
  | "Quarter-tone approximation"
  | "Eighth-tone approximation";

export type PartialRole =
  | "anchor"
  | "inner partial"
  | "upper partial"
  | "noise/resonance";

export type Partial = {
  index: number;
  frequency: number;
  nearestPitch: string;
  cents: number;
  amplitude: number;
  timeStart: number;
  timeEnd: number;
  instrument: string;
  role: PartialRole;
};

export type RibbonResult = {
  id: string;
  anchorPitch: string;
  anchorFrequency: number;
  duration: number;
  density: number;
  ensemble: EnsembleType;
  spectrumType: SpectrumType;
  behaviour: RibbonBehaviour;
  dynamicRange: DynamicRange;
  notation: MicrotonalNotation;
  partials: Partial[];
  composerDescription: string;
  rehearsalNotes: string[];
};

export type ParameterState = {
  note: string;
  octave: number;
  a4: number;
  ensemble: EnsembleType;
  spectrumType: SpectrumType;
  behaviour: RibbonBehaviour;
  duration: number;
  density: number;
  dynamicRange: DynamicRange;
  notation: MicrotonalNotation;
};
