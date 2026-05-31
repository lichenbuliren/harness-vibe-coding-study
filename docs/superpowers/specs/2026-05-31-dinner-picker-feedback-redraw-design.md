# Dinner Picker Feedback Redraw Design

## Context

The Dinner Picker lab app is now functionally usable on mobile, but the random
recommendation still feels abrupt and does not learn from user feedback. After a
dish is selected, the user may decide it is not appealing today. The app should
let the user express that preference and turn it into the next recommendation
behavior.

This feature is part of Phase 3B validation: a real React + TypeScript lab
project is used to test whether harness engineering can convert subjective
mobile feedback into explicit product rules, regression tests, browser checks,
and durable run records.

## Goal

Add a feedback loop to the draw result:

- after a dish is drawn, show `想吃` and `不想吃` actions
- `想吃` confirms the result and slightly increases that dish's future weight
- `不想吃` lowers that dish's future weight and automatically redraws a
  different dish when another candidate exists
- the redraw process should feel smoother through a lightweight animation
- the implementation must remain mobile-friendly and testable

## Non-Goals

- Do not introduce recommendation backends, accounts, or cloud sync.
- Do not add a new animation library.
- Do not make disliked dishes disappear permanently.
- Do not implement a full meal history or nutrition model in this step.

## Product Rules

Each dish has a recommendation weight. Existing dishes without a weight are
treated as weight `1`.

When the user taps `想吃`:

- increment the dish's positive feedback count
- increase its recommendation weight by a small bounded amount
- keep the current result visible
- show an immediate visual confirmation

When the user taps `不想吃`:

- increment the dish's rejection count
- decrease its recommendation weight by a bounded amount
- immediately start an automatic redraw
- exclude the just-rejected dish from that automatic redraw when at least one
  other candidate exists
- if there is no other candidate, keep the current result and show a concise
  empty-alternative message

Weights must remain bounded so the system keeps learning without creating
permanent winners or permanently hidden dishes.

## Interaction Design

The draw panel keeps its current role as the primary surface.

Before a draw:

- show the existing empty guidance when there is no selected dish
- keep the draw button disabled while the pool is empty

During a draw:

- show a short rolling state for about 600-800ms
- use dish names from the current candidate pool as visual hints when available
- disable draw and feedback actions to avoid competing state updates

After a draw:

- show the selected dish name and tag
- show two feedback actions under the result:
  - `想吃`
  - `不想吃`
- keep the controls large enough for thumb use on mobile

Reduced-motion users should not receive a forced animation. The app may skip or
shorten the rolling state when `prefers-reduced-motion` is enabled.

## Data Model

Extend `Dish` with optional preference fields:

```ts
type Dish = {
  id: string
  name: string
  tag: DishTag
  createdAt: string
  weight?: number
  likedCount?: number
  rejectedCount?: number
}
```

The fields stay optional to preserve localStorage compatibility with existing
saved dishes. Helper functions should normalize missing values when calculating
or updating recommendation behavior.

## Recommendation Logic

Move recommendation rules into `src/lib/dishes.ts` so they can be tested without
rendering the UI.

Expected helper responsibilities:

- normalize a dish's effective weight
- choose a dish using weighted random selection
- choose a dish while excluding a dish id when alternatives exist
- apply positive feedback
- apply negative feedback

The UI should call these helpers rather than manipulating weight details inline.

## Error Handling And Edge Cases

- Empty pool: draw returns no result and keeps the existing empty state.
- One-dish pool: rejecting the only dish lowers its weight but cannot redraw a
  different result; show an explanatory message.
- Deleted current dish: clear the latest pick, preserving existing behavior.
- Legacy localStorage data: load successfully with default preference values.
- Rapid taps: disable draw and feedback actions during animation.

## Testing

Unit tests should cover:

- weighted random selection by injected random values
- excluding a rejected dish when alternatives exist
- keeping the only candidate when no alternative exists
- positive feedback increasing weight and count within bounds
- negative feedback decreasing weight and count within bounds
- legacy dish objects without preference fields remaining valid

App tests should cover:

- drawing a result reveals feedback actions
- tapping `想吃` records positive feedback and keeps the result
- tapping `不想吃` automatically redraws a different dish when possible
- feedback actions are disabled during the draw animation

Verification should include:

- `npm test -- --run`
- `npm run build`
- `npm run lint`
- a mobile viewport browser smoke check for the draw, like, reject, and redraw
  flow
- LAN URL availability check when the user is expected to test from a phone

## Harness Artifacts

This feature should produce or update:

- a run record under `harness/runs/`
- an experiment report under `experiments/reports/`
- a stage evolution note under `docs/evolution/` if the feature validates a
  reusable harness learning

The reusable learning to capture is:

```text
subjective UX feedback -> explicit interaction contract -> deterministic helper
tests -> browser/mobile smoke check -> run record
```

## Open Decisions Resolved

- `不想吃` automatically redraws.
- The automatic redraw excludes the rejected dish when another candidate exists.
- The feature uses bounded local weights, not permanent removal.
- Animation should stay lightweight and dependency-free.
