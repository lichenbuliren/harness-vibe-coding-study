# Dinner Picker Feedback Redraw Experiment Report

## Summary

- Date: 2026-05-31
- Lab project: `lab/dinner-picker`
- Experiment type: product feedback loop + harness validation
- Result: successful

## Hypothesis

If the agent converts subjective UX feedback into explicit rules and tests, then
the app can improve interaction quality without relying on the user as the first
QA surface.

## Intervention

- Added bounded recommendation weights to dishes.
- Added `想吃` and `不想吃` feedback actions after a result is drawn.
- Made `不想吃` automatically trigger a redraw that excludes the rejected dish
  when alternatives exist.
- Added a lightweight `重新抽签中` animation state.
- Verified the flow with automated tests and browser checks.

## Results

- Recommendation helpers now cover weighted selection, exclusion, and feedback
  bounds.
- App tests cover result feedback actions, positive feedback, automatic redraw,
  and no-alternative rejection handling.
- Browser flow confirmed visible feedback controls and redraw behavior.
- 390x844 Chrome viewport confirmed thumb-sized buttons and no horizontal
  overflow.

## Evidence

- `npm test -- --run`: passed, 26 tests.
- `npm run build`: passed.
- `npm run lint`: passed.
- Browser MCP flow:
  - result changed after `不想吃`
  - feedback buttons visible before and after redraw
  - horizontal overflow false
- Mobile viewport flow:
  - viewport: 390 x 844
  - `牛肉面9853` -> `寿司9853`
  - `想吃` and `不想吃` buttons: 142 x 48
  - horizontal overflow false

## Harness Assessment

This experiment validates a concrete harness pattern:

1. User reports a subjective issue.
2. Agent asks for the missing product rule.
3. Agent writes an explicit spec and plan.
4. Agent implements deterministic logic tests before UI behavior.
5. Agent performs browser-based interaction verification.
6. Agent records the outcome for future sharing.

The important engineering improvement is not only the feature. It is that the
agent created a repeatable path from user feedback to verified behavior.

## Remaining Risks

- The weighted recommendation model is intentionally simple.
- Tests verify deterministic cases, not long-term preference distribution.
- Physical phone testing remains a useful final confidence layer, but it is no
  longer the first validation surface.
