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

The next phase is validation: design the first local executable evals, define a
run-record schema under `harness/runs/`, and start using `lab/` as the real
project surface for testing whether the methodology works in practice.

## How To Read This Repository

- Start with `CONTEXT.md` for project intent and current assumptions.
- Read `AGENTS.md` for agent operating rules.
- Use `docs/` for methodology and tool notes.
- Use `agents/` for agent roles, playbooks, and handoffs.
- Use `harness/`, `experiments/`, and `evals/` for research and validation.
- Use `lab/` for the real validation project.
- Use `decisions/` for concise decision records.
- Use `docs/evolution/` for stage-level narrative records and shareable lessons.
