# Harness Field Validation Implementation Plan

**Goal:** Execute and validate a four-run bare-versus-harnessed coding-agent
pilot without confusing structural Readiness with task Effectiveness.

**Architecture:** Deterministic fixture definitions create four temporary Git
repositories. The current agent performs the tasks and writes one structured
run record. A zero-dependency validator checks predeclared metrics, digests,
condition balance, and evidence-level boundaries.

**Tech Stack:** Node.js ESM, Node built-ins, `node:test`, Git

---

## Task 1: Lock The Experiment Contract

**Files:**
- Create: `experiments/field-validation/README.md`
- Create: `experiments/field-validation/fixtures.mjs`
- Create: `experiments/field-validation/validate-results.mjs`
- Create: `tests/field-validation/contract.test.mjs`

- [x] Write RED tests for four balanced runs, deterministic fixture generation,
  starting-state expectations, allowed paths, and result schema.
- [x] Implement the two isomorphic task families and bare/harness conditions.
- [x] Implement the result validator with `observed` as the maximum conclusion.

## Task 2: Execute The Four Coding Tasks

**Files:**
- Create: `experiments/field-validation/runs/pilot-001.json`

- [x] Generate four clean temporary Git repositories.
- [x] Execute fresh bare, fresh harness, resume harness, and resume bare in the
  predeclared order.
- [x] Run declared verification, inspect Git scope, and record operation counts.
- [x] Store test-output and final-diff SHA-256 digests.

## Task 3: Evaluate Without Overclaiming

**Files:**
- Create: `docs/evolution/0010-harness-field-validation.md`
- Modify: `CONTEXT.md`
- Modify: `docs/learning-harness-summary.md`

- [x] Compare verified completion, correction loops, scope, coordination cost,
  and restart-state correctness.
- [x] Mark findings `observed`, document same-agent/order/task-size limitations,
  and refuse level 3.
- [x] Update stale product-status language and add only conclusions supported by
  this pilot.

## Task 4: Integrate And Complete The Roadmap

**Files:**
- Modify: `.harness/manifest.json`
- Modify: `init.sh`
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`
- Modify: `docs/index.md`
- Modify: `docs/evolution/index.md`

- [x] Add experiment contract and result validation to `./init.sh`.
- [x] Run all product and experiment tests plus startup verification.
- [x] Set `feat-012` done with structured evidence and no active feature.
- [x] Record the next research threshold rather than inventing more roadmap
  features.

## Final Verification

```bash
node --test packages/harness-core/test/*.test.mjs \
  tests/harness-doctor/*.test.mjs \
  tests/harness-creator/*.test.mjs \
  tests/harness-product/*.test.mjs \
  tests/field-validation/*.test.mjs
node experiments/field-validation/validate-results.mjs \
  experiments/field-validation/runs/pilot-001.json
./init.sh
git diff --check
```
