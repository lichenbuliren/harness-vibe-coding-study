# Dinner Picker Lab Design

## Purpose

`lab/dinner-picker` is the first real validation project for the harness + vibe
coding study. It tests whether the project harness can guide an agent through a
small but real React application task while preserving evidence through run
records, eval rubrics, experiment reports, and evolution logs.

## Product Goal

Build a mobile-first "what should I eat today?" app.

Users maintain a dish pool, then tap a prominent random-pick entrypoint to get a
today recommendation. The experience should feel like a lightweight draw or
lottery ritual rather than a management dashboard.

## MVP Scope

Included:

- Add a dish by name.
- Assign one simple tag to a dish.
- Show the dish pool.
- Delete dishes.
- Randomly pick one dish from the pool.
- Show an empty state when no dishes exist.
- Persist dishes and the latest pick in `localStorage`.
- Work well on mobile viewports.

Excluded:

- login
- backend
- image upload
- multi-user sharing
- nutrition data
- complex recommendation history
- avoid-repeat algorithm
- external component library installation beyond lightweight UI primitives and
  icons

## UX Direction

The first version uses a playful "draw a meal" interaction:

- warm, high-contrast visual style
- large thumb-friendly primary action
- clear pool count
- tag chips
- recommendation card with a small reveal animation
- compact controls that fit mobile screens

The app should feel useful, not gimmicky. The game-like element is the random
pick ritual, not a full game.

## Technical Direction

Stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react icons
- localStorage

Implementation approach:

- Keep domain logic separate from React components.
- Use small local UI primitives instead of a heavy component library.
- Persist data through a typed storage helper.
- Verify with unit tests for domain/storage behavior and a production build.
- Run the dev server with LAN access so the user can test on a phone.

## Lab Evidence Requirements

This first lab task must produce:

- updated `lab/README.md`
- a concrete React app under `lab/dinner-picker`
- one run record under `harness/runs/`
- one experiment report under `experiments/reports/`
- one evolution entry if the milestone completes
- a rubric score using `evals/rubrics/harness-validation-rubric.md`

