# Harness Vibe Coding Study

这是一个用于探索 harness + vibe coding 最佳实践的 Agent-First Living Lab。

This project explores best practices for harness + vibe coding through an
agent-readable repository structure, documented workflows, experiments,
evaluations, and a real validation project.

## Why This Exists

我们希望回答一个实际问题：怎样组织项目，才能让 AI coding agent 更快理解上下文、
更稳定执行任务，并把过程中的方法论沉淀为可复用知识。

The repository is designed to make agent work observable, repeatable, and
shareable.

## Current Phase

Core harness engineering study is complete. The project has synthesized the
main modules from `walkinglabs/awesome-harness-engineering` into local harness
notes, evolution records, and a Chinese share-oriented summary.

The current validation surface is `lab/dinner-picker`, a mobile-first React +
TypeScript app for testing whether the methodology works in practical app work.
The next learning step is to compare future lab tasks against the run-record
schema, local eval rubric, and experiment reports.

## How To Read This Repository

- Start with `CONTEXT.md` for project intent and current assumptions.
- Read `AGENTS.md` for agent operating rules.
- Use `docs/` for methodology, standards, and tool notes.
- Use `docs/standards/` for cross-cutting project standards future agents
  should follow.
- Use `agents/` for agent roles, playbooks, and handoffs.
- Use `harness/`, `experiments/`, and `evals/` for research and validation.
- Use `lab/` for the real validation project.
- Use `decisions/` for concise decision records.
- Use `docs/evolution/` for stage-level narrative records and shareable lessons.
