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
- `templates/`: reusable skeletons extracted from validated project evidence.

## Operating Rules

- Read `CONTEXT.md` before making project-shaping changes.
- Prefer thin, well-named Markdown entry files over empty directories.
- Keep directory responsibilities separate: experiments record what happened;
  evals define how quality is judged.
- Do not introduce application code, dependencies, or framework structure until
  a plan explicitly calls for it.
- During the initialization phase described in `CONTEXT.md`, do not create
  `apps/`, `packages/`, `src/`, `scripts/`, `infra/`, or `benchmarks/` unless
  a later decision record and implementation plan retire this restriction.
- Preserve existing user-authored notes unless a task explicitly asks to replace
  them.
- When the user points out an agent mistake, omission, weak verification, or
  process gap, do not only acknowledge it. Decide whether it reveals a reusable
  project standard. This may be a harness rule, directory rule, documentation
  rule, evaluation rule, lab rule, or agent operating rule. If it does, update
  the appropriate project contract under `docs/standards/`, `harness/`,
  `evals/`, `docs/evolution/`, or `AGENTS.md` before closing the task.
- Use `harness/agent-learning-loop.md` as the canonical process for turning
  corrections, failed checks, review findings, and repeated friction into
  durable project behavior.
- When terminology is unclear or a standard crosses multiple documentation
  surfaces, use documentation-sharpening skills such as `grill-with-docs` and
  consider subagents for parallel review. If an optional skill is not available
  in the current environment, point to the relevant install note under
  `docs/tools/` and continue with the closest lightweight fallback.
- Use `harness/agent-orchestration-loop.md` as the canonical process for
  deciding when to delegate, how to assign bounded subagent packets, how to
  verify and integrate reports, and how to close subagent lifecycles.
- Use `harness/capability-discovery.md` as the conditional gate for deciding
  when to look for existing skills, tools, plugins, playbooks, scripts, or
  runtime capabilities before doing work directly. Do not silently install new
  capabilities without user authorization.
- Use subagents only for bounded work that materially improves speed, quality,
  or independent review. Subagents are not free: their context, exploration,
  reasoning, and reports consume additional token budget. After a subagent has
  reported and the lead agent has integrated or rejected the result, close the
  subagent promptly instead of relying on implicit cleanup.
- Preserve mainline continuity in long conversations. After completing a
  meaningful subtask, correction loop, or side exploration, return to
  `CONTEXT.md`, the active workflow plan, and recent `docs/evolution/` entries
  to state where the project now is and what the next mainline step should be.
  Do not let local fixes silently redefine the project direction.

## Verification Requirements

Before claiming completion:

- Run `find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort` to
  inspect the resulting structure.
- Run `git status --short` and report untracked or intentionally untouched files.
- Confirm the current-stage required files listed in the active task plan exist.
- Confirm no forbidden first-stage directories were created.

## Evolution Log Requirement

When a stage-level outcome is reached, update `docs/evolution/`.

A stage-level outcome includes:

- a project structure decision
- a methodology decision
- a completed experiment
- a meaningful lab milestone
- a reusable pattern or workflow being validated
- a user-corrected agent failure that becomes a reusable harness rule
- a new or revised cross-cutting project standard
- a public-shareable learning

Do not record every small edit. Record the method used, the questions asked, the
decision made, the artifacts produced, and the shareable takeaway.
