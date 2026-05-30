# Dinner Picker Input Responsiveness Run Record

## Summary

- Date: 2026-05-31
- Owner: Codex
- Phase: 3B - First Lab Project
- Outcome: completed

## Task

- Goal: respond to the user's report that the app did not feel smooth enough.
- Starting context: the MVP prioritized correctness, mobile usability, and
  evidence capture; performance was not yet an explicit acceptance criterion.
- Expected artifacts:
  - input responsiveness improvement
  - reusable mobile performance checklist
  - verification evidence

## Harness Setup

- Entry documents:
  - `AGENTS.md`
  - `lab/AGENTS.md`
- Tools:
  - Vitest
  - Vite build and preview
  - ESLint
  - Playwright LAN mobile checks

## Method

1. Treated smoothness as a missing engineering acceptance criterion.
2. Identified that input state lived in the top-level `App` component.
3. Moved form-only state into `AddDishPanel`.
4. Memoized the draw panel, add panel, and dish pool.
5. Verified tests, build, lint, LAN mobile behavior, and production preview.

## Verification

- `npm test -- --run`: passed, 15 tests
- `npm run build`: passed
- `npm run lint`: passed
- LAN dev URL input responsiveness sample:
  - URL: `http://192.168.3.41:5173/`
  - sampled max input update: 53ms
  - no horizontal overflow
- LAN production preview sample:
  - URL: `http://192.168.3.41:4173/`
  - sampled max input update: 52ms
  - no horizontal overflow

Known gaps:

- The agent did not perform a physical phone manual test.
- Coarse Playwright timing is not a substitute for full browser performance
  profiling, but it is useful as a lightweight lab signal.

## Learning

The MVP harness did not originally make performance a first-class acceptance
criterion. That allowed a functionally correct app to still feel less smooth
than expected.

For mobile-first lab work, performance should be expressed as engineering
behavior:

```text
local interaction state -> small rerender scope -> production-preview check
```

## Follow-Up

- Use `evals/checklists/mobile-interaction-performance.md` for future mobile UI
  work.
- Consider adding a lightweight render-count or profiler-based check if the app
  grows.

