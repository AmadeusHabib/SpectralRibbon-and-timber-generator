# Spectral Ribbon Lab

Spectral Ribbon Lab is a working MVP web app for sketching rule-based spectral-ribbon materials from a microtonal anchor pitch. It is designed as a transparent composition research prototype for timbre-based harmony, spectral ribbons, microtonal anchoring, and acoustic ensemble rehearsal tools.

The app does not use AI APIs, external services, a backend, authentication, or a database. All generation is deterministic, local, and client-side.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## What It Does

- Select an anchor note, octave, and A4 reference tuning.
- Choose ensemble, spectrum type, ribbon behaviour, duration, density, dynamic range, and notation style.
- Generate a spectral ribbon with partial frequencies, nearest pitches, cents deviations, amplitudes, time windows, roles, and suggested instruments.
- View the ribbon as an SVG timeline and as a partial table.
- Play a safe, simplified sine-tone mockup with the Web Audio API.
- Read generated composer descriptions and performer/rehearsal notes.
- Export the current sketch as JSON or TXT.

## Research Context

The prototype treats harmony as a time-evolving field of partials rather than a chord progression. A selected microtonal anchor remains perceptually central while generated upper, inner, inharmonic, formant, or noise-weighted components shape spectral brightness, density, and instrumental blend. The generated material is meant for sketching and rehearsal planning, not for automatic composition.
