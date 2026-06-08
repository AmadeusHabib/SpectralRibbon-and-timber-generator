import type { RibbonResult } from "@/types/spectral";

type HeaderProps = {
  result: RibbonResult;
};

export function Header({ result }: HeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-normal text-white md:text-4xl">
          Spectral Ribbon Lab
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#aab8b7]">
          Rule-based sketching for timbre-based harmony, microtonal anchoring,
          and acoustic ensemble rehearsal materials.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-[#c4cecc]">
        <div className="panel rounded-lg px-3 py-2">
          <div className="text-[#7f908f]">Anchor</div>
          <div className="mt-1 font-medium text-white">{result.anchorPitch}</div>
        </div>
        <div className="panel rounded-lg px-3 py-2">
          <div className="text-[#7f908f]">Partials</div>
          <div className="mt-1 font-medium text-white">{result.partials.length}</div>
        </div>
        <div className="panel rounded-lg px-3 py-2">
          <div className="text-[#7f908f]">Duration</div>
          <div className="mt-1 font-medium text-white">{result.duration}s</div>
        </div>
      </div>
    </header>
  );
}
