# Mobile UI State Feedback Checklist

Use this checklist for mobile-first lab UI changes.

## Required Checks

- Primary actions are visually distinct from secondary actions.
- Disabled actions look disabled and cannot be triggered.
- Actions become visually ready as soon as their required input is valid.
- The visual ready state is tied to explicit application state, not only hover
  or focus styles.
- Tests cover the state transition when practical.
- Browser verification uses the same access path the user will use when phone
  testing is expected.

## Dinner Picker Example

The Dinner Picker add-dish form uses:

- `canAddDish = dishName.trim().length > 0`
- `disabled={!canAddDish}`
- `data-ready={canAddDish}`
- primary button styling only when `canAddDish` is true

The regression test verifies:

- empty input keeps the add button disabled
- valid input enables the add button
- valid input sets `data-ready="true"`

