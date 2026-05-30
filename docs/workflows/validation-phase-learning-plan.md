# Validation Phase Learning Plan

This plan guides the next stage of the harness + vibe coding study.

The project has completed the core reading and synthesis pass. The next learning
goal is to validate whether the documented methodology improves real agent work.

## Guiding Question

```text
Can an agent-readable project harness make AI-agent work more understandable,
recoverable, verifiable, and shareable in real project tasks?
```

## Phase 3A - Validation Framework Design

Goal: define what evidence counts before starting lab work.

Artifacts:

- `harness/runs/run-record-schema.md`
- `evals/rubrics/harness-validation-rubric.md`
- `experiments/task-samples/agent-first-project-tasks.md`
- `docs/evolution/0009-validation-framework-design.md`

Learning questions:

- What must a run record capture for another agent to understand the work?
- Which harness qualities can be judged mechanically?
- Which qualities require reviewer judgment?
- What small tasks can reveal whether the project harness works?

Exit criteria:

- A run record schema exists.
- A validation rubric exists.
- A first task-sample set exists.
- Future lab work has a clear evidence contract.

## Phase 3B - First Lab Project

Goal: start a small real project under `lab/` and use the validation framework
while doing actual work.

Candidate lab project types:

- a tiny CLI utility
- a small documentation site
- a lightweight eval-runner prototype
- an agent workflow demo

Learning questions:

- Does the agent use the repository entrypoints correctly?
- Does the run record help task recovery?
- Do the local evals catch missed project obligations?
- Does `docs/evolution/` capture stage-level learning without becoming a
  changelog?

Exit criteria:

- `lab/README.md` names the concrete validation project.
- At least one lab task is completed.
- At least one run record is written.
- At least one experiment report captures what happened.

## Phase 3C - Pattern Extraction

Goal: extract reusable patterns only after the lab creates evidence.

Potential artifacts:

- `docs/patterns/agent-first-living-lab.md`
- `docs/workflows/stage-level-evolution.md`
- reusable Template + Skill + Playbook design notes

Learning questions:

- Which parts of the methodology survived contact with real work?
- Which docs were useful to agents?
- Which docs were ignored or redundant?
- What should become a reusable project template?
- What should become a public skill?

Exit criteria:

- At least one validated pattern exists.
- Reusable extraction has evidence from lab work.
- The project can decide whether to build a template, a skill, or both.

## Operating Rules

- Prefer evidence over intuition.
- Do not introduce broad runtime dependencies before local evals and run records
  are clear.
- Keep lab scope intentionally small.
- Treat every stage-level outcome as an evolution-log candidate.
- Update entry documents when project phase changes.

