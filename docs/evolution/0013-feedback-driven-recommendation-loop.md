# Feedback-Driven Recommendation Loop

## Stage

Phase 3B - First Lab Project.

The project is using `lab/dinner-picker` to validate whether harness engineering
practices help an AI agent move from user feedback to tested product behavior.

## Goal

Improve the random recommendation experience after mobile testing showed that
the app worked functionally but felt too abrupt and did not respond to user
preference.

The key product rule was clarified:

- after a dish is drawn, the user can mark `想吃` or `不想吃`
- `不想吃` automatically redraws another dish
- rejected dishes should have lower future weight

## Methodology

We treated the feedback as a harness validation opportunity, not as a small UI
patch.

The method was:

```text
subjective UX feedback -> explicit interaction contract -> deterministic helper
tests -> browser/mobile smoke check -> durable run record
```

Concretely:

1. Wrote a design spec before implementation.
2. Wrote a task-level implementation plan.
3. Implemented recommendation rules in testable helpers.
4. Added UI tests for feedback and automatic redraw.
5. Verified the flow with Browser MCP and a 390x844 Chrome viewport check.
6. Captured evidence in run and experiment records.

## Outcome

The Dinner Picker app now supports a feedback-driven draw loop:

- `想吃` records positive preference and keeps the result.
- `不想吃` records negative preference and automatically redraws when another
  candidate exists.
- Recommendation weight changes are bounded, so dishes are not permanently
  hidden.
- The draw flow includes a lightweight `重新抽签中` animation state.
- Mobile viewport verification confirmed thumb-sized controls and no horizontal
  overflow.

## Artifacts

- `docs/superpowers/specs/2026-05-31-dinner-picker-feedback-redraw-design.md`
- `docs/superpowers/plans/2026-05-31-dinner-picker-feedback-redraw.md`
- `harness/runs/2026-05-31-dinner-picker-feedback-redraw.md`
- `experiments/reports/2026-05-31-dinner-picker-feedback-redraw.md`
- `lab/dinner-picker/src/lib/dishes.ts`
- `lab/dinner-picker/src/App.tsx`
- `lab/dinner-picker/src/App.test.tsx`
- `lab/dinner-picker/src/lib/dishes.test.ts`

## Shareable Takeaway

Harness engineering should make subjective feedback executable.

The user should not be the first QA surface for every iteration. A useful agent
turns a complaint like "this feels too abrupt" into product rules, deterministic
tests, browser-observed behavior, and a durable record explaining what changed
and why.

## Open Questions

- Should future versions add a recent-picks cooldown window?
- Should the app explain why a dish was recommended once weights become more
  meaningful?
- Should mobile verification be promoted from smoke check to a reusable script
  once more lab workflows exist?
