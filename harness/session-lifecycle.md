# Session Lifecycle

This module defines how an agent's work proceeds across session boundaries.

It answers: how does a session start, how does work progress, what happens at
handoff, and how can a session recover from context loss.

## Core Claim

A session is not a durable unit of work. The chat window is a working set, not
a long-term memory. Durable state lives in the filesystem and git.

The session lifecycle is:

```text
bootstrap -> progress -> checkpoint -> handoff or recover -> close
```

Each phase has documented expectations. An agent should know which phase it is
in and what state it must preserve before leaving that phase.

## Phase 1: Bootstrap

Every session begins with a context restoration step.

### Fresh Session

A session with no prior context from this project:

```
1. Read AGENTS.md — project map and operating contract
2. Read CONTEXT.md — current phase, intent, non-goals
3. Check CONTEXT-MAP.md or docs/index — knowledge routing
4. Read the active workflow or plan — current task state
5. Read recent handoff if one exists — continuity from prior sessions
6. Check git log — recent activity
```

Bootstrap is complete when the agent can answer:

- What project is this?
- What phase are we in?
- What am I working on right now?
- What happened last session?
- What constraints are active?

### Resumed Session

A session that has prior context from the same conversation or a handoff packet:

```
1. Re-read AGENTS.md key sections (may be cached in context)
2. Re-read the active task spec or plan
3. Read the last checkpoint or progress note
4. Read the handoff packet if one exists
5. Verify the working tree matches expectations (git status)
```

Resume is complete when the agent can continue without requiring the user to
repeat the last session's decisions.

### Bootstrap Artifacts

Bootstrapping may produce these artifacts when the project doesn't have them:

- A one-line `CONTEXT.md` stating current phase if it's missing.
- A short task spec in a durable file if multi-step work is starting.
- A `docs/workflows/index.md` entry if the project has none.

Do not create full harness infrastructure during bootstrap. Create the minimum
the current task needs.

## Phase 2: Progress

Work proceeds through a state model within each session.

### Default State Model

```text
orienting -> scoping -> exploring -> implementing -> verifying -> closing
```

| State | What Happens | Exit Criterion |
|-------|-------------|----------------|
| **Orienting** | Read AGENTS.md, CONTEXT.md, current plan. Understand the goal. | Can state the goal and constraints in own words. |
| **Scoping** | Decompose the goal into bounded work. Read relevant docs. Identify verification criteria. | Written task spec or plan exists. |
| **Exploring** | Read source code, run commands, search for evidence. No changes yet. | Evidence collected. Next step is clear (implement, report, or escalate). |
| **Implementing** | Make changes. Write code, docs, tests. Run checks. | Changes pass relevant deterministic checks. |
| **Verifying** | Run verification at the correct level (self/mechanical/independent). Record evidence. | Verification criteria satisfied. Evidence recorded. |
| **Closing** | Commit, record run or evolution, handoff if needed. Return to mainline. | Session-safe to stop. Next agent can continue. |

Transitions should be explicit. An agent that says "we are done exploring" and
then immediately implements should mark the state transition rather than
blurring them.

### Escalation Paths

From any state, the agent may transition to:

- **Blocked**: a dependency is not met, a decision needs the user, or evidence
  requires human access. Record the blocker in a progress note before stopping.
- **Delegated**: work is handed to a subagent. The lead agent remains in its
  current state or shifts to a parallel lane.
- **Cancelled**: the task or subtask is no longer needed. Record why.

### Progress Artifacts

| State | Artifact When Needed |
|-------|---------------------|
| Orienting → Scoping | Task spec or plan |
| Exploring | Evidence notes or a run record |
| Implementing | Source changes, tests |
| Verifying | Run record with verification section |
| Closing | Commit message, evolution entry if stage-level |

The default is to progress through states without creating intermediate
artifacts unless the work is multi-step, long-running, or high-risk.

## Phase 3: Checkpoint

A checkpoint is a verified pause point. It proves that work up to this point is
complete, tested, and preserved.

### When To Checkpoint

- At a natural phase boundary (bootstrap → explore, explore → implement)
- Before context compaction
- Before delegating to a subagent
- After a meaningful subtask completes
- When the agent detects high cognitive load or approaching compact
- When the risk of losing context is material

### Checkpoint Requirements

```
1. Deterministic checks pass for completed work
2. Working state is committed or stashed in a durable file
3. A progress note or run record captures what was done and what's next
4. Open questions and blockers are documented
5. The next session knows where to start
```

### Checkpoint Output

A checkpoint produces compact state in one of these surfaces:

| Surface | When To Use |
|---------|-------------|
| Git commit | Completed, verified, meaningful unit of work |
| Progress note (durable file) | In-progress multi-step task |
| Handoff packet | Cross-session or cross-agent transfer |
| Run record | Complete task with evaluation |
| Evolution entry | Stage-level outcome |

## Phase 4: Handoff

A handoff transfers session state from one agent or session to another.

### When To Handoff

- Before a long session ends and work is incomplete
- Before context compaction
- When subagent work must be integrated by a different agent
- When changing between lead and verifier roles
- When the user explicitly requests continuity

### Handoff Contents

Minimum handoff packet:

```text
Current goal:
Completed work:
Verification evidence:
Next step:
Open questions:
Blockers:
Active files (read, modified, or created):
Decisions made:
Risks:
```

The handoff should fit in a single read. If it spans multiple pages, the
receiving agent will have difficulty maintaining the main thread.

### Handoff Format

The canonical handoff format is in
[agents/handoffs/subagent-task-handoff.md](../agents/handoffs/subagent-task-handoff.md).
For cross-session handoffs, use a progress note in a durable file or a run
record in `harness/runs/`.

## Phase 5: Recovery

Recovery is what happens when context is lost between checkpoints.

### Recovery Sources

When context is lost, the agent should reconstruct from these sources in order:

1. **Git log**: recent commits, branch state, working tree diff.
2. **Progress notes or handoff packets**: durable files capturing state.
3. **Run records**: completed task evidence.
4. **Plan or spec files**: the task contract.
5. **CONTEXT.md**: project phase and working assumptions.
6. **Evolution entries**: stage-level learning.

### Recovery Without Handoff

If no handoff exists, the agent should:

1. Read the project entry files (AGENTS.md, CONTEXT.md).
2. Check git status and recent commits.
3. Read any uncommitted work (progress notes, run records, etc.).
4. Ask the user: "I found [describe state]. Is this correct? What should I do
   next?"
5. Create a handoff packet for the recovered state once confirmed.

### Recovery With Handoff

If a handoff exists:

1. Read the handoff.
2. Verify the handoff claims against current file state.
3. If claims are verified, continue from the handoff's "next step".
4. If claims are stale, update the handoff and ask the user for confirmation.

## State Model For Long-Running Work

When work cannot finish in one session, the agent should maintain an external
state file.

### State File Shape

```text
Project:
Task:
Phase:
State: [orienting/scoping/exploring/implementing/verifying/closing/blocked]
Started:
Last updated:
Completed:
Remaining:
Verified:
Open questions:
Blockers:
Active files:
Next action:
```

The state file goes in `agents/handoffs/` or `harness/runs/` depending on
whether it is active work or a completed task.

## Relationship To Other Harness Docs

| Doc | Connection |
|-----|-----------|
| `primitives.md` | Defines Handoff Packet, Checkpoint, Progress Note, Run Record primitives used here. |
| `verification.md` | Defines verification levels used in checkpoint requirements. |
| `agent-delivery-contract.md` | Prescribes the minimum delivery loop that this lifecycle supports. |
| `agent-orchestration-loop.md` | Defines how subagent handoffs integrate with the lead agent's lifecycle. |
| `agent-learning-loop.md` | Uses failed recovery as a learning trigger. |
| `context-memory.md` | Explains why filesystem and git are the durable memory this lifecycle depends on. |
| `runs/run-record-schema.md` | Defines the run record surface used during closing. |
| `agents/handoffs/subagent-task-handoff.md` | Defines the handoff packet format. |

## Anti-Patterns

- **Session-as-state**: treating the chat window as the only source of truth
  for long-running work.
- **Checkpoint theater**: creating a progress note for every small step instead
  of at natural boundaries.
- **Infinite recovery**: trying to reconstruct full session state from git log
  alone. Use handoff packets for active work.
- **Bootstrap overload**: reading every file in the project before starting
  work. Bootstrap should be minimal and progressive.
- **No close**: finishing work without committing, recording, or handing off.
  Leaving the working tree dirty and the state implicit.
