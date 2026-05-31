# Agent Orchestration Loop

This module defines how a lead agent coordinates subagents without losing task
direction, evidence quality, or context control.

It is the canonical harness surface for multi-agent task orchestration. Role
files, delegation playbooks, and handoff templates are execution materials that
serve this loop.

## Purpose

The delivery loop helps an agent finish the current task. The learning loop
helps the project improve after useful friction. The orchestration loop helps a
lead agent decide when multiple agents are worth the coordination cost and how
their work becomes one verified result.

Use it when the task may benefit from:

- independent review
- parallel source reading
- context isolation
- bounded implementation in separate files or domains
- cross-surface consistency checks
- risk analysis before editing canonical files
- verification by an agent that did not produce the work

Do not use it to make simple work look more rigorous. Subagents add prompt,
context, reasoning, integration, and verification cost.

## Core Loop

```text
intake -> choose solo or delegate -> decompose -> assign bounded packets ->
parallel or sequential execution -> receive reports -> verify claims ->
integrate / reject / defer -> close subagents -> record evidence ->
return to mainline
```

The lead agent owns the whole loop. A subagent owns only its assigned slice.

## Step 1: Intake

Start with the main task, not with available roles.

The lead agent should identify:

- the larger goal
- acceptance criteria
- current phase and constraints from `CONTEXT.md`
- files or surfaces likely to change
- verification needed before completion
- whether the task has independent lanes

If the work is unclear or materially branching, clarify or plan before
delegating.

## Step 2: Choose Solo Or Delegate

Delegate only when it improves speed, quality, safety, or coverage enough to
justify coordination cost.

Use solo execution when:

- the task is small
- the lead agent must read the same context anyway
- the work touches one tightly coupled surface
- the subagent result would need to be fully redone to trust
- there is no clear integration point

Use subagents when:

- two or more lanes can run independently
- an independent critique is valuable
- a focused context window reduces noise
- review and implementation should be separated
- documentation surfaces need parallel consistency checks
- verification should be performed by a separate role

The decision should be visible for meaningful work:

```text
Why delegation helps:
Why solo execution is enough:
```

Use only one of those, not both.

## Step 3: Decompose

Decompose by ownership boundary, not by vague activity.

Good delegation slices are:

- bounded
- independently inspectable
- low-conflict with other slices
- tied to the mainline goal
- clear about out-of-scope work
- clear about evidence required
- clear about when to stop

Bad delegation slices include:

- "research everything"
- "fix whatever you find"
- "review the repo"
- "make it better"
- "continue until done"

If two subagents need to edit the same file, prefer sequential work or make the
lead agent own the final edit.

## Step 4: Assign Bounded Packets

Every delegated task should use the packet shape in
`agents/handoffs/subagent-task-handoff.md`.

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

The lead agent should prefer role-appropriate reasoning effort over stale or
hardcoded model overrides.

## Step 5: Run Parallel Or Sequential Work

Run independent tasks in parallel.

Run tasks sequentially when:

- one task depends on another result
- two tasks may edit the same file
- the first result determines the second scope
- verification must pass before implementation continues
- a shared decision must be made first

While subagents run, the lead agent may do non-conflicting work. Do not make
changes that invalidate the delegated task without updating or cancelling it.

## Step 6: Receive Reports

A subagent report should include:

```text
Subtask result:
Evidence:
Files changed or inspected:
Risks and gaps:
Rejected branches:
Recommended integration:
Mainline impact:
```

The report is an input, not a completion claim.

## Step 7: Verify Claims

The lead agent must verify important claims before integrating them.

Verification can include:

- opening cited files
- rerunning commands
- checking line references
- inspecting screenshots or browser results
- comparing the report against the original task packet
- asking whether the result changes the mainline or scope

For code or UI changes, final verification remains the lead agent's
responsibility unless a verifier subagent's output is itself independently
checked.

## Step 8: Integrate, Reject, Or Defer

Classify each subagent result:

- `accept`: integrate as reported after verification
- `partial`: use selected findings and reject the rest
- `defer`: preserve the finding for later without changing current scope
- `reject`: do not use the result; explain why if meaningful

The integration decision should be visible in the final response, run record,
evolution entry, or changed artifact when the work is meaningful.

## Step 9: Close Subagents

Close the lifecycle once the result has been integrated, rejected, or deferred.

Do not rely on implicit cleanup. A dangling subagent result is unowned context.

Close-out should answer:

- Was the result used?
- What evidence was verified?
- What remains open?
- Did the subtask change the mainline?

## Step 10: Record Evidence

Record orchestration evidence when delegation materially affected the result.

Possible surfaces:

- final response for small tasks
- `harness/runs/` for durable task evidence
- `docs/evolution/` for stage-level learning
- `agents/handoffs/` when a reusable packet shape changes
- `docs/standards/` when delegation behavior becomes mandatory
- `templates/` when new projects should inherit the behavior

Run records should mention subagents used, why they were used, and how their
outputs were integrated or rejected.

## Step 11: Return To Mainline

Close with:

```text
larger goal -> orchestration result -> integration decisions ->
current project position -> next mainline step
```

This prevents parallel work from becoming untracked branches of the
conversation.

## Relationship To Other Loops

```text
delivery loop: prove the current task
learning loop: turn reusable friction into future behavior
orchestration loop: coordinate multiple agents into one verified result
```

Use the orchestration loop only when it helps the delivery loop or learning
loop.

## Relationship To Future Skills

This module is a skill seed.

A future `agent-orchestration-loop` skill should help a lead agent:

- decide solo versus delegated execution
- decompose a task into bounded packets
- choose parallel versus sequential lanes
- validate subagent reports
- integrate, reject, or defer outputs
- record orchestration evidence

Do not package this as a skill until it has eval tasks comparing solo execution,
unstructured delegation, and structured orchestration.

## Anti-Patterns

- spawning subagents before understanding the task
- delegating work the lead agent must fully redo
- using subagents for trivial lookups
- letting subagents redefine the global plan
- accepting reports without evidence
- allowing two subagents to edit the same surface without integration control
- leaving results unintegrated
- treating more agents as automatically better work
