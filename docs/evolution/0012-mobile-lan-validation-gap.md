# 0012 - Mobile LAN Validation Gap

## Stage

Phase 3B - First Lab Project feedback loop.

## Goal

Respond to the user's discovery that the Dinner Picker app could not add dishes
from a phone and determine whether the harness process had a verification gap.

## Method

We used systematic debugging and TDD:

```text
Reproduce -> root cause -> failing test -> minimal fix -> real-path verification
```

The bug was reproduced through the Vite network URL rather than localhost.

## Decision

Treat the issue as a harness validation gap, not only an app bug.

The app had tests, build verification, lint verification, and a mobile viewport
smoke check. However, the smoke check used `127.0.0.1`, while the user tested
from a phone through a LAN HTTP URL. Those paths have different browser
security-context behavior.

## Outcome

The app bug was fixed.

Root cause:

- `createDish()` called `crypto.randomUUID()` directly.
- `crypto.randomUUID()` was available on localhost but unavailable on the LAN
  HTTP origin used by phone validation.

Fix:

- use `crypto.randomUUID()` when available
- fallback to a timestamp/random ID when unavailable

Regression:

- added a test for dish creation when `crypto.randomUUID` is unavailable

## Artifacts

- `lab/dinner-picker/src/lib/dishes.ts`
- `lab/dinner-picker/src/lib/dishes.test.ts`
- `harness/runs/2026-05-31-dinner-picker-mobile-add-bug.md`
- `experiments/reports/2026-05-31-dinner-picker-mobile-add-bug.md`

## Shareable Takeaway

Testing "mobile viewport" is not the same as testing "phone access path".

For local web apps, `localhost` and LAN IP URLs can differ in browser security
context. If the user will validate from a phone, the harness should test the
same network URL or explicitly state that real phone validation is still
untested.

This is exactly the kind of gap a harness project should surface.

## Open Questions

- Should all future lab UI tasks require LAN URL smoke checks when phone testing
  is expected?
- Should we add a checklist item for browser security-context APIs?
- Should access-path parity become one of the first executable local evals?
