# Dinner Picker MVP Run Record

## Summary

- Date: 2026-05-31
- Owner: Codex
- Phase: 3B - First Lab Project
- Outcome: completed

## Task

- Goal: create the first real lab project, a mobile-first React + TypeScript app
  that helps users randomly choose what to eat from a local dish pool.
- Starting context: core harness methodology study and phase 3A validation
  framework were complete.
- Constraints:
  - keep the lab project small
  - use React + TypeScript
  - prioritize mobile friendliness
  - provide a playful draw/lottery feel
  - persist locally without a backend
  - update project evolution progress
- Expected artifacts:
  - `lab/dinner-picker`
  - design and implementation plan documents
  - run record
  - experiment report
  - evolution entry
- Success criteria:
  - users can add dishes, tag them, delete them, and draw a recommendation
  - data persists in `localStorage`
  - tests, lint, and build pass
  - mobile viewport check shows no horizontal overflow

## Harness Setup

- Entry documents:
  - `AGENTS.md`
  - `CONTEXT.md`
  - `lab/AGENTS.md`
  - `docs/workflows/validation-phase-learning-plan.md`
  - `harness/runs/run-record-schema.md`
  - `evals/rubrics/harness-validation-rubric.md`
- Instructions:
  - follow the lab's local rule to keep work small and observable
  - record stage-level progress in `docs/evolution/`
  - verify before completion
- Tools:
  - shell
  - npm / Vite
  - Vitest
  - ESLint
  - Playwright through the local Node runtime for mobile visual smoke testing
- Subagents: none
- Runtime assumptions:
  - local Vite dev server
  - browser verification at 390px mobile viewport
  - phone verification possible through the Vite network URL when on the same
    local network

## Method

1. Wrote a lab design spec and implementation plan before coding.
2. Scaffolded a Vite React + TypeScript project under `lab/dinner-picker`.
3. Added lightweight dependencies: Tailwind CSS, lucide-react, Vitest, jsdom,
   and Testing Library.
4. Implemented dish domain helpers, localStorage persistence, local UI
   primitives, and the app shell.
5. Added unit and app interaction tests.
6. Ran automated verification and browser-based mobile visual checks.
7. Fixed issues found by verification:
   - adjusted an app test that assumed a dish name appeared only once
   - changed Vite config typing to use `vitest/config`
   - fixed dark-card styling that made the recommendation hard to read
8. Recorded the lab evidence package.

## Trace Summary

- Files inspected:
  - `lab/AGENTS.md`
  - `lab/README.md`
  - validation plan and run-record schema
- Commands run:
  - `npm create vite@latest lab/dinner-picker -- --template react-ts`
  - `npm install`
  - dependency installs for Tailwind, Vitest, Testing Library, jsdom, and
    lucide-react
  - `npm test -- --run`
  - `npm run build`
  - `npm run lint`
  - `npm run dev -- --host 0.0.0.0`
- Browser checks:
  - opened `http://127.0.0.1:5173/`
  - used 390x844 mobile viewport
  - added two dishes
  - drew a recommendation
  - checked no horizontal overflow
  - captured screenshots during visual QA
- Failures or retries:
  - first test run had one app test failure because the recommended dish also
    appeared in the pool list
  - first build failed because Vite config used the wrong `defineConfig` type
  - first mobile screenshot revealed insufficient recommendation-card contrast

## Artifacts

- `docs/superpowers/specs/2026-05-30-dinner-picker-lab-design.md`
- `docs/superpowers/plans/2026-05-30-dinner-picker-lab-mvp.md`
- `lab/README.md`
- `lab/dinner-picker/`
- `harness/runs/2026-05-31-dinner-picker-mvp.md`
- `experiments/reports/2026-05-31-dinner-picker-mvp.md`
- `docs/evolution/0011-first-lab-project-dinner-picker.md`

## Verification

- `npm test -- --run`
  - result: passed
  - evidence: 3 test files passed, 13 tests passed
- `npm run build`
  - result: passed
  - evidence: TypeScript build and Vite production build completed
- `npm run lint`
  - result: passed
  - evidence: ESLint completed with no output
- mobile browser smoke check
  - result: passed
  - evidence: dish add/draw flow worked at 390x844 viewport
  - no horizontal overflow: `scrollWidth` 390, `clientWidth` 390
- Vite dev server
  - result: started
  - local URL: `http://localhost:5173/`
  - network URL observed: `http://192.168.3.41:5173/`

Known gaps:

- No real phone manual verification was performed in this run.
- No avoid-repeat recommendation logic exists in the MVP.
- No executable harness eval script was added yet.

## Evaluation

Rubric: `evals/rubrics/harness-validation-rubric.md`

- Context Use: 2
- Task Framing: 2
- Execution Discipline: 2
- Verification: 2
- Recoverability: 2
- Evolution Capture: 2
- Safety and Constraints: 2

Total: 14 / 14

Evidence:

- The task used root and lab instructions, plus phase 3A validation artifacts.
- Scope stayed inside the agreed MVP.
- Verification caught and fixed real issues.
- This run record, experiment report, and evolution entry preserve the work.
- No forbidden first-stage directories, backend, login, or broad runtime system
  were introduced.

## Learning

What worked:

- The run-record schema provided a useful checklist for what evidence to keep.
- Mobile visual verification caught a UI contrast issue that unit tests could
  not catch.
- Keeping domain and storage logic outside React made testing straightforward.

What failed or needed adjustment:

- The implementation plan assumed Tailwind initialization through the older CLI
  path, but the installed Tailwind version used the Vite plugin path.
- A test assertion was too specific about unique text and had to be made aware
  of the real UI structure.

What should become a pattern:

- For lab UI work, pair automated interaction tests with at least one mobile
  viewport visual smoke check.
- Run records should include failures fixed during the run, not only final
  success.

What should become an eval:

- "Verification catches visual/mobile issues before completion" can become a
  future local eval.

## Follow-Up

- Let the user open the app on a phone through the network URL when possible.
- Decide whether the next lab task should add history/avoid-repeat logic or
  executable local eval scripts.
- Consider converting the directory/evolution/verification mini-evals into
  scripts after one more lab task.

