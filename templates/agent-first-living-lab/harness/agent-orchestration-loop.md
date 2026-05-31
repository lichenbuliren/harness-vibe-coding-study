# Agent Orchestration Loop

This module defines how a lead agent coordinates subagents without losing task
direction, evidence quality, or context control.

Use it when a task may benefit from independent review, parallel reading,
context isolation, bounded implementation, cross-surface consistency checks, or
separate verification.

Do not use it to make simple work look more rigorous. Subagents add prompt,
context, reasoning, integration, and verification cost.

## Core Loop

```text
intake -> choose solo or delegate -> decompose -> assign bounded packets ->
parallel or sequential execution -> receive reports -> verify claims ->
integrate / reject / defer -> close subagents -> record evidence ->
return to mainline
```

## Delegation Gate

Use solo execution when:

- the task is small
- the lead agent must read the same context anyway
- the work touches one tightly coupled surface
- the subagent result would need to be fully redone to trust
- there is no clear integration point

Use subagents when:

- two or more lanes can run independently
- independent critique is valuable
- a focused context window reduces noise
- review and implementation should be separated
- verification should be performed by a separate role

## Bounded Packets

Every delegated task should use `agents/handoffs/subagent-task-handoff.md`.

Minimum packet:

```text
Mainline goal:
Why this subtask exists:
Exact subtask:
Out of scope:
Files or sources to read first:
Expected output:
Required evidence:
Return format:
Stop condition:
```

## Integration

A subagent report is an input, not a completion claim.

The lead agent must verify important claims and choose:

- `accept`: integrate as reported after verification
- `partial`: use selected findings and reject the rest
- `defer`: preserve the finding for later without changing current scope
- `reject`: do not use the result

Close the subagent lifecycle once the result is integrated, rejected, or
deferred.

## Evidence

Record orchestration evidence when delegation materially affected the result.
Use a final response for small tasks, `harness/runs/` for durable task evidence,
and `docs/evolution/` for stage-level learning.

## Mainline Check

Close with:

```text
larger goal -> orchestration result -> integration decisions ->
current project position -> next mainline step
```

## Skill Candidate

This file is a seed for a future `agent-orchestration-loop` skill. Package it
only after eval tasks compare solo execution, unstructured delegation, and
structured orchestration.
