# Project Context

## Intent

本项目探索 harness + vibe coding 的最佳实践，目标是让 AI agent 能够快速理解项目、
稳定执行任务、留下可验证证据，并把阶段性经验沉淀为可复用方法论。

This project explores harness + vibe coding best practices through an
Agent-First Living Lab structure.

## Current Phase

Phase 3C - Pattern Extraction deliverable complete.

The core learning pass over `walkinglabs/awesome-harness-engineering` is
complete, and Phase 3B validated the methodology through the first real lab
project: `lab/dinner-picker`.

Phase 3C has produced an evidence map, reuse strategy decision, minimum
template skeleton design, checked-in `templates/agent-first-living-lab/`
skeleton, and throwaway initialization validation. The current follow-up space
is optional-pack design, generator design, independent fresh-repo validation,
or future skill-candidate evals.

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
- **Project standard**: reusable rule that future agents should follow across
  harness, documentation, directory structure, lab work, or evaluation.

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
- Treat user-corrected agent mistakes as potential project-standard evidence;
  reusable process gaps should update the canonical project contract, not remain
  only in chat.
- Enter Phase 3C after the Dinner Picker lab produced MVP evidence, mobile
  feedback evidence, standard-capture evidence, and reusable process-gap
  findings.
- Use a conservative project-template skeleton as the first reusable package;
  public skills remain future candidates until separately evaluated.

## Current Artifacts

- `harness/foundations.md`: foundation model for harness engineering.
- `harness/context-memory.md`: context, memory, compaction, and working-state
  policy.
- `harness/guardrails-safe-autonomy.md`: safe-autonomy boundaries and verifier
  gates.
- `harness/specs-agent-workflows.md`: spec lifecycle and workflow state model.
- `harness/agent-learning-loop.md`: canonical loop for turning corrections,
  failed checks, review findings, and repeated friction into durable project
  behavior.
- `harness/agent-orchestration-loop.md`: canonical loop for lead-agent and
  subagent coordination, integration, lifecycle closure, and evidence.
- `harness/capability-discovery.md`: conditional gate for finding existing
  skills, tools, plugins, playbooks, scripts, and runtime capabilities before
  doing work directly.
- `harness/agent-delivery-contract.md`: minimum delivery loop for testing,
  user-facing verification, commits, and durable evidence.
- `docs/standards/`: cross-cutting standards that future agents should treat as
  reusable project rules.
- `docs/patterns/standard-capture-loop.md`: high-priority methodology for
  turning meaningful corrections and failed runs into project standards.
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
- `templates/agent-first-living-lab/`: template-safe skeleton extracted during
  Phase 3C.
- `templates/agent-first-living-lab/INITIALIZE.md` and `init-template.sh`:
- `harness/primitives.md`: reusable harness primitives and when to use them, organized by Control / Agency / Runtime / Substrate.
- `harness/verification.md`: deterministic checks, inferential checks, approval gates, and verification levels by risk.
- `docs/workflows/harness-maturity-assessment.md`: structured maturity assessment framework for evaluating a project across seven harness layers.
- `harness/session-lifecycle.md`: bootstrap, progress, handoff, and recovery across session boundaries.
- `harness/tools-and-context.md`: progressive disclosure, tool policy, MCP/CLI boundaries, and context hygiene.
- `harness/multi-agent.md`: sub-agent use cases, shared-state rules, conflict handling, and governance.
- `harness/adoption-playbook.md`: stage-by-stage adoption guide for real projects.
- `docs/patterns/success-patterns.md`: captures unexpectedly good outcomes and their contributing factors.
- `harness/adapters/`: now contains adapter notes for Codex Desktop and generic MCP runtimes.
  repeatable initialization guide and thin helper for the template skeleton.
- `docs/workflows/template-skeleton-throwaway-validation.md`: validation report
  showing the template skeleton can initialize a temporary project and create
  first evidence records.
- `docs/workflows/template-initialization-validation.md`: fresh git repository
  validation for the initialization helper.
