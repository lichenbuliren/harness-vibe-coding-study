# Mobile Interaction Performance Checklist

Use this checklist for mobile-first lab UI work.

## Required Checks

- State updates should be scoped to the smallest component that owns the
  interaction.
- Typing into an input should not rerender unrelated expensive UI regions such
  as result cards, lists, or decorative panels.
- Expensive visual effects should be limited on surfaces that update frequently.
- Mobile verification should include the same network URL the user will test.
- When judging smoothness, prefer production preview over dev server when
  possible.
- Record whether the observed experience came from dev server or production
  preview.

## Dinner Picker Example

The Dinner Picker add form keeps `dishName` and `selectedTag` inside the form
component. This prevents every keystroke from rerendering the draw card and dish
pool.

The app also uses memoized panels for:

- draw result
- add form
- dish pool

## Suggested Evidence

- interaction smoke test on mobile viewport
- LAN URL check when phone testing is expected
- production preview URL when available
- coarse input responsiveness samples
- final user-facing caveat if physical phone testing was not performed

