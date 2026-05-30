# Dinner Picker MVP Experiment Report

## Task

Build the first real lab project: a mobile-first React + TypeScript dinner
picker that lets users maintain a dish pool and draw a random recommendation.

## Method

This experiment followed the phase 3B plan:

```text
Run Record -> Local Evals -> Lab Project -> Pattern Extraction
```

The run used a design spec, implementation plan, automated tests, production
build, linting, and mobile browser verification. Evidence was recorded in a run
record and this report.

## Agent Setup

- Agent: Codex
- Project phase: 3B - First Lab Project
- Main instructions:
  - root `AGENTS.md`
  - `lab/AGENTS.md`
  - validation-phase learning plan
  - run-record schema
  - harness-validation rubric

## Conditions

- App location: `lab/dinner-picker`
- Stack: React, TypeScript, Vite, Tailwind CSS, Vitest, Testing Library,
  lucide-react
- Persistence: `localStorage`
- Verification viewport: 390x844 mobile viewport
- Dev server network URL observed: `http://192.168.3.41:5173/`

## Observations

The harness helped in three practical ways:

- It forced a design and plan before implementation.
- It required evidence beyond "the app works", including test, build, lint, and
  mobile viewport checks.
- It made stage-level learning explicit through run record, experiment report,
  and evolution entry.

The browser smoke test found a real UI issue: the draw card initially had poor
recommendation text contrast. This would not have been caught by unit tests.

## Evidence

- Tests: `npm test -- --run`
  - 3 test files passed
  - 13 tests passed
- Build: `npm run build`
  - TypeScript and Vite production build passed
- Lint: `npm run lint`
  - passed with no output
- Mobile browser smoke check:
  - add dish flow worked
  - random draw worked
  - no horizontal overflow at 390px width
- Run record:
  - `harness/runs/2026-05-31-dinner-picker-mvp.md`

## Outcome

Completed.

The first lab project now has a working MVP with:

- dish creation
- simple tags
- dish deletion
- random recommendation
- local persistence
- mobile-first UI
- tests and build verification

## Rubric Score

Rubric: `evals/rubrics/harness-validation-rubric.md`

Total: 14 / 14

Breakdown:

- Context Use: 2
- Task Framing: 2
- Execution Discipline: 2
- Verification: 2
- Recoverability: 2
- Evolution Capture: 2
- Safety and Constraints: 2

## Follow-Up Decisions

- Keep the current MVP intentionally small.
- Use the next lab task to test whether run records remain useful across
  incremental feature work.
- Good candidate next task: add "recently eaten" history and avoid immediate
  repeats.
- Alternative next task: implement the first executable local eval script.

