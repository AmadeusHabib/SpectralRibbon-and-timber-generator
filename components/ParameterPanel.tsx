"use client";

import type { ReactNode } from "react";
import type {
  DynamicRange,
  EnsembleType,
  MicrotonalNotation,
  ParameterState,
  RibbonBehaviour,
  SpectrumType,
} from "@/types/spectral";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = [1, 2, 3, 4, 5, 6, 7];
const ENSEMBLES: EnsembleType[] = [
  "String Quartet",
  "Small Ensemble",
  "Winds + Strings",
  "Medium Ensemble",
];
const SPECTRA: SpectrumType[] = [
  "Harmonic",
  "Inharmonic Bell",
  "Formant-Centred",
  "Noise-Weighted",
];
const BEHAVIOURS: RibbonBehaviour[] = [
  "Expand",
  "Contract",
  "Merge",
  "Split",
  "Drift Upward",
  "Drift Downward",
  "Dissolve",
];
const DYNAMICS: DynamicRange[] = ["ppp–pp", "pp–p", "p–mp", "ppp–mp"];
const NOTATIONS: MicrotonalNotation[] = [
  "Cents",
  "Quarter-tone approximation",
  "Eighth-tone approximation",
];

type ParameterPanelProps = {
  params: ParameterState;
  onChange: (params: ParameterState) => void;
  onGenerate: () => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#7f908f]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <select
      className="control h-10 w-full rounded-md px-3 text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function ParameterPanel({ params, onChange, onGenerate }: ParameterPanelProps) {
  return (
    <section className="panel rounded-lg p-4">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Parameters</h2>
          <p className="mt-1 text-sm text-[#9aa8a9]">Define the anchor and ribbon rules.</p>
        </div>
        <button
          className="rounded-md bg-[#69d2c4] px-4 py-2 text-sm font-semibold text-[#06100f] transition hover:bg-[#82e1d5]"
          onClick={onGenerate}
          type="button"
        >
          Generate
        </button>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Anchor note">
            <Select
              value={params.note}
              options={NOTES}
              onChange={(note) => onChange({ ...params, note })}
            />
          </Field>
          <Field label="Octave">
            <Select
              value={String(params.octave)}
              options={OCTAVES.map(String)}
              onChange={(octave) => onChange({ ...params, octave: Number(octave) })}
            />
          </Field>
        </div>

        <Field label="Reference tuning">
          <input
            className="control h-10 w-full rounded-md px-3 text-sm"
            min={400}
            max={480}
            step={0.1}
            type="number"
            value={params.a4}
            onChange={(event) => onChange({ ...params, a4: Number(event.target.value) || 440 })}
          />
        </Field>

        <Field label="Ensemble">
          <Select
            value={params.ensemble}
            options={ENSEMBLES}
            onChange={(ensemble) => onChange({ ...params, ensemble })}
          />
        </Field>

        <Field label="Spectrum type">
          <Select
            value={params.spectrumType}
            options={SPECTRA}
            onChange={(spectrumType) => onChange({ ...params, spectrumType })}
          />
        </Field>

        <Field label="Ribbon behaviour">
          <Select
            value={params.behaviour}
            options={BEHAVIOURS}
            onChange={(behaviour) => onChange({ ...params, behaviour })}
          />
        </Field>

        <Field label={`Duration ${params.duration}s`}>
          <div className="grid grid-cols-[1fr_4.5rem] items-center gap-3">
            <input
              className="w-full accent-[#69d2c4]"
              min={10}
              max={90}
              step={1}
              type="range"
              value={params.duration}
              onChange={(event) => onChange({ ...params, duration: Number(event.target.value) })}
            />
            <input
              aria-label="Duration value"
              className="control h-9 w-full rounded-md px-2 text-center text-sm"
              min={10}
              max={90}
              step={1}
              type="number"
              value={params.duration}
              onChange={(event) =>
                onChange({
                  ...params,
                  duration: Math.min(90, Math.max(10, Number(event.target.value) || 10)),
                })
              }
            />
          </div>
        </Field>

        <Field label={`Density ${params.density}`}>
          <div className="grid grid-cols-[1fr_4.5rem] items-center gap-3">
            <input
              className="w-full accent-[#e0b45d]"
              min={1}
              max={10}
              step={1}
              type="range"
              value={params.density}
              onChange={(event) => onChange({ ...params, density: Number(event.target.value) })}
            />
            <input
              aria-label="Density value"
              className="control h-9 w-full rounded-md px-2 text-center text-sm"
              min={1}
              max={10}
              step={1}
              type="number"
              value={params.density}
              onChange={(event) =>
                onChange({
                  ...params,
                  density: Math.min(10, Math.max(1, Number(event.target.value) || 1)),
                })
              }
            />
          </div>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Field label="Dynamic range">
            <Select
              value={params.dynamicRange}
              options={DYNAMICS}
              onChange={(dynamicRange) => onChange({ ...params, dynamicRange })}
            />
          </Field>
          <Field label="Notation">
            <Select
              value={params.notation}
              options={NOTATIONS}
              onChange={(notation) => onChange({ ...params, notation })}
            />
          </Field>
        </div>
      </div>
    </section>
  );
}
