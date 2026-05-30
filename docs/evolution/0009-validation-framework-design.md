# 0009 - Validation Framework Design

## Stage

Validation planning after the core harness engineering study.

## Goal

Turn the documented methodology into a first local validation framework before
starting lab implementation.

The immediate goal was to define:

- what the next learning phases are
- what evidence an agent run must preserve
- how harness quality should be judged
- which local task samples can test the methodology

## Method

We used the principle established in the Evals & Observability module:

```text
Task -> Run -> Trace -> Grade -> Diagnose -> Change -> Regression Gate
```

Instead of starting with a real lab project immediately, we first defined the
evidence contract that future lab work must satisfy.

## Decision

Adopt this next-stage sequence:

```text
Run Record -> Local Evals -> Lab Project -> Pattern Extraction
```

This keeps the lab from becoming an intuition-only exercise. Future lab work
should produce run records, rubric scores, task-sample results, and stage-level
learning.

## Outcome

The project now has a validation framework for the next learning stage:

- a validation-phase learning plan
- a run-record schema
- a harness-validation rubric
- local mini-eval task samples

## Artifacts

- `docs/workflows/validation-phase-learning-plan.md`
- `harness/runs/run-record-schema.md`
- `evals/rubrics/harness-validation-rubric.md`
- `experiments/task-samples/agent-first-project-tasks.md`

## Shareable Takeaway

Methodology becomes real only when it has an evidence contract.

Before asking whether a harness "works", define what a run must record, what a
reviewer will score, and which small tasks reveal failure modes. Then the lab
can test the methodology instead of merely using it.

## Open Questions

- Which lab project should be selected first?
- Should the first executable eval check directory contract, evolution logging,
  or verification-before-completion?
- Should run records start as manual Markdown or move quickly toward a schema
  that scripts can validate?
