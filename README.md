# CalBurn 🔥

Understand how many calories you burn — and plan your weight goals — with
honest, science-based estimates.

## Goal

Help anyone (including people with little nutrition knowledge) get a best-possible
scientific estimate of how many calories they burn per day/week/month, and see how
that burn splits across **BMR, NEAT, TEF and exercise (EAT)**. Then plan weight
loss or gain from a chosen goal, with a realistic, adaptive projection.

## Features

- **Easy & advanced modes** in one flow — advanced adds body-fat % (Katch-McArdle),
  macros (precise TEF), daily steps, and an exact exercise-calorie override.
- **Interactive burn breakdown** — a stacked bar plus tappable cards explaining
  BMR / NEAT / TEF / exercise in plain language.
- **Honest ranges** — every number carries a ±uncertainty band, not false precision.
- **Goal planner** — 7 goals (aggressive loss → significant gain) with safe-rate
  guards and calorie floors, a three-number readout (burn now / eat this / pace),
  and an **adaptive weight-trajectory chart** that flattens realistically.
- **Macro targets** and **best-case vs worst-case food examples** for your target.
- **Contextual insights** — 23 fact-checked "did you know?" tips, individually
  dismissable and globally toggleable.
- **Metric & imperial**, **dark mode**, **PWA** (installable, works offline),
  and **100% private** (all math in-browser, nothing sent anywhere).

## Tech Stack

- React 18 + Vite 6 + TypeScript (client-only SPA)
- Zustand (localStorage-persisted state)
- vite-plugin-pwa
- Vitest + Testing Library

## Scripts

```bash
npm install       # install dependencies
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check + production build
npm test          # run the test suite
npm run lint      # lint
```

## Project structure

- `src/domain/` — the pure, framework-free calculation engine (fully unit-tested)
- `src/data/` — curated datasets (MET values, foods, insights)
- `src/state/` — Zustand store + persistence
- `src/ui/` — components and sections
- `tests/` — domain unit tests + an app render smoke test

## Scientific basis

Mifflin-St Jeor / Katch-McArdle (BMR), the Compendium of Physical Activities
(MET values), Westerterp (TEF), Levine (NEAT), and a dynamic weight model in the
spirit of Hall et al. / the NIH Body Weight Planner. Estimates are a best-possible
guess, **not exact science** or medical advice.
