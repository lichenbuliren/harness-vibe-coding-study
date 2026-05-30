# Project Context

## Intent

本项目探索 harness + vibe coding 的最佳实践，目标是让 AI agent 能够快速理解项目、
稳定执行任务、留下可验证证据，并把阶段性经验沉淀为可复用方法论。

This project explores harness + vibe coding best practices through an
Agent-First Living Lab structure.

## Current Phase

Project initialization. The current focus is directory structure, agent-readable
context, and stage-level documentation practices.

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
- Build harness automation before documenting harness boundaries.

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
