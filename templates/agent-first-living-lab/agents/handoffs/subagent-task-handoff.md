# Subagent Task Handoff

Use this format when the main agent delegates bounded work.

The canonical orchestration process lives in
`../../harness/agent-orchestration-loop.md`. This file defines the packet and
return-report format used by that loop.

## Task Packet

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

## Return Report

```text
Subtask result:
Evidence:
Files changed or inspected:
Risks and gaps:
Rejected branches:
Recommended integration:
Mainline impact:
```
