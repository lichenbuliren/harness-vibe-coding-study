# Dinner Picker Add Button Feedback Run Record

## Summary

- Date: 2026-05-31
- Owner: Codex
- Phase: 3B - First Lab Project
- Outcome: completed

## Task

- Goal: improve the add-dish form so the submit button clearly highlights when a
  dish name has been entered.
- Starting context: user reported that after typing a dish name, the submit
  button did not visually communicate readiness.
- Constraints:
  - solve from an engineering perspective, not only by manual color tweaking
  - add test coverage for the state transition
  - preserve the reusable harness learning
- Expected artifacts:
  - UI state fix
  - app regression test
  - mobile UI state feedback checklist

## Harness Setup

- Entry documents:
  - `AGENTS.md`
  - `lab/AGENTS.md`
  - `evals/rubrics/harness-validation-rubric.md`
- Tools:
  - Vitest
  - Vite build
  - ESLint
  - Playwright LAN mobile check

## Method

1. Identified that the add button was always styled as a secondary action.
2. Added a failing app-level test for the disabled-to-ready transition.
3. Added explicit `canAddDish` state.
4. Connected the state to `disabled`, `data-ready`, and primary button styling.
5. Removed background-color transition from buttons so readiness is visually
   immediate.
6. Verified on the LAN mobile URL.

## Verification

- Targeted red test:
  - `npm test -- --run src/App.test.tsx`
  - initially failed because the add button was not disabled and had no
    `data-ready` state
- Targeted green test:
  - `npm test -- --run src/App.test.tsx`
  - passed, 5 app tests
- Full verification:
  - `npm test -- --run`: passed, 15 tests
  - `npm run build`: passed
  - `npm run lint`: passed
- LAN mobile browser check:
  - before input: disabled true, `data-ready=false`, white button
  - after input: disabled false, `data-ready=true`, red button, white text

## Learning

This UI issue can be solved as an engineering contract:

```text
valid input -> explicit ready state -> enabled action -> high-salience visual
```

The important part is not the specific color. The important part is that the UI
state is derived from application state, testable, and verified on the user's
real access path.

## Follow-Up

- Apply `evals/checklists/mobile-ui-state-feedback.md` to future mobile-first
  lab UI changes.

