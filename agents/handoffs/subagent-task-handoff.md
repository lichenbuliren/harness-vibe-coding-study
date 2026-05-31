# Subagent Task Handoff

Use this format when the main agent delegates bounded work to a subagent.

The purpose is to keep local exploration from losing the larger project
direction. The main agent owns the mission, scope, integration, and final
decision. The subagent owns the bounded investigation or implementation slice.

## Task Packet From Main Agent

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

## Required Fields

`Mainline goal` states the larger project direction the subtask supports.

`Why this subtask exists` explains the link between the local task and the
mainline. This prevents the subagent from optimizing the wrong thing.

`Exact subtask` defines the bounded job.

`Out of scope` names tempting branches the subagent should not pursue.

`Files or sources to read first` keeps context loading focused.

`Expected output` defines the artifact or answer the main agent needs.

`Required evidence` names checks, citations, file paths, screenshots, command
results, or reasoning required to trust the result.

`Return format` makes the report easy to integrate.

`Stop condition` tells the subagent when to stop and report instead of
continuing to explore.

## Return Report To Main Agent

```text
Subtask result:
Evidence:
Files changed or inspected:
Risks and gaps:
Rejected branches:
Recommended integration:
Mainline impact:
```

## Main Agent Integration Checklist

After the subagent reports, the main agent must:

- decide whether to accept, reject, or partially integrate the result
- verify important claims instead of blindly trusting the report
- update the relevant artifact or explain why no update is needed
- close the subagent lifecycle
- run a mainline continuity check

The close-out check is:

```text
mainline goal -> subtask result -> integrated decision -> next mainline step
```

## Anti-Patterns

- delegating without a mainline goal
- asking a subagent to "research everything"
- accepting a report without evidence
- leaving the subagent result unintegrated
- allowing subagent recommendations to silently change project direction
