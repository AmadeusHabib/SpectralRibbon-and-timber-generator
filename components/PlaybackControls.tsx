"use client";

import { useRef, useState } from "react";
import type { RibbonResult } from "@/types/spectral";

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type ActiveNode = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

export function PlaybackControls({ result }: { result: RibbonResult }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<ActiveNode[]>([]);
  const stopTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function stop() {
    const context = audioContextRef.current;
    const now = context?.currentTime ?? 0;

    activeNodesRef.current.forEach(({ oscillator, gain }) => {
      try {
        if (context) {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setTargetAtTime(0.0001, now, 0.03);
        }
        oscillator.stop(now + 0.12);
      } catch {
        // Oscillators may already have ended.
      }
    });

    activeNodesRef.current = [];

    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    setIsPlaying(false);
  }

  async function play() {
    stop();

    const AudioContextConstructor =
      window.AudioContext || (window as AudioContextWindow).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    await context.resume();

    const master = context.createGain();
    master.gain.value = 0.12;
    master.connect(context.destination);

    const now = context.currentTime + 0.08;
    const nodes: ActiveNode[] = [];

    result.partials.forEach((partial) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + partial.timeStart;
      const end = now + partial.timeEnd;
      const safeAmplitude = Math.min(0.08, partial.amplitude * 0.12);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(partial.frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(safeAmplitude, start + 0.18);
      gain.gain.setValueAtTime(safeAmplitude, Math.max(start + 0.2, end - 0.25));
      gain.gain.linearRampToValueAtTime(0.0001, end);

      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(start);
      oscillator.stop(end + 0.02);
      nodes.push({ oscillator, gain });
    });

    activeNodesRef.current = nodes;
    setIsPlaying(true);
    stopTimerRef.current = window.setTimeout(() => {
      activeNodesRef.current = [];
      setIsPlaying(false);
      stopTimerRef.current = null;
    }, (result.duration + 0.5) * 1000);
  }

  return (
    <section className="panel min-w-0 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white">Playback Controls</h2>
      <p className="mt-1 text-sm leading-6 text-[#9aa8a9]">
        Playback is a simplified sine-tone mockup, not an orchestral simulation.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="rounded-md bg-[#69d2c4] px-4 py-2 text-sm font-semibold text-[#06100f] transition hover:bg-[#82e1d5] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPlaying}
          onClick={play}
          type="button"
        >
          Play
        </button>
        <button
          className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!isPlaying}
          onClick={stop}
          type="button"
        >
          Stop
        </button>
      </div>
    </section>
  );
}
