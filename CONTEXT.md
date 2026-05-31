# Project Context

## Intent

本项目探索 harness + vibe coding 的最佳实践，目标是让 AI agent 能够快速理解项目、
稳定执行任务、留下可验证证据，并把阶段性经验沉淀为可复用方法论。

This project explores harness + vibe coding best practices through an
Agent-First Living Lab structure.

## Current Phase

Harness engineering validation. The core learning pass over
`walkinglabs/awesome-harness-engineering` is complete for the main methodology
modules. The current focus is turning the documented methodology into local
validation loops: executable eval candidates, run-record conventions, and a real
project under `lab/`. The first lab project is `lab/dinner-picker`.

## Key Terms

- **Harness**: the surrounding system that frames, runs, observes, or evaluates
  AI-agent work.
- **Vibe coding**: collaborative AI-assisted development where intent,
  iteration, and rapid feedback shape implementation.
- **Agent-First Living Lab**: a repository structure that first helps agents
  understand and act, then validates those practices through a real project.
- **Lab**: the real validation project under `lab/`.
- **Evolution log**: narrative stage records under `docs/evolution/`.
- **Decision record**: concise ADR-style records under `decisions/`.

## Working Assumptions

- English directory names improve tool and agent interoperability.
- Core entry documents should be bilingual or bilingual-friendly.
- The first stage should initialize knowledge structure, not application code.
- A real validation project is necessary to test the methodology.

## Non-Goals

- Choose a product stack.
- Add application source code.
- Add infrastructure or deployment configuration.
- Add broad runtime dependencies before local evals and run records are clear.

## Knowledge Capture

This project captures two kinds of memory:

- `decisions/`: concise ADR-style decision records
- `docs/evolution/`: narrative stage records for methodology, outcomes, and
  shareable lessons

Agents should update `docs/evolution/` after stage-level progress, especially
when a new practice has been validated or rejected.

## Recent Decisions

- Adopt Agent-First Living Lab as the first repository structure.
- Use English directory names with bilingual-friendly entry documents.
- Separate `experiments/` from `evals/`.
- Use `lab/` as the real validation project container.
- Use `docs/evolution/` for stage-level sharing records.
- Treat `harness/` as the project-local methodology surface for harness
  engineering.
- Treat evals and observability as one feedback loop:
  `Task -> Run -> Trace -> Grade -> Diagnose -> Change -> Regression Gate`.
- Interpret benchmark scores as model-harness-environment measurements rather
  than pure model capability.
- Defer reusable Template + Skill + Playbook extraction until the learning
  project stabilizes through lab validation.
- Use `lab/dinner-picker` as the first real validation project for testing the
  harness methodology against React + TypeScript app work.
- Treat user-corrected agent mistakes as potential harness evidence; reusable
  process gaps should update the canonical project contract, not remain only in
  chat.

## Current Artifacts

- `harness/foundations.md`: foundation model for harness engineering.
- `harness/context-memory.md`: context, memory, compaction, and working-state
  policy.
- `harness/guardrails-safe-autonomy.md`: safe-autonomy boundaries and verifier
  gates.
- `harness/specs-agent-workflows.md`: spec lifecycle and workflow state model.
- `harness/agent-delivery-contract.md`: minimum delivery loop for testing,
  user-facing verification, commits, and durable evidence.
- `harness/evals-observability.md`: eval, trace, grader, and regression-gate
  practices.
- `harness/benchmarks.md`: benchmark taxonomy and interpretation rules.
- `harness/runtimes-reference-implementations.md`: framework/runtime/harness
  distinctions and adoption criteria.
- `docs/workflows/validation-phase-learning-plan.md`: staged plan for local
  evals, run records, lab validation, and pattern extraction.
- `harness/runs/run-record-schema.md`: required structure for durable run
  records.
- `evals/rubrics/harness-validation-rubric.md`: evidence-based scoring rubric
  for harness validation.
- `experiments/task-samples/agent-first-project-tasks.md`: local mini-eval task
  samples for testing harness behavior.
- `lab/dinner-picker/`: first real lab validation app.
- `harness/runs/2026-05-31-dinner-picker-mvp.md`: first lab run record.
- `harness/runs/2026-05-31-dinner-picker-feedback-redraw.md`: lab run record
  for feedback-driven recommendation behavior.
- `experiments/reports/2026-05-31-dinner-picker-mvp.md`: first lab experiment
  report.
- `experiments/reports/2026-05-31-dinner-picker-feedback-redraw.md`: experiment
  report for converting subjective UX feedback into verified behavior.
- `docs/harness-engineering-summary-zh.md`: Chinese share-oriented summary.
