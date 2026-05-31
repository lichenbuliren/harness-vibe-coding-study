# Agent Learning Loop

This module defines how the project turns task friction into durable agent
behavior.

It is the canonical harness surface for self-improvement. Other files may
enforce or explain the rule, but this file owns the loop.

## Purpose

The delivery loop helps an agent finish the current task. The learning loop
helps the next agent avoid repeating the same failure.

Use it when a task reveals a reusable lesson through:

- user correction
- failed or weak verification
- review finding
- repeated friction
- documentation drift
- misplaced or missing evidence
- ambiguous ownership between `AGENTS.md`, `harness/`, `docs/standards/`,
  `evals/`, `docs/patterns/`, `decisions/`, and `docs/evolution/`

## Core Loop

```text
trigger -> observe -> classify -> choose surface -> update contract ->
verify discoverability -> record evolution -> return to mainline
```

This is a harness loop, not a prose habit. Each step should leave enough
evidence that another agent can understand what changed and why.

## Step 1: Trigger

Run the learning loop when new evidence suggests the project should learn.

Strong triggers include:

- the user says the agent missed, assumed, or skipped something
- a test, build, browser check, or validation script catches a gap
- a run record shows the same class of problem happened before
- a documentation rule is spread across multiple places without one owner
- a template or reusable artifact lacks a rule already validated here
- a side task changes the project direction or exposes a phase mismatch

Do not run the loop for every typo, local wording preference, or one-off
mistake. The threshold is reuse:

```text
Would a future agent benefit from seeing this before repeating the mistake?
```

## Step 2: Observe

Collect the smallest high-signal evidence set.

Use current state over memory when possible:

- exact user correction or review finding
- failing command, test, or screenshot result
- affected files and current documented rule
- existing run records, standards, or evolution entries
- current `CONTEXT.md` phase and active workflow

Avoid loading the whole repository into context. Use indexes, search, and
targeted file reads.

## Step 3: Classify

Classify the lesson before writing.

Common classifications:

- one-off execution mistake
- harness delivery rule
- agent learning rule
- directory or repository-structure standard
- documentation placement standard
- eval, rubric, checklist, or quality-gate rule
- lab or product implementation standard
- runtime agent rule
- template reuse rule
- skill candidate
- stage-level learning

If the lesson does not pass the reuse threshold, finish the task and mention the
local correction in the final response or run record. Do not create unnecessary
process.

## Step 4: Choose The Canonical Surface

Pick the smallest authoritative surface that the next agent will actually read.

| Surface | Use When |
| --- | --- |
| `AGENTS.md` | The rule must affect every future agent at runtime. |
| `harness/agent-learning-loop.md` | The rule changes how agents learn from corrections, failures, or drift. |
| `harness/agent-delivery-contract.md` | The rule changes delivery, verification, commits, evidence, or handoff expectations. |
| `docs/standards/` | The rule is mandatory and cross-cutting, but not specifically harness delivery. |
| `docs/patterns/` | The lesson is reusable and explanatory, but not mandatory by itself. |
| `evals/` | The lesson needs a checklist, rubric, gate, or repeatable quality test. |
| `experiments/` | The lesson comes from an experiment or should be tested as one. |
| `harness/runs/` | The lesson needs task-level traceability and evidence. |
| `docs/evolution/` | The lesson is stage-level, shareable, or changes project direction. |
| `decisions/` | The lesson settles a tradeoff future agents should not relitigate. |
| `templates/` | The lesson must travel to new projects by default or as an optional pack. |

Rules can require multiple surfaces. When that happens, keep one canonical owner
and add short pointers elsewhere.

## Step 5: Update The Contract

Make the durable change where it belongs.

Good updates are:

- specific enough to execute
- short enough to be read during a task
- linked from an index or runtime instruction
- clear about triggers and non-goals
- backed by evidence from the current task or prior records

Prefer tightening an existing rule over adding a new file. Add a new file only
when the concept needs an independent owner.

## Step 6: Verify Discoverability

Before claiming the project learned, verify a future agent can find the rule.

Minimum checks:

- the owning file exists
- relevant indexes mention it
- `AGENTS.md` points to it when runtime behavior depends on it
- template files include it when the behavior should travel to new projects
- required-file scripts or validation docs include it when applicable
- no stale wording contradicts the new rule

For docs-only changes, use search and file/path checks. For template changes,
run the template validation script.

## Step 7: Record Evolution

Create a `docs/evolution/` entry when the learning is stage-level, reusable, or
shareable.

The entry should capture:

- what triggered the loop
- what classification was chosen
- which surface became canonical
- what artifacts changed
- what future agents should do differently
- remaining risks or skill-candidate follow-up

Do not turn every small edit into an evolution entry.

## Step 8: Return To Mainline

Close with a continuity check:

```text
larger goal -> local learning captured -> current project position ->
next mainline step
```

If the learning changed the current phase, update `CONTEXT.md` or `README.md`.
Otherwise, report the mainline state in the final response.

## Relationship To The Agent Delivery Contract

The two loops are linked:

```text
delivery loop: implement -> test -> inspect -> verify -> record evidence
learning loop: evidence -> classify -> codify -> verify discoverability
```

The delivery loop proves the current task. The learning loop improves the
harness around future tasks.

## Relationship To Future Skills

This module is the skill seed.

A future `agent-learning-loop` or `standard-capture-loop` skill should package
the judgment loop, not the entire repository structure. The skill should:

- detect triggers
- ask or infer classification
- choose the canonical surface
- update or draft the rule
- verify discoverability
- propose evolution evidence

Do not publish the skill until it has its own eval tasks and a no-skill
baseline.

## Anti-Patterns

- apologizing for a repeated failure without changing the project contract
- writing an evolution entry but no executable future rule
- putting every lesson in `AGENTS.md`
- hiding cross-cutting standards inside `harness/`
- copying this study repository wholesale into product templates
- treating memory as truth without checking current files
- calling a template or skill ready without validation evidence
