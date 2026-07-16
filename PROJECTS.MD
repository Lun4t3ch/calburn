# Project

## Name

CalBurn

---

## Goal

An app that estimates how many calories a person burns per day, week and other periods, based on the best and most commonly used scientific research, and also covers macros in detail. Detailed planning will be done before implementation begins.

---

## Status

MVP

Possible values

- Planning
- Prototype
- MVP
- Active Development
- Beta
- Production
- Maintenance

---

## Tech Stack

Language: TypeScript

Framework: React 18 + Vite 6 (client-only SPA, PWA via vite-plugin-pwa)

Backend: None (all calculations in-browser)

Database: None (localStorage persistence)

Hosting: Local dev only for now (static hosting later)

Authentication: None

AI: None

---

## Platforms

- Mobile browser (phone) and desktop browser — responsive; installable as a PWA.

---

## Current Priorities

- v1 (calculator/planner) complete. Next: real-device testing on a phone and
  deciding on hosting (GitHub Pages / Netlify / Vercel — all free for static).

---

## Future Ideas

- Weight/calorie logging over time (actual vs projected) — v1 is calculator-only.
- Real food database/API for the food examples (currently a curated list).
- Multi-language support (i18n structure is ready; English only for now).
- Body-fat % visual estimation guide.

---

## Architecture Decisions

- **Client-only SPA, no backend.** All calculations run in-browser; state persists
  in localStorage. Keeps it private, free to host, and offline-capable.
- **Pure domain engine** (`src/domain/`) separated from React so the science is
  fully unit-testable against sourced reference values.
- **Adaptive weight projection** (TDEE recomputed at each projected weight) instead
  of the flat 7700 kcal/kg rule, which overpredicts long-term change.
- **Honest uncertainty**: every headline number ships with a ±band.
- **Validated chart palette** (dataviz skill) for light and dark surfaces.

---

## Coding Conventions

- TypeScript strict, small reusable functions, readable over clever.
- Domain logic pure and tested; UI renders engine output reactively (no submit button).

---

## Known Limitations

- Estimates carry ±10–20% individual error (inherent to BMR prediction).
- Activity/NEAT is self-reported, the biggest source of error.
- Not for pregnancy, under-18s, or medical conditions — educational tool only.

---

## Outstanding Questions

- Hosting target and public name (working title = CalBurn).

---

## Recent Progress

- 2026-07-16: Phase 1 complete — Vite + React + TS scaffold with PWA, ESLint, Vitest; build/lint/test/dev all verified.
- 2026-07-16: Phases 2–8 complete — full domain engine (49 tests), easy/advanced
  input flow, results breakdown, goal planner with adaptive projection & food
  examples, 23 fact-checked insight tips, dark mode, disclaimers, PWA polish.
  56 tests passing (incl. an app render smoke test); build & lint clean. **v1 done.**