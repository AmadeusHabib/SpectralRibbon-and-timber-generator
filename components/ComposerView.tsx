import type { RibbonResult } from "@/types/spectral";

export function ComposerView({ result }: { result: RibbonResult }) {
  return (
    <section className="panel min-w-0 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white">Composer View</h2>
      <p className="mt-3 text-sm leading-7 text-[#dce6e3]">{result.composerDescription}</p>
    </section>
  );
}
