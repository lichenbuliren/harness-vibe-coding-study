# Specs, Agent Files, and Workflow Design

This note distills the Specs, Agent Files & Workflow Design module from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
for this repository.

The goal is to define how repo-local agent instructions, specs, plans, workflow
state, validation, and learning capture should fit together.

## Source Set

- [AGENTS.md](https://github.com/agentsmd/agents.md)
- [agent.md](https://github.com/agentmd/agent.md)
- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [12 Factor Agents](https://www.humanlayer.dev/blog/12-factor-agents)
- [12-Factor AgentOps](https://www.12factoragentops.com/)

## Working Definition

Specs and agent files are the contract layer of a harness.

For this project:

```text
agent file = operating contract
spec = intent and acceptance boundary
plan = execution decomposition
workflow = recoverable state machine
```

The point is not to produce more Markdown. The point is to make agent work
reviewable, resumable, verifiable, and reusable.

## Core Claims

### 1. Agent Files Create A Predictable Instruction Surface

`AGENTS.md` and related proposals give coding agents a predictable place to find
project guidance. They work best when they are short, structured, and linked to
deeper local docs instead of duplicating every rule.

Sources: [AGENTS.md](https://github.com/agentsmd/agents.md),
[agent.md](https://github.com/agentmd/agent.md).

### 2. Instruction Precedence Must Be Explicit

If root, subdirectory, global, and tool-specific instruction files all exist,
agents need clear precedence rules. Otherwise they guess which rules win, and
different tools may behave differently.

Sources: [agent.md](https://github.com/agentmd/agent.md),
[AGENTS.md](https://github.com/agentsmd/agents.md).

### 3. Spec-Driven Work Is A Staged Workflow

Spec-driven development is not one big prompt. Spec Kit frames it as staged
work: constitution, specification, clarification, plan, tasks, analysis, and
implementation.

Sources: [GitHub Spec Kit](https://github.com/github/spec-kit),
[Thoughtworks SDD](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html).

### 4. Specs Should Be Living Artifacts When The Work Will Evolve

Disposable specs help with one-off tasks, but spec-anchored work gives future
agents traceability. Pushing all the way to spec-as-source too early can become
rigid and noisy.

Sources: [Thoughtworks SDD](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html).

### 5. Prompts, Context, And Control Flow Are Application Code

Production agent workflows should own their prompts, context packet shape,
state model, tool-call dispatch, and validation logic. These should not be
hidden inside black-box framework defaults.

Sources: [12 Factor Agents](https://www.humanlayer.dev/blog/12-factor-agents).

### 6. Small Focused Workflows Beat Monolithic Agents

Narrow workflows with explicit start, pause, resume, validation, and completion
rules are easier to reason about than a general-purpose agent that keeps looping
until something works.

Sources: [12 Factor Agents](https://www.humanlayer.dev/blog/12-factor-agents),
[12-Factor AgentOps](https://www.12factoragentops.com/).

### 7. Production Agent Work Needs A Learning Loop

A mature workflow is not just context and work. It includes validation and
learning capture: failures, fixes, evidence, and workflow changes should be
written back into the repo.

Sources: [12-Factor AgentOps](https://www.12factoragentops.com/).

## Workflow Model

This project will use:

```text
Context -> Work -> Validation -> Learning
```

### Context

Compile the smallest useful context packet:

- goal
- constraints
- relevant specs
- relevant instructions
- authoritative files
- known risks
- validation expectations

### Work

Do the work through the smallest suitable mechanism:

- direct answer
- deterministic command
- workflow
- single agent
- sub-agent research or implementation
- human decision

### Validation

Check work externally:

- tests
- lint/typecheck
- structural checks
- spec compliance
- review
- eval
- human approval for risk

### Learning

Write durable lessons back:

- update harness docs
- update agent instructions if broadly applicable
- update evals or checklists
- write evolution entries for stage-level outcomes
- record decisions in ADRs
- update run reports or handoffs

## Agent Instruction File Policy

### Canonical File

This repository uses `AGENTS.md` as the canonical root agent instruction file.

It should remain:

- short
- stable
- broadly applicable
- repository-wide
- a map to deeper docs

### Local Overrides

Use nested `AGENTS.md` files only for genuinely local rules.

Local files should answer:

- what differs here?
- what commands apply here?
- what docs should be read first?
- what verification is required here?

They should not repeat root instructions.

### Tool-Specific Files

Tool-specific instruction files should be avoided unless a tool requires them.
If they exist, they should reference the canonical root instructions rather than
forking the rules.

### Precedence

Use this precedence:

```text
direct user instruction
> local directory AGENTS.md
> root AGENTS.md
> durable project docs
> external examples or templates
```

External templates never override project-local context without review.

## Spec Lifecycle

Use specs when:

- the task is ambiguous
- the work is multi-step
- multiple files or domains are involved
- the output will evolve over time
- the work creates a reusable harness practice
- the work needs user review before implementation

Lifecycle:

```text
clarify -> specify -> review -> plan -> implement -> verify -> learn
```

### Clarify

Resolve intent, boundaries, success criteria, non-goals, risks, and review
gates.

### Specify

Write the behavior, constraints, artifacts, and acceptance criteria.

### Review

Check for contradictions, missing requirements, overbroad scope, and untestable
claims.

### Plan

Break implementation into small tasks with files, verification, and commit
boundaries.

### Implement

Execute the plan while preserving user changes and recording evidence.

### Verify

Run deterministic checks and any required review.

### Learn

Update docs, decisions, evals, experiments, or evolution logs when the result is
stage-level or reusable.

## Artifact Map

Use this repository map:

- `AGENTS.md`: root operating contract
- `CONTEXT.md`: current phase, terms, assumptions, and durable memory
- `docs/superpowers/specs/`: design specs created through brainstorming
- `docs/superpowers/plans/`: implementation plans
- `harness/`: reusable harness methodology
- `agents/`: roles, playbooks, handoffs
- `evals/`: validation criteria and checklists
- `experiments/`: experiments and reports
- `decisions/`: ADRs
- `docs/evolution/`: stage-level narrative learning

## Context Packet Format

For a workflow step, pass a compact packet:

```md
## Goal

What must be achieved.

## Scope

Files, directories, or systems in bounds.

## Inputs

Specs, plans, docs, source files, links, and constraints.

## Exclusions

What must not be changed or loaded.

## Current State

What is already done and verified.

## Required Output

Exact artifact or decision expected.

## Validation

How completion will be checked.

## Escalation

When to stop and ask for human input.
```

## State Model

Prefer visible state:

- git history
- specs and plans
- run records
- handoffs
- evolution logs
- explicit events or progress notes

Avoid hidden framework state that a future agent cannot inspect.

When a workflow needs runtime state, represent it as append-only events where
possible:

```text
started
context_loaded
clarified
planned
implemented
verified
blocked
approved
completed
learned
```

## Human Gates

Use human gates for:

- irreversible side effects
- broad scope changes
- unclear intent
- external publication
- production/deploy actions
- security or privacy exceptions
- accepting known risk

Do not use human gates for every low-risk command inside a defined boundary.

## Validation Gates

Every workflow should name its completion evidence.

Examples:

- file exists and is non-empty
- tests pass
- no forbidden directories
- link/index navigation works
- spec checklist passes
- reviewer approves
- human accepts risk

Model confidence is not validation.

## Learning Capture

Write learning back when:

- a harness practice is validated or rejected
- a repeated failure reveals a missing rule
- a workflow changes
- an eval or checklist is created
- a lab milestone teaches a reusable lesson
- a public-shareable takeaway emerges

Do not write every small task into evolution logs.

## Anti-Patterns

- Multiple root instruction files with divergent rules.
- Nested instruction files that repeat instead of specialize.
- Specs generated once and ignored after implementation.
- Huge spec bundles that are harder to review than the code.
- Hidden framework prompts and state.
- Monolithic agents with no pause/resume boundary.
- Unlimited loops with no validation or retry cap.
- Model output treated as proof of correctness.
- Human approvals hidden inside informal chat instead of explicit gates.
- Learning lost because it never reaches the repo.

## Adoption Checklist

Before creating a new agent workflow, answer:

- What is the canonical instruction source?
- What local override applies?
- What spec or task contract defines the work?
- What context packet is needed?
- What state must persist?
- What human gate exists?
- What validation gate proves success?
- What learning should be written back?
- What artifact should future agents read first?

## Source Reliability Notes

- `AGENTS.md` and `agent.md` are active ecosystem efforts, not identical
  standards. This repo uses `AGENTS.md` as the canonical file.
- Spec Kit behavior is version-sensitive; verify the installed CLI or template
  behavior before codifying exact commands.
- Thoughtworks' spec-driven-development article is a landscape analysis and
  tradeoff discussion, not a normative spec.
- 12 Factor Agents and AgentOps are practice-oriented guidance for production
  agents; this project uses their concepts as design constraints, not as a
  mandatory framework.
