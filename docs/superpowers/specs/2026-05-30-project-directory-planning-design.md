# Project Directory Planning Design

Date: 2026-05-30
Status: Draft for user review
Methodology: superpowers:brainstorming

## Context

This project explores best practices for harness + vibe coding. The first stage
will produce an AI-agent-readable working system: project context, operating
rules, methodology notes, experiment records, evaluation criteria, and a real
validation project.

The repository should not start as a conventional application monorepo. It
should start as an Agent-First Living Lab: a place where AI agents can quickly
understand the project, act within clear boundaries, record evidence, and use a
real `lab/` project to validate the practices documented here.

## Goals

- Give coding agents a clear entry path into the repository.
- Separate durable context, execution rules, methodology, experiments,
  evaluations, and decisions.
- Preserve stage-level evolution records for future sharing.
- Keep the initial structure thin, avoiding premature engineering directories.
- Leave room for a real validation project to grow under `lab/`.

## Non-Goals

- Do not choose an application technology stack yet.
- Do not create `apps/`, `packages/`, `src/`, `scripts/`, `infra/`, or
  `benchmarks/` during the first structure pass.
- Do not implement harness tooling before the project has documented the
  harness concepts, boundaries, and run records it needs.
- Do not treat every small edit as an evolution milestone.

## Recommended Approach

Adopt the Agent-First Living Lab structure.

This balances three needs:

- A: Produce AI-agent-facing methodology and operating documents first.
- B: Preserve experiment and evaluation surfaces for harness comparison later.
- C: Grow a real validation project under `lab/` so the methodology is tested
  against actual development work.

The repository should use English directory names. Core entry documents should
be bilingual or bilingual-friendly; detailed methodology notes can start in
Chinese where that improves speed and precision.

## First-Version Directory Tree

```text
/
  AGENTS.md
  README.md
  CONTEXT.md

  docs/
    index.md
    principles/
      index.md
    workflows/
      index.md
    patterns/
      index.md
    tools/
      index.md
    evolution/
      index.md
      0001-project-directory-planning.md

  agents/
    index.md
    roles/
      index.md
    playbooks/
      index.md
    handoffs/
      index.md

  harness/
    index.md
    adapters/
      index.md
    runs/
      index.md

  experiments/
    index.md
    task-samples/
      index.md
    reports/
      index.md

  lab/
    README.md
    AGENTS.md

  evals/
    index.md
    rubrics/
      index.md
    checklists/
      index.md

  decisions/
    index.md
    0001-adopt-agent-first-living-lab.md
```

## Top-Level Entry Documents

### `AGENTS.md`

Purpose: agent operating contract.

It should answer:

- What is this repository for?
- How should agents navigate the directory structure?
- What workflows are preferred?
- What verification is required before claiming completion?
- What documentation should be updated after meaningful work?
- What actions should agents avoid?

It must include an Evolution Log Requirement:

```md
## Evolution Log Requirement

When a stage-level outcome is reached, update `docs/evolution/`.

A stage-level outcome includes:
- a project structure decision
- a methodology decision
- a completed experiment
- a meaningful lab milestone
- a reusable pattern or workflow being validated
- a public-shareable learning

Do not record every small edit. Record the method used, the questions asked, the
decision made, the artifacts produced, and the shareable takeaway.
```

### `README.md`

Purpose: human-facing project entrance.

It should answer:

- What is this project?
- Why does it exist?
- Who should read it?
- What stage is it in?
- How should someone navigate the repository?

The first version should be concise and bilingual-friendly: short English
headings plus Chinese explanation are acceptable.

### `CONTEXT.md`

Purpose: durable context for future agents and compressed sessions.

It should answer:

- Project intent
- Current phase
- Key terms
- Working assumptions
- Non-goals
- Open questions
- Recent decisions

It should also include a Knowledge Capture section:

```md
## Knowledge Capture

This project captures two kinds of memory:
- `decisions/`: concise ADR-style decision records
- `docs/evolution/`: narrative stage records for methodology, outcomes, and
  shareable lessons

Agents should update `docs/evolution/` after stage-level progress, especially
when a new practice has been validated or rejected.
```

## Directory Responsibilities

### `docs/`

Purpose: methodology and knowledge base.

Suggested subdirectories:

- `principles/`: stable principles and constraints
- `workflows/`: step-by-step operating workflows
- `patterns/`: reusable patterns discovered through use
- `tools/`: tool notes, installation guidance, and usage notes
- `evolution/`: narrative stage records for sharing and retrospection

### `docs/evolution/`

Purpose: stage-level project evolution log.

This is not a changelog. It records the story of how the project evolves:
methodology used, key questions, decisions, artifacts, outcomes, and shareable
takeaways.

`docs/evolution/index.md` should define the template:

```md
# Evolution Log

Use this directory to record stage-level project evolution.

Each entry should explain:
- what stage we were in
- what goal we pursued
- what methodology we used
- what questions or constraints shaped the work
- what outcome we reached
- what artifacts were produced
- what can be shared with others
- what remains open
```

The first entry should be:

```text
docs/evolution/0001-project-directory-planning.md
```

It should record:

- Stage: project initialization
- Goal: design an agent-first directory structure
- Methodology used: superpowers:brainstorming
- Key questions asked during design
- Outcome: adoption of Agent-First Living Lab
- Artifacts: spec, ADR, initialized directory tree
- Shareable takeaway: project directories should encode an AI agent's cognitive
  path, not merely categorize files

### `agents/`

Purpose: AI-agent-facing resources.

Suggested subdirectories:

- `roles/`: role definitions and responsibilities
- `playbooks/`: reusable execution workflows
- `handoffs/`: handoff formats and context transfer notes

It should help an agent answer: what role am I playing, what playbook should I
use, and how do I hand off state to another agent?

### `harness/`

Purpose: harness concept and integration surface.

Suggested subdirectories:

- `adapters/`: planned adapter boundaries and integration notes
- `runs/`: run records or run-recording conventions

In the first stage, this is documentation-first. Code can be introduced later
only after the project knows what needs to be automated.

### `experiments/`

Purpose: experiment design and evidence.

Suggested subdirectories:

- `task-samples/`: tasks used to test agent workflows
- `reports/`: experiment reports and retrospectives

Experiments answer: what did we try, under what conditions, and what happened?

### `evals/`

Purpose: quality standards and evaluation gates.

Suggested subdirectories:

- `rubrics/`: scoring criteria and qualitative evaluation standards
- `checklists/`: completion gates and repeatable checks

Evaluations answer: how do we judge whether an agent workflow or output is good?

### `lab/`

Purpose: real validation project.

`lab/` should contain a local `README.md` and `AGENTS.md` because the validation
project will eventually have its own development rules, test commands, and
learning feedback loops.

It should start simple. Its first responsibility is to verify that the
repository's agent-facing practices help real development, not to be a complex
product.

### `decisions/`

Purpose: concise ADR-style decision records.

The first ADR should be:

```text
decisions/0001-adopt-agent-first-living-lab.md
```

It should record why the project chose Agent-First Living Lab instead of a
docs-only methodology repository or product-first monorepo.

## Evolution Log vs Decisions

Use `decisions/` for concise, structured records of why a decision was made.

Use `docs/evolution/` for narrative stage records that explain how the project
progressed, what methodology was used, what artifacts were created, and what can
be shared later.

Both are needed:

- `decisions/` helps future agents avoid re-litigating settled choices.
- `docs/evolution/` helps humans and agents understand the journey and extract
  shareable lessons.

## Initialization Order

1. Create or update `CONTEXT.md`.
2. Create or update `AGENTS.md`.
3. Create or update `README.md`.
4. Create `docs/*/index.md` files.
5. Create `agents/*/index.md` files.
6. Create `harness/index.md`.
7. Create `experiments/index.md` and `evals/index.md`.
8. Create `lab/README.md` and `lab/AGENTS.md`.
9. Create `decisions/0001-adopt-agent-first-living-lab.md`.
10. Create `docs/evolution/0001-project-directory-planning.md`.

## Open Questions for Later

- What should the first `lab/` validation project be?
- Which harness surfaces should be documented first?
- What evaluation rubric should gate agent-generated project-structure work?
- When should the repository introduce executable scripts or schemas?

## Approval Gate

After this design is reviewed, the next step is to write an implementation plan
with the `superpowers:writing-plans` skill. Implementation should not begin
until that plan exists and is approved through the expected workflow.
