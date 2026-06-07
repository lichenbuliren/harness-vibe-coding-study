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

### Core Harness (5 Subsystems)

- `harness/quick-start.md`: recommended entry point — shortest path to use
  the methodology.
- `harness/instructions.md`: specs, agent files, definition of done, delivery
  loop.
- `harness/tools.md`: tool categories, progressive disclosure, capability
  discovery gate.
- `harness/environment.md`: runtime environment, reproducibility, adapters.
- `harness/state.md`: session lifecycle, context management, cross-session
  persistence, safety boundaries.
- `harness/feedback.md`: verification, evals framework, run record schema.

### Operating Modes

- `harness/agent-learning-loop.md`: canonical loop for turning corrections
  into project standards.
- `harness/agent-orchestration-loop.md`: lead-agent and subagent coordination.
- `harness/multi-agent.md`: multi-agent governance and shared-state rules.

### Adoption

- `harness/adoption-playbook.md`: stage-by-stage adoption guide.

### Reference (deep docs moved to docs/reference/)

- `docs/reference/awesome-harness-synthesis.md`
- `docs/reference/primitives-taxonomy.md`
- `docs/reference/benchmarks-taxonomy.md`
- `docs/reference/runtimes-taxonomy.md`

    (original docs remain at harness/ paths for backward compatibility)

### Supporting

- `docs/standards/`: cross-cutting project standards.
- `docs/patterns/`: standard-capture-loop, success-patterns.
- `harness/runs/`: experimental run records (historical).
- `harness/adapters/`: runtime adapter notes.
- `docs/workflows/`: maturity assessment, template validation.
- `evals/`: rubrics and checklists.
- `experiments/`: task samples and experiment reports.
- `lab/dinner-picker/`: first real lab validation app.
- `docs/harness-engineering-summary-zh.md`: Chinese share-oriented summary.
- `templates/agent-first-living-lab/`: template skeleton with init.sh,
  feature_list.json, and validate-harness.mjs.
- `templates/agent-first-living-lab/INITIALIZE.md` and `init-template.sh`:
  initialization helper.

