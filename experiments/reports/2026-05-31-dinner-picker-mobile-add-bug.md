# Dinner Picker Mobile Add Bug Experiment Report

## Task

Investigate the user's report that the Dinner Picker app could not add dishes
from a phone.

## Method

We used systematic debugging:

```text
Reproduce -> identify environment difference -> add failing test -> fix root cause -> verify real path
```

The key comparison was between the original automated smoke test URL and the
user's likely phone URL:

- original smoke test: `http://127.0.0.1:5173/`
- phone path: `http://192.168.3.41:5173/`

## Observation

The phone path is a non-secure HTTP origin. On that origin:

- `window.isSecureContext` is `false`
- `crypto.randomUUID` is unavailable
- `createDish()` threw before state could update

The original tests were real, but incomplete. They covered app behavior and
mobile layout; they did not cover the same origin/security context the user
would use from a phone.

## Evidence

Before fix:

- LAN URL add failed
- browser error: `crypto.randomUUID is not a function`

Regression test:

- added `creates a dish when crypto.randomUUID is unavailable`
- watched it fail before implementation

After fix:

- `npm test -- --run`: passed, 14 tests
- `npm run build`: passed
- `npm run lint`: passed
- LAN URL browser check:
  - `secure`: false
  - `hasRandomUUID`: false
  - `poolCountVisible`: true
  - no browser errors

## Outcome

Fixed.

Dish IDs now use `crypto.randomUUID()` when available and a timestamp/random
fallback when the app runs in a non-secure context.

## Harness Lesson

This is a useful failure for the harness project.

The issue was not lack of tests. It was a mismatch between the tested path and
the user's real validation path. A mobile viewport on localhost is not the same
as a phone using a LAN HTTP URL.

Future UI lab tasks should explicitly record:

- tested URL
- whether the tested origin is secure
- whether the user-facing access path was tested

## Follow-Up

- Update lab verification rules.
- Treat phone/LAN verification as a separate check when the user will validate
  on a phone.
- Consider a future local eval for access-path parity.

