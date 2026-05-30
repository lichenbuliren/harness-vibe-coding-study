# 0011 - First Lab Project Dinner Picker

## Stage

Phase 3B - First Lab Project.

## Goal

Start the first real validation project under `lab/` and use the phase 3A
evidence contract while doing real React application work.

The selected project is Dinner Picker: a mobile-first app that helps users
decide what to eat by drawing a random dish from a local dish pool.

## Method

We followed the validated sequence:

```text
Design -> Plan -> Implement -> Verify -> Record -> Evaluate -> Learn
```

The app was intentionally scoped as an MVP:

- React + TypeScript + Vite
- localStorage persistence
- mobile-first layout
- playful draw/lottery interaction
- no backend
- no login
- no complex recommendation algorithm

The run also tested our harness evidence flow:

- design spec
- implementation plan
- automated tests
- build and lint verification
- browser/mobile smoke test
- run record
- experiment report
- rubric score

## Decision

Use `lab/dinner-picker` as the first concrete validation surface.

This project is small enough to finish quickly, but real enough to exercise
state, UI, persistence, testing, mobile layout, and stage-level evidence capture.

## Outcome

The Dinner Picker MVP is implemented.

Users can:

- add dishes
- choose a simple tag
- delete dishes
- draw a random recommendation
- keep data through `localStorage`

The work produced the first full lab evidence package.

## Artifacts

- `lab/dinner-picker/`
- `lab/README.md`
- `docs/superpowers/specs/2026-05-30-dinner-picker-lab-design.md`
- `docs/superpowers/plans/2026-05-30-dinner-picker-lab-mvp.md`
- `harness/runs/2026-05-31-dinner-picker-mvp.md`
- `experiments/reports/2026-05-31-dinner-picker-mvp.md`

## Verification

- `npm test -- --run`: passed, 13 tests
- `npm run build`: passed
- `npm run lint`: passed
- mobile browser smoke check at 390x844: passed
- no horizontal overflow in mobile smoke check

## Shareable Takeaway

The first lab task validated why run records and visual checks matter.

Automated tests proved the app behavior, but the mobile browser check caught a
visual contrast issue in the recommendation card. That is a concrete example of
the harness feedback loop working: the trace of verification changed the
implementation before completion.

## Open Questions

- Should the next lab task add history and avoid immediate repeats?
- Should we first automate the local evals for directory, evolution, and
  verification checks?
- How much run-record detail is useful before it becomes too heavy?
