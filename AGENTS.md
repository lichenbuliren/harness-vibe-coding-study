# Agent Operating Contract

本仓库用于探索 harness + vibe coding 的最佳实践。它首先服务 AI coding
agent 阅读和执行，其次服务 harness 实验、评估复盘和后续分享。

This repository explores best practices for harness + vibe coding. It is an
Agent-First Living Lab: agents should be able to understand the project,
navigate the repository, act within clear boundaries, and record evidence.

## Repository Purpose

- Build an AI-agent-readable project operating system.
- Document reusable methodology for harness + vibe coding.
- Validate the methodology through a real project under `lab/`.
- Record decisions, experiments, evaluations, and shareable evolution notes.

## Directory Map

- `README.md`: human-facing project entrance.
- `CONTEXT.md`: durable project context for future agents and compressed sessions.
- `docs/`: methodology, workflows, patterns, tools, and evolution logs.
- `agents/`: agent roles, playbooks, and handoff formats.
- `harness/`: harness concepts, adapter boundaries, and run records.
- `experiments/`: task samples, experiment design, and experiment reports.
- `evals/`: rubrics, checklists, and quality gates.
- `lab/`: real validation project used to test the methodology.
- `decisions/`: concise ADR-style decision records.

## Operating Rules

- Read `CONTEXT.md` before making project-shaping changes.
- Prefer thin, well-named Markdown entry files over empty directories.
- Keep directory responsibilities separate: experiments record what happened;
  evals define how quality is judged.
- Do not introduce application code, dependencies, or framework structure until
  a plan explicitly calls for it.
- Do not create `apps/`, `packages/`, `src/`, `scripts/`, `infra/`, or
  `benchmarks/` during the first structure pass.
- Preserve existing user-authored notes unless a task explicitly asks to replace
  them.

## Verification Requirements

Before claiming completion:

- Run `find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort` to
  inspect the resulting structure.
- Run `git status --short` and report untracked or intentionally untouched files.
- Confirm required index files exist.
- Confirm no forbidden first-stage directories were created.

## Evolution Log Requirement

When a stage-level outcome is reached, update `docs/evolution/`.

A stage-level outcome includes:

- a project structure decision
- a methodology decision
- a completed experiment
- a meaningful lab milestone
- a reusable pattern or workflow being validated
- a public-shareable learning

Do not record every small edit. Record the method used, the questions asked, the
decision made, the artifacts produced, and the shareable takeaway.
