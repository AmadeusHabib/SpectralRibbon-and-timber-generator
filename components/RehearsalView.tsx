import type { RibbonResult } from "@/types/spectral";

export function RehearsalView({ result }: { result: RibbonResult }) {
  return (
    <section className="panel min-w-0 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white">Performer / Rehearsal View</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#dce6e3]">
        {result.rehearsalNotes.map((note) => (
          <li className="flex gap-2" key={note}>
            <span className="mt-[0.55rem] h-1.5 w-1.5 flex-none rounded-full bg-[#e0b45d]" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
