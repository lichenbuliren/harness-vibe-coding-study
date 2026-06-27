# Harness Field Validation Design

## Goal

Run a bounded coding-agent pilot that compares bare and harnessed repositories
for two task shapes:

- a small fresh-session implementation;
- resuming an interrupted implementation.

The experiment evaluates task Effectiveness separately from structural
Readiness. A negative or neutral result is valid.

## Hypotheses

### H1: Small fresh tasks

For a small, self-contained, single-session change, the harness may add fixed
orientation and state-recording cost without improving functional completion.

### H2: Interrupted work

For interrupted work, explicit feature state, progress, and verification paths
may reduce ambiguity about the active scope and completion gate, even if the
extra artifacts still increase raw file operations.

## Experiment Shape

The pilot uses four fresh local Git repositories:

| Task family | Bare condition | Harness condition |
| --- | --- | --- |
| Fresh normalization | `normalizeTags` | isomorphic `normalizeLabels` |
| Interrupted unit parser | `parseBytes` | isomorphic `parseDuration` |

Tasks are isomorphic within each family but use different names and units to
reduce direct patch copying. Conditions are counterbalanced: bare runs first
for the fresh family; harness runs first for the resume family.

Each repository contains executable Node tests. Harness conditions additionally
contain a short operating contract, project Context, canonical feature state,
progress, and `init.sh`.

The current Codex agent executes all four tasks directly. No child agent or
external agent is used. This keeps the run within current execution authority
but introduces known same-agent and sequential-order bias.

## Metrics

Each run records:

- functional verification result;
- whether the declared verifier ran;
- failed verification loops after the first implementation;
- scope violations outside allowed paths;
- orientation file reads;
- verification commands;
- state/evidence updates required by the condition;
- elapsed time as descriptive, not comparative, evidence;
- final Git diff digest and test-output digest.

The primary outcomes are:

1. verified completion;
2. correction loops;
3. scope preservation;
4. restart-state correctness.

Raw elapsed time and operation counts are secondary because this single-agent
pilot cannot control model latency, cache state, or sequential learning.

## Run Protocol

1. Generate all four repositories from fixed definitions.
2. Confirm every starting repository is clean and its expected starting tests
   pass or fail as declared.
3. For each run, read only the condition's documented entrypoints.
4. Implement only the stated behavior.
5. Run the declared verification.
6. Record scope diff, correction loops, and evidence updates.
7. Preserve machine-readable results with task and output digests.
8. Run an independent validator over result completeness and invariants.

The experiment stops after four verified runs. It does not rerun until a desired
result appears.

## Evidence Levels

This pilot can produce `observed` conclusions only.

It cannot justify:

- causal claims about harness benefit;
- generalized productivity claims;
- Readiness level 3;
- canonical Doctor rules;
- Creator template expansion.

Promotion to `validated` requires fresh-session repetitions with independent
agents, more realistic codebases, randomized or counterbalanced ordering, and
predeclared acceptance thresholds.

## Repository Artifacts

The durable surface stays small:

```text
experiments/field-validation/
  README.md
  fixtures.mjs
  validate-results.mjs
  runs/pilot-001.json
```

Generated task repositories remain temporary. The fixture definitions, run
record, digests, and validator are committed so the pilot is inspectable
without treating generated workspaces as product code.

## Decision Rule

- If both conditions complete with the same corrections and scope quality,
  do not claim general delivery improvement.
- If harnessed resume state is more explicit, record that as a continuity
  observation, not as lower recovery cost unless measured operations also
  improve.
- Preserve the smallest harness surface; add no new product rule from this
  pilot alone.
