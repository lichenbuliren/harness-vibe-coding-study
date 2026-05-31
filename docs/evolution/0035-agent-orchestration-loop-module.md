# Agent Orchestration Loop Module

## Stage

Post-Phase 3C follow-up - Multi-agent orchestration modularization.

## Goal

Extract the lead-agent and subagent collaboration model into a canonical harness
module, parallel to the learning loop.

## What Triggered This

After extracting `harness/agent-learning-loop.md`, the same structural issue
became visible for subagent collaboration. The repository already had useful
materials:

- `agents/playbooks/subagent-delegation.md`
- `agents/handoffs/subagent-task-handoff.md`
- `harness/agent-delivery-contract.md`
- runtime rules in `AGENTS.md`

But those files described how to delegate or format handoffs. They did not own
the full orchestration loop: when to stay solo, when to delegate, how to
decompose, how to verify subagent claims, how to integrate or reject outputs,
and how to close the lifecycle.

## Method

We classified orchestration as a harness loop rather than only an agent
playbook.

The implementation followed:

```text
identify scattered delegation rules -> choose canonical surface ->
add orchestration loop -> point playbooks and handoffs to it ->
sync template -> verify discoverability
```

## Decision

`harness/agent-orchestration-loop.md` is now the canonical owner for lead-agent
and subagent coordination:

```text
intake -> choose solo or delegate -> decompose -> assign bounded packets ->
parallel or sequential execution -> receive reports -> verify claims ->
integrate / reject / defer -> close subagents -> record evidence ->
return to mainline
```

`agents/playbooks/subagent-delegation.md` remains the execution playbook.
`agents/handoffs/subagent-task-handoff.md` remains the packet and return-report
template. `AGENTS.md` remains the runtime enforcement surface.

## Artifacts

- `harness/agent-orchestration-loop.md`
- `harness/index.md`
- `harness/agent-delivery-contract.md`
- `AGENTS.md`
- `CONTEXT.md`
- `agents/playbooks/subagent-delegation.md`
- `agents/handoffs/subagent-task-handoff.md`
- `docs/workflows/minimum-project-template-skeleton.md`
- `templates/agent-first-living-lab/harness/agent-orchestration-loop.md`
- `templates/agent-first-living-lab/AGENTS.md`
- `templates/agent-first-living-lab/agents/playbooks/subagent-delegation.md`
- `templates/agent-first-living-lab/agents/handoffs/subagent-task-handoff.md`
- `templates/agent-first-living-lab/init-template.sh`

## Shareable Takeaway

Multi-agent work is not a role list. It is an orchestration loop.

The lead agent must own decomposition, packet quality, report verification,
integration decisions, lifecycle closure, and mainline continuity. Subagents
are useful when they create real independence or review value, not when they
serve as extra ceremony.

## Open Questions

- Should a future `agent-orchestration-loop` skill generate task packets
  directly?
- What eval should compare solo execution, unstructured delegation, and
  structured orchestration?
- Should run records require a dedicated orchestration section whenever
  subagents are used?
