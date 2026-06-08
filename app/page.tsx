"use client";

import { useMemo, useState } from "react";
import { ComposerView } from "@/components/ComposerView";
import { ExportPanel } from "@/components/ExportPanel";
import { Header } from "@/components/Header";
import { ParameterPanel } from "@/components/ParameterPanel";
import { PartialTable } from "@/components/PartialTable";
import { PlaybackControls } from "@/components/PlaybackControls";
import { RehearsalView } from "@/components/RehearsalView";
import { RibbonTimeline } from "@/components/RibbonTimeline";
import { generateRibbon } from "@/lib/generator";
import type { ParameterState } from "@/types/spectral";

const initialParams: ParameterState = {
  note: "A",
  octave: 3,
  a4: 440,
  ensemble: "String Quartet",
  spectrumType: "Harmonic",
  behaviour: "Expand",
  duration: 60,
  density: 6,
  dynamicRange: "ppp–mp",
  notation: "Cents",
};

export default function Home() {
  const [params, setParams] = useState<ParameterState>(initialParams);
  const [seed, setSeed] = useState(0);
  const result = useMemo(() => generateRibbon(params), [params, seed]);

  return (
    <main className="min-h-screen">
      <Header result={result} />
      <div className="mx-auto grid max-w-[1500px] gap-5 px-5 py-5 md:px-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-5 lg:self-start">
          <ParameterPanel
            params={params}
            onChange={setParams}
            onGenerate={() => setSeed((value) => value + 1)}
          />
        </aside>

        <div className="grid min-w-0 gap-5">
          <RibbonTimeline result={result} />
          <PartialTable result={result} />
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <PlaybackControls result={result} />
            <ExportPanel result={result} />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <ComposerView result={result} />
            <RehearsalView result={result} />
          </div>
        </div>
      </div>
    </main>
  );
}
