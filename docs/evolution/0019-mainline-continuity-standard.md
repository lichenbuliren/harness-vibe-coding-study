# Mainline Continuity Standard

## Stage

Phase 3C - Pattern Extraction.

## Goal

Capture a new cross-cutting methodology discovered during conversation: long
agent sessions need an explicit mechanism for returning to the larger project
direction after local work.

## Methodology

The user identified a recurring risk:

- a large direction is agreed early
- later turns focus on local implementation, fixes, images, or documentation
- the agent can forget the larger direction and continue from the local branch

We classified this as a reusable project standard rather than a one-off chat
issue because it affects any long-running harness, lab, or documentation task.

## Decision

Create a high-priority `Mainline Continuity` standard.

Future agents should run a mainline check after meaningful subtasks, correction
loops, side explorations, generated artifacts, or stage-level outcomes:

```text
what was the larger goal -> what did this subtask change ->
where are we now -> what is the next mainline step
```

The rule is enforced in two places:

- `AGENTS.md` for runtime agent behavior
- `docs/standards/mainline-continuity.md` for the durable standard

## Artifacts

- `AGENTS.md`
- `docs/standards/index.md`
- `docs/standards/mainline-continuity.md`
- `docs/evolution/0019-mainline-continuity-standard.md`

## Shareable Takeaway

Mainline continuity is a harness concern.

The goal is not to prevent detours. Detours are often where learning happens.
The goal is to make every useful detour return to the project mission, update
the current position, and clarify the next mainline step.

## Open Questions

- Should run records include a dedicated `Mainline continuity` field?
- Should final responses use a lightweight continuity footer during long
  project phases?
- Should future reusable templates include this as a default agent rule?
