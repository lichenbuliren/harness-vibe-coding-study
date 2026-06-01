# Minimum Project Template Skeleton

This document designs the first reusable skeleton for a real product project
with Agent-First Living Lab harness surfaces.

It is not a packaged template yet. It defines the minimum files, optional source
and domain packs, initialization flow, and readiness criteria for a future
template.

## Goal

Help a new project start with enough harness structure that agents can:

- understand the project quickly
- preserve the mainline across long sessions
- delegate bounded work without losing context
- verify claims before completion
- capture stage-level evolution
- turn reusable corrections into standards

## Non-Goals

- Do not include application source code in the default core.
- Do not prescribe a product stack unless an app pack is selected explicitly.
- Do not include mobile-specific checks by default.
- Do not publish a public skill.
- Do not package every document from this study project.
- Do not assume all projects need experiments, evals, and research-lab depth on
  day one.

## Skeleton Principles

Use the weakest reusable form that works.

The skeleton should include structure and contracts, while leaving domain
content empty or example-driven.

```text
required map -> thin entry docs -> evidence contracts ->
optional domain packs -> project-specific content
```

Think of the core as an operating and evidence spine, not a copy of this study
repository.

The skeleton should bias toward:

- small Markdown entry files
- clear ownership of each directory
- explicit current phase and goal
- recoverable evidence records
- indexed standards and decisions
- optional expansion instead of heavy defaults
- "listed means present": every required file named by an index must exist

## Required Skeleton

### Root

- `README.md`: human-facing overview, current phase, and reading path.
- `CONTEXT.md`: durable project intent, current phase, key terms, decisions,
  and current artifacts.
- `AGENTS.md`: portable runtime contract for future agents. It should be
  stripped of this study project's phase restrictions, local paths, model
  assumptions, and runtime-specific state.
- `.gitignore`: project-specific ignore rules.

Why required: these files form the first working set for both humans and
agents.

### `docs/`

- `docs/index.md`: documentation map and placement rule.
- `docs/evolution/index.md`: evolution-log purpose and entry list.
- `docs/standards/index.md`: standards surface and routing rule.
- `docs/patterns/index.md`: reusable patterns entry.
- `docs/workflows/index.md`: workflows entry.
- `docs/tools/index.md`: optional tools and skills entry.
- `docs/principles/index.md`: principles entry.

Required starter content:

- `docs/standards/mainline-continuity.md`
- `docs/patterns/standard-capture-loop.md`

Why required: these are the minimum durable docs that teach future agents where
to place knowledge and how to avoid losing the mission.

### `agents/`

- `agents/index.md`: agent execution surfaces.
- `agents/roles/index.md`
- `agents/roles/default-agent-roles.md`
- `agents/handoffs/index.md`
- `agents/handoffs/subagent-task-handoff.md`
- `agents/playbooks/index.md`
- `agents/playbooks/subagent-delegation.md`

Why required: agent-first projects need role selection, bounded delegation, and
handoff formats from the start, even if they do not spawn subagents on every
task.

### `harness/`

- `harness/index.md`
- `harness/agent-learning-loop.md`
- `harness/agent-orchestration-loop.md`
- `harness/capability-discovery.md`
- `harness/agent-delivery-contract.md`
- `harness/runs/index.md`
- `harness/runs/run-record-schema.md`

Why required: this is the minimum harness surface for delivery behavior, run
records, verification, recovery, self-improvement, multi-agent coordination,
and capability selection.

### `evals/`

- `evals/index.md`
- `evals/rubrics/index.md`
- `evals/rubrics/harness-validation-rubric.md`
- `evals/checklists/index.md`

Why required: the skeleton needs a place to define quality gates before the
project creates many task-specific checklists.

### `experiments/`

- `experiments/index.md`
- `experiments/reports/index.md`
- `experiments/task-samples/index.md`

Why required: not every project starts with experiments, but an agent-first lab
needs a place to separate "what happened" from "how quality is judged".

### `decisions/`

- `decisions/index.md`
- `decisions/0001-adopt-agent-first-living-lab.md`

Why required: future agents need a concise decision surface for choices that
should not be relitigated.

## Optional Packs

### Frontend React TypeScript Pack

Include when the new project is a single frontend product and should start with
root-level source code.

- `package.json`
- `index.html`
- `src/`
- Vite, TypeScript, ESLint, and Vitest config files

Why optional: a product project needs a clear source entrypoint, but the core
harness template should not force React on CLI tools, services, libraries, or
methodology repositories.

### Research Lab Pack

Include only when the repository is itself a methodology, research, or
multi-sample validation project.

- `lab/README.md`
- `lab/AGENTS.md`
- guidance for placing multiple validation projects under `lab/<sample-name>/`

Why optional: `lab/` is useful for a harness-study repository like this one, but
it is misleading in a real product repository where the product is the project.

### Mobile App Pack

Include only when the project validates mobile UI or phone access paths.

- `evals/checklists/mobile-ui-state-feedback.md`
- `evals/checklists/mobile-interaction-performance.md`
- LAN URL verification guidance
- secure-context note
- browser viewport guidance

### Superpowers Pack

Include when the project uses Superpowers-style specs and plans.

- `docs/superpowers/specs/`
- `docs/superpowers/plans/`
- workflow notes for brainstorming, specs, and implementation plans

### Experiment Depth Pack

Include when the project is intentionally running research-style experiments.

- experiment report template
- task sample template
- stronger rubric scoring guidance

### Public Skill Candidate Pack

Include when the project is preparing portable skills.

- skill candidate notes
- no-skill baseline plan
- eval task set
- install guidance

### Example Project Pack

Include only as examples, not default obligations.

- Dinner Picker-style app example
- concrete run records
- experiment reports
- historical rubric scoring examples

### Runtime Integration Pack

Include only when the target environment uses the same runtime assumptions.

- OMX-specific state guidance
- platform-specific tool notes
- local automation conventions
- commit-message conventions such as Lore-style trailers

## Initialization Flow

1. Create the required skeleton files.
2. Fill `README.md` and `CONTEXT.md` with project-specific intent.
3. Keep root `AGENTS.md` short and navigational.
4. Write the first decision record.
5. Define the first current phase and next learning goal.
6. Add only optional packs that match the project domain. For product source,
   prefer an explicit app pack over a default `lab/` container.
7. Create the first evolution entry when the initialization decision is made.
8. Run the structure check and commit.

Do not copy historical evolution entries as if they already happened in the new
project. Historical records may be included only as examples in an optional
example pack.

## Adaptation Fields

Every new project should replace these fields:

- project name
- project intent
- current phase
- key terms
- non-goals
- source entrypoint or selected app pack
- default verification gates
- optional packs selected
- first decision record date and context

## Readiness Criteria

The skeleton is ready to become a real template only when:

- a clean new project can be initialized from it without this study project's
  Dinner Picker specifics
- a future agent can read `README.md`, `CONTEXT.md`, and `AGENTS.md` and know
  where to work next
- a default initialized product project does not contain `lab/`, `src/`, or
  `package.json` unless an explicit pack created the source scaffold
- directory indexes point to every included required file
- every mandatory file listed by an index exists
- no local absolute paths, generated runtime state, model tables, or
  current-project phase constraints leak into the core
- optional packs are clearly separated from the core skeleton
- the first run record, eval/checklist result, and evolution or decision record
  can be created from blank templates without hidden context
- template docs explain what to delete, keep, or customize
- at least one dry run initializes a separate test project successfully
- a critic review can approve or reject the skeleton using file existence, role
  clarity, and evidence-path completeness

## Risks

- The current evidence comes from one lab project, so the skeleton should stay
  minimal.
- A copied `AGENTS.md` can overfit to this repo, the current phase, or the
  runtime environment.
- Too many default docs can make the template feel bureaucratic before the
  project earns the weight.
- Too few default docs can make agents lose the mainline or skip evidence.
- Mobile-specific rules should not become universal defaults.
- Skeleton files can imply evidence exists before the new project has produced
  any; indexes and examples must make blank state clear.
- Subagents can become process bloat unless the smallest useful role set remains
  the rule.
- Public skill candidates need separate evals before being bundled as skills.

## Next Step

Design a real template directory or generator only after this skeleton passes a
dry-run initialization review.
