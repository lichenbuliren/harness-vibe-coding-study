# Success Pattern Capture

> Priority: medium.
>
> Complements the standard-capture-loop.md. Both loops together make the
> project learn from failures and successes.

## Problem

The standard capture loop turns corrections, failed runs, and repeated friction
into project standards. This is essential for preventing repeat failures.

But a project that only captures failures is always learning what not to do. It
has no mechanism for learning what to do more of. Successful approaches,
effective workflows, and unexpectedly good outcomes are treated as one-off
events rather than reusable patterns.

## Pattern

When something goes unexpectedly well, capture the conditions that made it
possible so the project can reproduce them.

Use this loop:

```text
observe positive outcome -> identify contributing factors ->
assess reusability -> capture as pattern -> wire into workflows or standards ->
verify discoverability -> record in evolution
```

### Step 1: Observe Positive Outcome

A positive outcome can be:

- A task completed faster or with fewer iterations than expected.
- A verification step that caught something before it became a problem.
- A user reaction that was notably positive: "this is exactly what I needed."
- A subagent delegation that produced better-than-expected synthesis.
- A handoff that worked seamlessly across sessions.
- A documentation change that noticeably improved agent behavior.
- A tool or skill that performed significantly better than alternatives.

### Step 2: Identify Contributing Factors

Ask:

- What was different about this task compared to similar past tasks?
- Did the harness play a role? Which primitive specifically helped?
- Did the agent make a decision that turned out better than alternatives?
- Did the context, timing, or environment contribute?
- Was there a skill, tool, or workflow that made the difference?

Focus on factors that are:

- **repeatable**: the project can intentionally do it again.
- **attributable**: the project can identify what caused the outcome.
- **transferable**: the pattern can apply to other tasks, not just this one.

### Step 3: Assess Reusability

Not every success is reusable. Assess using:

| Question | Reusable If... |
|----------|---------------|
| Did the harness contribute? | The harness had a specific primitive or rule that helped. |
| Is the factor controllable? | The project can choose to use it again. |
| Is the outcome domain-independent? | The pattern works across different tasks. |
| Would future agents benefit? | The pattern would help an agent without this specific experience. |

If the success is one-off (lucky timing, unique user, non-reproducible
conditions), note it in the evolution entry as a data point but do not create
a pattern.

### Step 4: Capture As Pattern

Write the pattern in `docs/patterns/` as a standalone document or update an
existing pattern.

Each success pattern should answer:

| Question | Purpose |
|----------|---------|
| What went well? | The positive outcome. |
| What conditions made it possible? | The contributing factors. |
| How can the project reproduce it? | The repeatable steps. |
| When should it be used? | The trigger conditions. |
| When should it be skipped? | The anti-patterns and contraindications. |

### Step 5: Wire Into Workflows Or Standards

A captured pattern that is not wired will be forgotten. Wire it by:

- Adding a reference from `AGENTS.md` or `CONTEXT.md` if the pattern affects
  runtime behavior.
- Adding a step to a workflow doc if the pattern should be followed
  procedurally.
- Adding a checklist item to an eval checklist if the pattern should be
  verified.
- Updating the template if the pattern should travel to new projects.

### Step 6: Verify Discoverability

Before considering the pattern captured, verify that a future agent can find
it:

- The pattern file exists in `docs/patterns/`.
- `docs/patterns/index.md` references it.
- Relevant workflow docs reference it if applicable.
- `AGENTS.md` references it if runtime behavior depends on it.

### Step 7: Record In Evolution

Write an evolution entry noting:

- What was the positive outcome?
- What factors contributed?
- What pattern was captured?
- What surfaces were updated (pattern doc, index, workflow, template)?

## Relationship To The Standard Capture Loop

```
success-patterns.md: observe positive outcome → capture as repeatable pattern
standard-capture-loop.md: observe correction → capture as project standard

Together:
  failures → standard (don't repeat)
  successes → pattern (do repeat more)
```

The project needs both. A harness that only captures failures will be
risk-averse. A harness that only captures successes will be blind to
systematic problems.

## Anti-Patterns

- **False success**: attributing a positive outcome to harness when it was
  luck, timing, or a one-off insight. Assess rigorously before wiring.
- **Pattern for everything**: creating a pattern for every slightly positive
  outcome. Only capture what is clearly repeatable and beneficial.
- **Wiring without verification**: adding a pattern to AGENTS.md without
  testing whether agents actually benefit from it.
- **Success blindness**: celebrating a good outcome but not asking "why did
  this work?" — the single biggest missed opportunity for harness improvement.
