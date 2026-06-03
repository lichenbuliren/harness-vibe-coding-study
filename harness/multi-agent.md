# Multi-Agent Systems

This module defines how this project approaches multi-agent work.

It answers: when should multiple agents be used, how should they share state,
how should conflicts be resolved, and what governance rules apply.

## Relationship To The Orchestration Loop

The [agent-orchestration-loop.md](./agent-orchestration-loop.md) defines the
process flow: intake → delegate → decompose → assign → execute → receive →
verify → integrate → close. This doc defines the system design that the
orchestration loop depends on.

Think of them as:

```text
orchestration-loop.md = how to run a multi-agent session
multi-agent.md        = when and why to use multiple agents, and how to design
                        the system so it works
```

## Core Claim

Sub-agents are useful primarily for context isolation and bounded independent
work. They are not a scaling strategy. Adding more agents creates coordination
cost, state drift, trust problems, and shared-resource conflicts.

The default should be solo execution. Escalate to multi-agent only when the
task cannot be done as well, as fast, or as safely by a single agent.

## Decision Framework

### When To Use Multiple Agents

Multi-agent work is justified when at least one of these is true:

- **Context isolation**: the work requires reading many independent sources
  that would crowd out the main task if loaded into one agent context.
- **Independent review**: the work needs a judgment that the producing agent
  should not make alone.
- **True parallelism**: the work has clearly separable lanes that can be done
  simultaneously without shared state conflicts.
- **Safety separation**: the work involves reading or modifying surfaces that
  should not be visible in the same context (e.g., credentials, different
  trust levels).
- **Cross-surface consistency**: multiple independent surfaces need the same
  treatment and checking them all in one agent would be too noisy.

### When Not To Use Multiple Agents

- The task is small enough for one agent.
- The lead agent must read the same context for both lanes anyway.
- The subagent result would need to be fully redone to be trusted.
- Two agents would edit the same file or surface without integration control.
- The coordination cost (writing packets, reading reports, verifying claims)
  exceeds the speed or quality gain.
- The task involves a single tightly coupled surface (one component, one API)

### Escalation Path

```text
solo → try solo first
  fails because: context overflow, noise, or quality concern
  → 2-agent with verifier/reviewer
    fails because: two is not enough for parallel lanes
    → more agents with clear decomposition
```

Do not jump directly to 3+ agents. Each escalation step should prove the
previous tier insufficient.

## Shared State Rules

### What State Can Be Shared

- Task specs and plans.
- File paths and line references.
- Verification criteria and rubrics.
- Public interface definitions (API schemas, type definitions, contracts).
- Evolution entries and decision records (read-only).

### What State Cannot Be Shared

- An agent's internal reasoning about a task it is working on.
- Tentative changes that have not been verified.
- In-progress edits that conflict with another agent's current work.
- Assumptions that have not been validated.

### State Sharing Mechanisms

| Mechanism | What It Shares | Best For |
|-----------|---------------|----------|
| Subagent handoff packet | Task boundary, expected output, source hints | Delegating new work |
| Handoff packet | Current state, evidence, next step | Cross-session or cross-agent transfer |
| Progress note | Status, blockers, next action | Shared awareness during active work |
| Run record | Completed work, verification, learning | Durable evidence after task completion |
| Git commit | Verified changes with audit trail | Shared codebase updates |
| Spec or plan file | Task contract and acceptance criteria | Shared task understanding |

### State Freshness

Shared state is stale by default. The lead agent should verify claims from
shared state before acting on them:

- Check git status for uncommitted changes.
- Check file timestamps or git log for recent edits.
- Verify subagent claims by opening cited files or rerunning commands.
- Do not assume a handoff written 5 agent steps ago is still current.

## Conflict Handling

### Types Of Conflict

| Conflict | Example | Resolution |
|----------|---------|------------|
| **File edit conflict** | Two agents edit the same function | One agent at a time per file. Sequential execution for shared files. |
| **Decision conflict** | Two agents recommend different approaches | Lead agent evaluates both with explicit criteria, chooses one, records the rejection. |
| **State conflict** | Agent A depends on agent B's unverified output | Block until B's output is verified, then integrate. |
| **Scope conflict** | Agent A's work changes the scope assumed by agent B | Lead agent owns scope. If A's finding changes scope, A reports to lead, lead re-scopes B. |
| **Trust conflict** | Agent A's report cannot be verified from available evidence | Reject or request more evidence before integrating. |

### Resolution Rules

1. **Lead agent owns all conflict decisions.** Subagents report. The lead
   decides.
2. **File ownership is exclusive during a task.** Assign one agent per file per
   task cycle. Use sequential execution for multi-agent edits of the same file.
3. **Decision conflicts are resolved by evidence, not authority.** The lead
   should record why one approach was chosen and the other rejected.
4. **Unverifiable claims are rejected.** If a subagent says "X is true" but
   the evidence is not provided, treat it as unproven.
5. **Scope creep is blocked.** If a subagent finding expands the task scope,
   it reports to the lead. The lead decides whether to expand, defer, or
   reject the new scope.

## Agent Roles In Multi-Agent Work

### Lead Agent

The lead agent owns the whole task lifecycle. It:

- decides solo vs multi-agent
- decomposes the task
- assigns subagent packets
- continues non-conflicting work during subagent execution
- receives and verifies subagent reports
- integrates, rejects, or defers results
- closes subagents after integration
- records evidence
- returns to the mainline

One lead per task. The lead may not delegate the integration decision.

### Subagent

A subagent executes a bounded packet assigned by the lead. It:

- reads the assigned sources
- executes the assigned work
- produces a condensed report with evidence
- returns to the lead
- does not redefine scope or contact surfaces outside the packet

One subagent per packet. A subagent's result is an input, not a completion
claim.

### Verifier Agent

A verifier agent evaluates work produced by another agent. It:

- reads the produced artifact (code, docs, plan, spec)
- evaluates against the assigned rubric or criteria
- produces a score, pass/fail, or recommendation with evidence
- returns to the lead

The verifier should not produce alternatives or make changes. If it finds
issues, it reports them. The lead decides how to address them.

### Reviewer Agent

A reviewer agent provides judgment on quality, architecture, or completeness.
It differs from the verifier:

- Verifier: pass/fail against defined criteria
- Reviewer: judgment and recommendations for improvement

Both can exist in the same workflow. The verifier gates go/no-go. The reviewer
informs iteration direction.

## Multi-Agent Topologies

### Verifier Topology

```text
lead agent → implement → produce artifact → verifier agent → pass/fail
```

Use when: implementation quality needs independent gate, but the work is
simple enough that one subagent can both implement and be reviewed.

### Parallel Research Topology

```text
lead agent → subagent A (sources set 1)
           → subagent B (sources set 2)
           → subagent C (sources set 3)
           → integrate reports into synthesis
```

Use when: the question has multiple independent evidence surfaces that would
crowd one agent's context.

### Sequential Review Topology

```text
lead agent → implementer A → artifact → reviewer B → issues
           → implementer A (fix issues) → artifact → reviewer B → pass
```

Use when: the work is complex and iterative review adds value, but the
changes are limited to one surface.

### Lead-As-Integrator Topology

```text
lead agent → subagent A (cross-surface check docs/)
           → subagent B (cross-surface check harness/)
           → lead reads both reports → integrates findings
```

Use when: cross-surface consistency is the goal and the lead needs both
perspectives before making integration decisions.

### When To Avoid Each Topology

| Topology | Avoid When |
|----------|-----------|
| Verifier | Work is trivial or deterministic checks suffice |
| Parallel Research | Sources overlap heavily or one subagent can cover all |
| Sequential Review | Changes are mechanical (rename, format) |
| Lead-As-Integrator | The lead must redo all the reading to trust the result |

## Subagent Lifecycle

### Lifecycle Rules

1. Every subagent has a bounded packet (use the handoff format).
2. The lead closes the subagent after integration or rejection.
3. A closed subagent is not reused for a different task — create a new packet.
4. Subagent lifespan should not exceed one task phase.
5. If a subagent is blocked, it reports the blocker to the lead and pauses.

### Lifecycle States

```text
assigned → running → reported → integrated or rejected → closed
```

The lead tracks which state each subagent is in. For significant multi-agent
work, record the state in the run record or handoff.

## Governance Rules

1. **One lead per task.** No shared leadership within a single task.
2. **Subagents do not spawn subagents.** Only the lead may delegate.
3. **Scope changes go through the lead.** Subagents do not redefine their
   packet.
4. **Unverified subagent output is not authoritative.** Treat it as evidence to
   verify, not as truth.
5. **Subagent lifecycle is explicit.** Close completed subagents; do not leave
   them dangling.
6. **Multi-agent evidence is documented.** The run record or final response
   should mention which subagents were used and why.

## Relationship To Other Harness Docs

| Doc | Connection |
|-----|-----------|
| `agent-orchestration-loop.md` | Defines the process flow this system design supports. |
| `primitives.md` | Subagent Packet, Verifier Role are defined primitives. |
| `verification.md` | Verifier and reviewer roles are inferential check mechanisms. |
| `agent-delivery-contract.md` | Prescribes subagent lifecycle closure and cost control. |
| `agent-learning-loop.md` | Multi-agent coordination failures become learning signals. |
| `agents/handoffs/subagent-task-handoff.md` | Defines the packet format. |
| `agents/playbooks/subagent-delegation.md` | Defines the delegation workflow. |

## Anti-Patterns

- **Role theater**: naming subagents "researcher", "architect", "reviewer"
  without giving them bounded, isolated work and clear output expectations.
- **Agent chains**: agent A calls agent B, which calls agent C, with no clear
  lead or integration point.
- **Over-decomposition**: splitting a simple task into 3 agents when one
  would do. The coordination cost exceeds the parallelism benefit.
- **Shared state idiocy**: two agents modifying the same file without
  integration control.
- **Trust drift**: treating subagent reports as verified truth without
  checking the evidence.
- **Orphaned subagents**: subagents whose results are left unintegrated in the
  conversation, consuming context without adding value.
- **Self-similar multi-agent**: applying multi-agent patterns to work that is
  too small, just because the method is documented.
