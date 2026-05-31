# Agent Operating Contract

This repository is an Agent-First Living Lab.

Agents should be able to understand the project, navigate the repository, act
within clear boundaries, verify claims, and record evidence.

## Repository Purpose

- Build an agent-readable project operating system.
- Build real product work in the project source tree when a source pack is
  selected.
- Record decisions, experiments, evaluations, and evolution notes.

## Directory Map

- `README.md`: human-facing project entrance.
- `CONTEXT.md`: durable project context.
- `docs/`: methodology, workflows, patterns, standards, tools, and evolution.
- `agents/`: agent roles, playbooks, and handoff formats.
- `harness/`: delivery contracts, run records, and harness notes.
- `experiments/`: task samples and experiment reports.
- `evals/`: rubrics and checklists.
- `decisions/`: concise ADR-style decision records.
- `src/`, `package.json`, or app directories: product source entrypoints when
  an app pack or later implementation plan adds them.

## Operating Rules

- Read `CONTEXT.md` before project-shaping changes.
- Keep root instructions short and navigational.
- Preserve user-authored work unless explicitly asked to replace it.
- Use the smallest useful specialist role set for delegated work.
- When a user correction reveals a reusable rule, update the right durable
  surface instead of leaving the lesson only in chat.
- Use `harness/agent-learning-loop.md` as the canonical process for turning
  corrections, failed checks, review findings, and repeated friction into
  durable project behavior.
- Use `harness/agent-orchestration-loop.md` as the canonical process for
  deciding when to delegate, assigning bounded subagent packets, verifying and
  integrating reports, and closing subagent lifecycles.
- After meaningful side work, return to the mainline and state the next step.

## Verification Requirements

Before claiming completion:

- Run the relevant tests or checks for the change type.
- Inspect the result instead of assuming success.
- For user-facing behavior, verify the path the user will actually use.
- Run `find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort`
  when project structure changed.
- Run `git status --short` and report the worktree state.

## Evolution Log Requirement

When a stage-level outcome is reached, update `docs/evolution/`.

Stage-level outcomes include:

- a project structure decision
- a methodology decision
- a completed experiment
- a meaningful lab milestone
- a reusable pattern or workflow being validated
- a user-corrected agent failure that becomes a reusable rule
- a public-shareable learning
