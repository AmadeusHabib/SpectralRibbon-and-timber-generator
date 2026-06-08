import type { RibbonResult } from "@/types/spectral";

type RibbonTimelineProps = {
  result: RibbonResult;
};

function yFor(freq: number, min: number, max: number, height: number): number {
  const low = Math.log2(min);
  const high = Math.log2(max);
  const value = (Math.log2(freq) - low) / Math.max(0.0001, high - low);
  return height - 34 - value * (height - 68);
}

export function RibbonTimeline({ result }: RibbonTimelineProps) {
  const width = 920;
  const height = 340;
  const frequencies = result.partials.map((partial) => partial.frequency);
  const minFreq = Math.max(20, Math.min(...frequencies) * 0.78);
  const maxFreq = Math.max(...frequencies) * 1.18;
  const mid = result.duration / 2;
  const markers = [0, mid, result.duration];

  return (
    <section className="panel min-w-0 rounded-lg p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Spectral Ribbon Timeline</h2>
          <p className="mt-1 text-sm text-[#9aa8a9]">
            Time is horizontal; register is logarithmic vertical space.
          </p>
        </div>
        <div className="text-xs text-[#7f908f]">
          {result.spectrumType} / {result.behaviour}
        </div>
      </div>

      <div className="overflow-x-auto quiet-scrollbar">
        <svg
          className="min-w-[760px]"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          aria-label={`Spectral ribbon generated from ${result.anchorPitch}`}
        >
          <rect width={width} height={height} rx="8" fill="#090d12" />
          <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
            {markers.map((marker) => {
              const x = 44 + (marker / result.duration) * (width - 88);
              return (
                <line key={marker} x1={x} x2={x} y1="24" y2={height - 36} />
              );
            })}
          </g>
          <g fill="#7f908f" fontSize="12">
            {markers.map((marker) => {
              const x = 44 + (marker / result.duration) * (width - 88);
              return (
                <text key={marker} x={x} y={height - 14} textAnchor="middle">
                  {Math.round(marker)}s
                </text>
              );
            })}
          </g>
          <g>
            {result.partials.map((partial) => {
              const x1 = 44 + (partial.timeStart / result.duration) * (width - 88);
              const x2 = 44 + (partial.timeEnd / result.duration) * (width - 88);
              const y = yFor(partial.frequency, minFreq, maxFreq, height);
              const slope =
                result.behaviour === "Drift Upward"
                  ? -8
                  : result.behaviour === "Drift Downward"
                    ? 8
                    : partial.role === "noise/resonance"
                      ? partial.index % 2 === 0
                        ? 5
                        : -5
                      : 0;
              const isAnchor = partial.role === "anchor";
              const color =
                partial.role === "noise/resonance"
                  ? "#d7c27a"
                  : isAnchor
                    ? "#ffffff"
                    : partial.role === "upper partial"
                      ? "#69d2c4"
                      : "#86a7ff";

              return (
                <g key={partial.index}>
                  <line
                    x1={x1}
                    x2={x2}
                    y1={y}
                    y2={y + slope}
                    stroke={color}
                    strokeLinecap="round"
                    strokeWidth={isAnchor ? 6 : 2 + partial.amplitude * 13}
                    opacity={isAnchor ? 0.95 : 0.35 + partial.amplitude * 1.6}
                  />
                  {isAnchor || partial.index % 5 === 0 ? (
                    <text
                      x={Math.min(x2 + 8, width - 88)}
                      y={y - 7}
                      fill={isAnchor ? "#ffffff" : "#9aa8a9"}
                      fontSize="12"
                    >
                      {isAnchor ? "anchor" : `P${partial.index}`}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
          <g fill="#7f908f" fontSize="11">
            <text x="18" y="30">
              high
            </text>
            <text x="20" y={height - 44}>
              low
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
