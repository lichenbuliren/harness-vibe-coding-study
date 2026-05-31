# Agent Learning Loop

This module defines how the project turns task friction into durable agent
behavior.

Use it when a task reveals a reusable lesson through user correction, failed
verification, review findings, repeated friction, documentation drift, or
misplaced evidence.

## Core Loop

```text
trigger -> observe -> classify -> choose surface -> update contract ->
verify discoverability -> record evolution -> return to mainline
```

## Trigger Threshold

Ask:

```text
Would a future agent benefit from seeing this before repeating the mistake?
```

If yes, run the loop. If no, handle the local correction without adding process.

## Classification

Classify the lesson before writing:

- one-off execution mistake
- harness delivery rule
- agent learning rule
- directory or documentation standard
- eval, rubric, checklist, or quality-gate rule
- implementation standard
- runtime agent rule
- template reuse rule
- skill candidate
- stage-level learning

## Canonical Surfaces

Pick the smallest surface future agents will actually read:

- `AGENTS.md` for runtime rules
- `harness/agent-learning-loop.md` for learning-loop behavior
- `harness/agent-delivery-contract.md` for delivery and verification rules
- `docs/standards/` for mandatory cross-cutting rules
- `docs/patterns/` for reusable explanations
- `evals/` for checklists, rubrics, and gates
- `harness/runs/` for task evidence
- `docs/evolution/` for stage-level learning
- `decisions/` for tradeoffs future agents should not relitigate

When several surfaces are needed, keep one canonical owner and add short
pointers elsewhere.

## Verification

Before claiming the project learned, verify discoverability:

- the owning file exists
- relevant indexes mention it
- runtime rules point to it when required
- template files include it when the behavior should travel
- no stale wording contradicts the new rule

## Relationship To Delivery

```text
delivery loop: implement -> test -> inspect -> verify -> record evidence
learning loop: evidence -> classify -> codify -> verify discoverability
```

The delivery loop proves the current task. The learning loop improves future
tasks.

## Skill Candidate

This file is a seed for a future `agent-learning-loop` or
`standard-capture-loop` skill. Package the judgment loop only after separate
skill evals and a no-skill baseline exist.
