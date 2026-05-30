# Run Record Schema

A run record is the durable evidence package for an AI-agent task.

It should be detailed enough for a future agent or human reviewer to understand
what happened without replaying the full chat transcript.

## When To Write One

Write a run record when a task is:

- part of `lab/` validation
- an experiment under `experiments/`
- a meaningful harness-methodology test
- a failed attempt that produced reusable learning
- a long-running task that another agent may need to resume

Do not write a run record for every small documentation edit.

## File Naming

Use this pattern:

```text
harness/runs/YYYY-MM-DD-<short-task-name>.md
```

Examples:

- `harness/runs/2026-05-30-directory-contract-eval.md`
- `harness/runs/2026-05-30-first-lab-task.md`

## Required Sections

### Summary

- task name
- date
- agent/session owner
- project phase
- outcome: `completed`, `partial`, `failed`, or `abandoned`

### Task

- user goal
- starting context
- constraints
- expected artifacts
- success criteria

### Harness Setup

- entry documents read
- relevant instructions
- tools used
- subagents used, if any
- sandbox or runtime assumptions
- model/client assumptions when known

### Method

- plan followed
- key decisions
- alternatives rejected
- changes made

### Trace Summary

Capture the important trajectory, not the full transcript:

- files inspected
- commands run
- external sources consulted
- failures or retries
- handoffs or subagent outputs
- moments where the plan changed

### Artifacts

List created or changed artifacts:

- docs
- code
- eval files
- experiment reports
- screenshots or logs
- commits

### Verification

Record the exact checks used:

- command
- result
- relevant output summary
- known gaps

### Evaluation

Score the run against the active rubric:

- context use
- task execution
- verification
- recoverability
- evolution capture
- safety/constraints

### Learning

- what worked
- what failed
- what should become a pattern
- what should become an eval
- what should be changed in the harness

### Follow-Up

- next task
- open questions
- blockers
- links to related evolution entries or decisions

## Template

```markdown
# <Run Title>

## Summary

- Date:
- Owner:
- Phase:
- Outcome:

## Task

- Goal:
- Starting context:
- Constraints:
- Expected artifacts:
- Success criteria:

## Harness Setup

- Entry documents:
- Instructions:
- Tools:
- Subagents:
- Runtime assumptions:

## Method

## Trace Summary

## Artifacts

## Verification

## Evaluation

## Learning

## Follow-Up
```

## Quality Bar

A good run record lets a future reader answer:

- What was the task?
- What did the agent rely on?
- What changed?
- How was it verified?
- What evidence exists?
- What should happen next?

