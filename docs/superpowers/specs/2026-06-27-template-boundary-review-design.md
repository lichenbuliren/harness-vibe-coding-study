# Template Boundary Review Design

## Goal

Define the reusable boundary for a future `harness-creator` and
`harness-doctor` without implementing either product in this feature.

The result must identify what belongs in a shared contract-first core, what is
specific to each skill, and what must remain project-owned state or narrative.

## Success Criteria

This feature is complete when the repository contains:

- one authoritative asset classification matrix;
- explicit inclusion and exclusion rules for reusable artifacts;
- the canonical feature-state and initialization contracts;
- the first implementation slice for the future shared core;
- verification that all decisions agree with `CONTEXT.md`.

No creator, doctor, shared runtime, or generated target-project file is created
by this feature.

## Chosen Approach

Use a contract-first shared core with two thin product entrypoints.

```text
                    shared core
          schema / rules / detection / evidence
                    /           \
             creator             doctor
        generate / improve   inspect / explain
```

Static shared artifacts define contracts and deterministic behavior.
Repository-specific files are generated or merged from inspected facts.

This replaces the existing template-first approach, which mixes reusable rules
with placeholder project content and fixed-path assumptions.

## Canonical Layers

### Shared Core

The shared core owns:

- the five-subsystem vocabulary;
- capability detection rules;
- feature-state schema;
- maturity and evidence schema;
- diagnostic JSON schema;
- reusable invariants;
- fixture definitions and expected results;
- safe file-operation policies.

It does not own project facts, current task state, or user-specific decisions.

### Creator

The creator owns:

- target-repository inspection;
- non-destructive generation and merge behavior;
- conditional bootstrap-task creation;
- project-specific rendering;
- setup guidance;
- post-change revalidation.

The creator may write only after presenting its intended changes. Existing
files are preserved unless overwrite or replacement is explicitly approved.

### Doctor

The doctor owns:

- read-only evidence collection;
- Readiness and Effectiveness separation;
- five-dimensional maturity classification;
- candidate-bottleneck identification;
- confidence and uncertainty reporting;
- prioritized remediation;
- handoff of safe changes to the creator.

The doctor does not modify the target repository.

### Project-Owned

The target project owns:

- its mission, scope, and canonical domain language;
- real feature rows and dependencies;
- current progress and blockers;
- handoff content;
- verification evidence;
- decisions and evolution history;
- runtime-specific commands and local paths.

These facts cannot be copied from this study repository or shipped as filled
template content.

## Asset Classification

| Existing asset | Boundary | Decision |
|---|---|---|
| `SKILL.md` workflow | Creator-only | Rewrite around contract-first generation |
| `templates/agents.md` | Creator-only | Keep invariant fragments; render project facts |
| `templates/feature-list.schema.json` | Shared core | Replace with canonical feature contract |
| `templates/feature-list.json` | Exclude | Do not ship fictional business features |
| `templates/progress.md` | Creator-only | Generate a minimal project-specific state file |
| `templates/session-handoff.md` | Creator-only | Generate only when complexity requires it |
| `templates/init.sh` | Creator-only | Replace with check-first, side-effect-free rendering |
| `scripts/create-harness.mjs` | Creator-only | Rebuild over shared detection and contracts |
| `scripts/validate-harness.mjs` | Shared core | Replace total score with maturity profile |
| `scripts/run-benchmark.mjs` | Shared core | Split fixture contracts from field experiments |
| HTML assessment renderer | Doctor-only | Render canonical JSON; do not rescore |
| Reference documents | Evidence input | Admit only validated rules into the core |
| This repo's `CONTEXT.md` | Project-only | Reuse its content contract, never its facts |
| This repo's feature/progress data | Project-only | Use as evidence, not template payload |
| `docs/evolution/` | Project-only | Never copy historical narratives into targets |

## Context Contract

`CONTEXT.md` is capability-based, not filename-mandatory.

An equivalent durable-context artifact must cover:

- Mission;
- Scope and non-goals;
- Canonical language;
- product or architecture boundaries;
- evidence status;
- restart assumptions.

Creator initialization runs a context capability check first.

If the capability is missing or incomplete, creator adds a real
`Project Context Restoration` bootstrap feature. It guides the user through
missing facts and blocks later extraction or product work.

Creator must not invent facts or fill the file with placeholders to satisfy a
structural check.

## Feature-State Contract

Every feature item contains:

```text
id
name
behavior
dependencies
status
verification
evidence
```

Canonical states:

```text
not-started -> next -> in-progress -> done
                         |
                         -> blocked
```

Rules:

- serial mode permits exactly one `next` or `in-progress` feature;
- `done` requires successful verification evidence;
- verification contains executable commands or explicit manual checks;
- evidence records results, not confidence language;
- multi-agent work requires explicit ownership before relaxing serial mode.

The shared core ships the schema. Creator writes only real bootstrap or product
features inferred from the target project.

## Progress And Handoff

State continuity is required, but two fixed files are not.

- `progress.md` is the default lightweight state surface.
- `session-handoff.md` is generated only for multi-session, multi-agent, or
  otherwise complex work.
- An equivalent project artifact may satisfy either capability.
- Doctor checks whether work can be reconstructed, not whether both filenames
  exist.

The shared core defines required information. The target project owns all
current content.

## Initialization Contract

Generated `init.sh` is check-first and idempotent.

It may:

- identify the stack and package manager;
- verify required project artifacts;
- report missing dependencies;
- run already-configured checks;
- print actionable next steps.

It must not, by default:

- access the network;
- install dependencies;
- modify lockfiles;
- start long-running services;
- rewrite project configuration.

Setup is a separate creator action and requires explicit intent when it can
change the repository or external environment.

## Diagnostic Contract

Doctor evaluates capabilities rather than exact file names.

Each of Instructions, Tools, Environment, State, and Feedback receives one
maturity level:

- `0 Missing`;
- `1 Present`;
- `2 Operational`;
- `3 Evidenced`.

The canonical output is JSON. Human-readable terminal, Markdown, and HTML
reports render that result without changing its conclusions.

Readiness evidence proves that a capability is discoverable and executable.
Effectiveness evidence requires representative task outcomes. A structural
check cannot claim actual effectiveness.

## Safety And Error Handling

All discovery is read-only and bounded to the target repository unless the user
explicitly provides another evidence source.

Unknown files or unsupported project shapes produce `unknown` evidence, not a
negative assertion.

Creator plans changes before writing. It skips existing files by default and
reports conflicts with an actionable next step.

Partial generation must be restartable. Every write result is reported as
created, merged, skipped, or blocked.

## Verification Strategy

Future implementation requires two evidence layers:

### Contract Fixtures

Fixtures remove or weaken one capability at a time. Expected JSON proves that
doctor detects the correct gap and that creator improvements change only the
intended result.

Required initial fixtures:

- empty repository;
- instructions only;
- complete structure without executable verification;
- operational minimal harness;
- non-standard equivalent filenames;
- existing files that creator must not overwrite.

### Field Experiments

Representative real tasks compare baseline and harness-assisted runs using:

- verified completion rate;
- completion time;
- correction loops;
- session count;
- restart cost.

Fixture success proves tool consistency. Field evidence is required before a
rule becomes `validated` or `canonical`.

## First Implementation Slice

The next feature should create only the shared contract package:

```text
skills/harness-core/
  schemas/
    feature-list.schema.json
    assessment.schema.json
  rules/
    capabilities.json
  fixtures/
  scripts/
    inspect-harness.mjs
```

The slice should:

- emit deterministic JSON for Readiness evidence;
- contain no creator writes;
- contain no HTML renderer;
- contain no field-effectiveness claim;
- pass fixture contract tests.

Creator and doctor skill entrypoints should follow as separate features after
the shared contract proves stable.

## Explicit Exclusions

This boundary review does not:

- package or install skills;
- create a standalone CLI;
- copy the existing external skill into this repository;
- migrate a real target project;
- implement auto-fix;
- claim the theory is effective without field evidence.

