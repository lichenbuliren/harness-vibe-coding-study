# Subagent Delegation Handoff Standard

## Stage

Phase 3C - Pattern Extraction.

## Goal

Review the current Phase 3C records and capture a reusable standard for
delegating work from the main agent to subagents without losing the project
mainline.

## Methodology

The user identified a coordination risk:

- important direction is discussed in the main agent context
- a subtask is delegated to another agent or context
- the subagent may finish local work, but the main agent may not integrate it
  back into the larger direction

We classified this as a reusable workflow and handoff problem. It extends the
existing subagent cost-control and mainline-continuity standards.

## Decision

Create a unified subagent delegation format:

```text
mainline goal -> bounded subtask packet -> subagent return report ->
main agent integration decision -> mainline continuity check
```

The main agent owns direction and integration. The subagent owns bounded
execution or review. The result is not complete until the main agent accepts,
rejects, defers, or partially integrates the report and states the next mainline
step.

## Artifacts

- `agents/handoffs/subagent-task-handoff.md`
- `agents/playbooks/subagent-delegation.md`
- `agents/handoffs/index.md`
- `agents/playbooks/index.md`
- `harness/agent-delivery-contract.md`
- `docs/standards/mainline-continuity.md`
- `docs/evolution/0020-subagent-delegation-handoff-standard.md`

## Shareable Takeaway

Subagents should not be treated as loose parallel chat threads.

In a harness-quality workflow, delegation is a contract:

```text
the main agent gives direction, the subagent returns evidence,
the main agent integrates, and the project returns to the mainline
```

## Open Questions

- Should future run records include a `Subagents used` section?
- Should the reusable project template include this handoff by default?
- Should a public skill package include a subagent task packet generator?
