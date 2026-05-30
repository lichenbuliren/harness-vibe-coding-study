# 0008 - Project Status Alignment

## Stage

Transition from harness engineering study to validation planning.

## Goal

Align the human-facing and agent-facing entry documents with the actual project
state after the core `walkinglabs/awesome-harness-engineering` learning pass.

## Method

We inspected the repository structure, recent commits, harness notes, and
evolution log to compare documented phase descriptions with the real state of
the project.

The inspection found that `README.md` still described project initialization,
and `CONTEXT.md` still emphasized only harness foundations, while the project
had already completed the core methodology modules.

## Decision

Update the project phase to:

```text
Core harness engineering study is complete.
The next phase is validation through local evals, run records, and lab work.
```

## Outcome

The project entrance now reflects the current stage:

- `README.md` describes the transition from core study to validation.
- `CONTEXT.md` lists current artifacts and recent methodology decisions.

## Artifacts

- `README.md`
- `CONTEXT.md`
- `docs/evolution/0008-project-status-alignment.md`

## Shareable Takeaway

Agent-readable projects need periodic status alignment. Once the real project
state moves faster than the entry documents, future agents will start from stale
assumptions even if the detailed artifacts are correct.

## Open Questions

- What should be the first executable local eval?
- What run-record schema should `harness/runs/` adopt?
- What real validation project should start under `lab/`?
