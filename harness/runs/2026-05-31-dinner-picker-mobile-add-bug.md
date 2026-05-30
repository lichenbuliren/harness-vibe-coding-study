# Dinner Picker Mobile Add Bug Run Record

## Summary

- Date: 2026-05-31
- Owner: Codex
- Phase: 3B - First Lab Project
- Outcome: completed

## Task

- Goal: diagnose and fix the reported issue that dishes could not be added from
  the user's phone.
- Starting context: Dinner Picker MVP had passed localhost browser automation,
  unit tests, build, lint, and a 390px mobile viewport smoke check.
- Constraints:
  - find root cause before fixing
  - add a failing test before implementation
  - preserve the harness learning in durable records
- Expected artifacts:
  - code fix
  - regression test
  - run record
  - experiment report
  - evolution entry
- Success criteria:
  - adding a dish works from the LAN HTTP URL
  - tests, build, and lint pass
  - project records explain the verification gap

## Harness Setup

- Entry documents:
  - `AGENTS.md`
  - `lab/AGENTS.md`
  - `harness/runs/run-record-schema.md`
  - `evals/rubrics/harness-validation-rubric.md`
- Skills:
  - systematic debugging
  - test-driven development
- Tools:
  - Vitest
  - Vite dev server
  - Playwright through local Chrome
- Runtime assumptions:
  - phone access uses the Vite network URL over plain HTTP
  - LAN HTTP origins are not secure browser contexts

## Method

1. Treated the user report as a real bug, not a user mistake.
2. Reproduced the path through the LAN URL `http://192.168.3.41:5173/`.
3. Captured browser evidence:
   - `window.isSecureContext === false`
   - `typeof crypto.randomUUID === "undefined"`
   - clicking "加进菜谱池" threw `crypto.randomUUID is not a function`
4. Added a failing unit test for dish creation when `crypto.randomUUID` is
   unavailable.
5. Implemented a minimal ID fallback.
6. Re-ran the LAN URL browser path and full verification.

## Trace Summary

- Root cause:
  - `createDish()` used `crypto.randomUUID()` directly.
  - This works on `localhost` / `127.0.0.1`, which browsers treat as secure
    contexts.
  - It fails on a phone-accessible LAN HTTP URL, where `crypto.randomUUID` is
    unavailable.
- Fix:
  - generate IDs with `crypto.randomUUID()` when available
  - fallback to a timestamp + random suffix when unavailable
- Regression test:
  - `creates a dish when crypto.randomUUID is unavailable`

## Artifacts

- `lab/dinner-picker/src/lib/dishes.ts`
- `lab/dinner-picker/src/lib/dishes.test.ts`
- `harness/runs/2026-05-31-dinner-picker-mobile-add-bug.md`
- `experiments/reports/2026-05-31-dinner-picker-mobile-add-bug.md`
- `docs/evolution/0012-mobile-lan-validation-gap.md`

## Verification

- Reproduced before fix:
  - LAN URL add failed
  - browser error: `crypto.randomUUID is not a function`
- Red test:
  - `npm test -- --run src/lib/dishes.test.ts`
  - result before fix: failed at `crypto.randomUUID is not a function`
- Targeted test after fix:
  - `npm test -- --run src/lib/dishes.test.ts`
  - result: passed, 6 tests
- Full test suite:
  - `npm test -- --run`
  - result: passed, 3 test files, 14 tests
- Build:
  - `npm run build`
  - result: passed
- Lint:
  - `npm run lint`
  - result: passed
- LAN URL browser check after fix:
  - `secure`: false
  - `hasRandomUUID`: false
  - `poolCountVisible`: true
  - `errors`: []
  - `bodyTextIncludesDish`: true
  - `noHorizontalOverflow`: true

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

The original MVP run should be considered incomplete for phone validation even
though its local automated checks passed.

## Learning

What worked:

- The user report exposed a verification-environment mismatch that automated
  localhost checks missed.
- Systematic debugging quickly isolated the browser security-context difference.
- TDD produced a small regression test before the fix.

What failed:

- The MVP verification claimed mobile readiness from a localhost mobile viewport
  check, but the user's phone path used a different origin and browser security
  model.

What should become a pattern:

- If the user is expected to test from a phone, verify the Vite network URL, not
  only `localhost` or `127.0.0.1`.
- Browser smoke checks should record `window.isSecureContext` when feature code
  depends on browser security-context APIs.

## Follow-Up

- Update lab verification rules to mention LAN/mobile URL checks.
- Consider adding an executable local eval for "user access path matches tested
  access path".

