# Mainline Continuity

> Priority: high.

Long agent conversations can drift. A project may start with a clear learning
direction, then spend many turns on implementation details, bug fixes, tool
issues, screenshots, or documentation placement. Those local tasks may be
valuable, but they should not erase the mainline.

## Standard

After completing a meaningful subtask, correction loop, side exploration, or
stage-level artifact, the agent should return to the project mainline before
closing or starting the next branch of work.

The mainline check is:

```text
what was the larger goal -> what did this subtask change ->
where are we now -> what is the next mainline step
```

## When To Run The Check

Run a mainline continuity check after:

- a stage or substage transition
- a user-corrected process gap
- a subagent delegation and integration cycle
- a feature implementation inside `lab/`
- a meaningful docs or standards update
- a long debugging or verification loop
- a generated artifact such as a summary or image
- a conversation resume, context compaction, or topic switch

For tiny edits, the check can be one sentence. For phase transitions, update the
relevant entry documents.

## Canonical Sources

Use the smallest set of sources needed to re-anchor the work:

- `CONTEXT.md` for current phase and assumptions
- `README.md` for human-facing project status
- `docs/workflows/validation-phase-learning-plan.md` for phase goals
- recent `docs/evolution/` entries for stage-level history
- active specs or plans under `docs/superpowers/`
- subagent task packets or return reports when delegation occurred
- run records or experiment reports when the current branch came from lab work

## Expected Output

The agent should make the continuity state visible in one of these places:

- final response when no durable doc update is needed
- `CONTEXT.md` or `README.md` when the project phase changes
- `docs/evolution/` when the learning is stage-level or shareable
- a workflow, pattern, or standard when the lesson should be reused

A good close-out should answer:

- Did this work advance the main goal or only fix a side issue?
- Did it change the current phase?
- What is the next mainline step?
- Is there a new reusable standard or pattern?

## Anti-Patterns

- treating every user message as an isolated task
- fixing a local problem and forgetting the learning objective
- allowing a side feature to become the new project direction without decision
- ending with implementation details but no project-position summary
- updating evolution logs while leaving `CONTEXT.md` stale after a phase change

## Shareable Line

Harness engineering should make an agent capable of returning to the mission
after useful detours.
