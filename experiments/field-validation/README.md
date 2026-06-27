# Field Validation Pilot

This directory stores one bounded bare-versus-harnessed coding-agent pilot.

The pilot asks the current Codex agent to complete four small Node tasks:

1. fresh bare normalization;
2. fresh harnessed normalization;
3. interrupted harnessed unit parsing;
4. interrupted bare unit parsing.

`fixtures.mjs` deterministically generates clean temporary Git repositories.
`runs/pilot-001.json` records actions and outcomes.
`validate-results.mjs` rejects incomplete evidence, scope violations, condition
drift, or conclusions promoted beyond `observed`.

Run:

```bash
node --test tests/field-validation/*.test.mjs
node experiments/field-validation/validate-results.mjs \
  experiments/field-validation/runs/pilot-001.json
```

This is a same-agent synthetic pilot, not a productivity benchmark. It cannot
justify causal claims, canonical rules, or Readiness level 3.
