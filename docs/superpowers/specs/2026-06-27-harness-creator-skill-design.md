# Harness Creator Skill Design

## Goal

Build a non-destructive `harness-creator` skill over the shared core. It must
inspect before writing, make its intended changes reviewable, preserve project
facts, and leave a target repository with a minimal restartable harness.

The first implementation must also answer the accepted product question:
initialization includes a real default task that guides the user or agent to
complete project-specific `CONTEXT.md` content when the context capability is
missing.

## Baseline

The machine-local creator is the implementation seed. It contributes:

- bounded project and package-manager detection;
- a short root agent contract;
- feature, progress, handoff, and initialization artifacts;
- explicit verification command discovery;
- skip-existing behavior.

The new product rejects these legacy behaviors:

- `--force` overwrite;
- a fixed file checklist as the capability model;
- placeholder product features;
- dependency installation inside `init.sh`;
- the old Instructions/State/Verification/Scope/Lifecycle score;
- creation and diagnosis coupled in one script.

The canonical model remains Instructions, Tools, Environment, State, and
Feedback. Scope Control, Verification, and Lifecycle remain operating
mechanisms.

## Approaches Considered

### One-shot create with skip-existing

Simple, but a printed preview is not enforceable. The target can change between
review and write, and partial execution is hard to resume safely.

### Interactive confirmation inside the command

Provides a pause but is hostile to agents, CI, and deterministic testing.
Terminal prompts also do not prove which exact plan was accepted.

### Deterministic plan plus plan-bound apply

`plan` is read-only and emits a deterministic document. `apply` requires the
same `planId`, recalculates current state, and rejects stale plans. This is the
selected approach because it is explicit, automation-friendly, and testable.

## Command Contract

```text
creator plan --target <directory> [--agent-file AGENTS.md|CLAUDE.md]
  [--with-handoff] [--format text|json] [--pretty]

creator apply --target <directory> --plan-id <sha256>
  [--agent-file AGENTS.md|CLAUDE.md] [--with-handoff]
  [--format text|json] [--pretty]

creator --help
```

Text is the default. `--pretty` is valid only with JSON.

`plan` never writes. `apply` accepts only a matching current `planId`. Invalid
arguments, stale plans, unsafe paths, inspection failures, or blocked writes
exit `2`. A successful partial plan with intentional `skipped` actions exits
`0`.

JSON output is deterministic and contains no host paths, timestamps, random
IDs, or total score.

## Plan Contract

A plan contains:

```text
schemaVersion
target
planId
assessmentBefore
options
actions[]
```

Actions are in stable path order and contain:

```text
path
capability
operation
reason
precondition
content
```

Operations are `create`, `merge`, `skip`, or `block`.

`precondition` is either `missing` or the SHA-256 digest of the exact existing
file used to build a semantic merge. `content` is the complete intended result
for `create` and `merge` actions. This makes the plan independently reviewable.

The `planId` is SHA-256 over the canonical plan payload without `planId`,
including preconditions and intended content. Replanning the same tree and
options produces the same ID. Any relevant target change invalidates the old
ID even when the high-level Readiness profile is unchanged.

`apply` returns the accepted plan, per-action results, and
`assessmentAfter`. Results use `created`, `merged`, `skipped`, or `blocked`.

## Minimal Generated Harness

Creator may create:

- `AGENTS.md` or `CLAUDE.md` when no equivalent instruction capability exists;
- `feature_list.json` using the canonical shared schema;
- `progress.md` as the default continuity surface;
- `init.sh` as a check-first entrypoint;
- `.harness/manifest.json` when no manifest exists;
- `session-handoff.md` only with `--with-handoff`.

It never creates filled project history, ADRs, evolution records, or invented
product features.

### Context Bootstrap

Creator never fabricates `CONTEXT.md`.

If the shared assessment lacks operational context evidence, Creator ensures
feature state contains:

```text
id: harness-context-restoration
name: Project Context Restoration
behavior: Complete project-owned mission, scope, canonical language,
          product or architecture boundaries, evidence status, and restart
          assumptions in CONTEXT.md or a declared equivalent.
status: next or not-started
verification: explicit manual review steps
evidence: []
```

For a new feature list this is the sole `next` feature. For an existing valid
serial feature list, Creator performs a semantic merge:

- do nothing if an equivalent bootstrap feature already exists;
- append as `next` when no feature is active;
- append as `not-started` when another feature is already active;
- preserve every existing feature byte-for-byte at the object-value level;
- block rather than rewrite legacy, malformed, or ambiguous state.

This task is the default initialization guide for completing `CONTEXT.md`.

## Generated Initialization

Generated `init.sh` is idempotent and check-first. It:

- checks declared harness paths;
- checks required command executables with `command -v`;
- prints discovered verification commands;
- points to the active feature and progress surface.

It does not install dependencies, access the network, modify lockfiles, rewrite
configuration, start services, or run setup. Project verification remains
explicit and discoverable; setup is a separate future action requiring intent.

## Safety And Atomicity

All target paths are repository-relative and pass the shared path-safety
boundary. Symlink escapes are blocked.

Before the first write, `apply` validates the full plan and every destination.
New files use exclusive creation. A semantic merge re-reads and validates the
feature document before replacement. If preflight fails, no writes occur.

Creator does not offer overwrite, delete, force, fetch, install, or arbitrary
command execution.

## Skill Boundary

`skills/harness-creator/SKILL.md` stays concise. It instructs the agent to:

1. run `plan`;
2. present the complete plan and candidate risks;
3. run `apply` only with the presented `planId`;
4. report every result;
5. run Doctor after application;
6. ask the user or agent to complete the context restoration task rather than
   inventing project facts.

The source skill imports this repository's shared core. A self-contained
distribution bundle belongs to `feat-011`.

## Verification

Contract tests cover:

- official skill validation;
- stable plans and plan IDs;
- zero writes during planning;
- empty, partial, operational, non-standard, malformed, and conflict fixtures;
- stale plan rejection;
- exclusive creation and preflight atomicity;
- canonical context bootstrap creation and merge;
- no overwrite, install, network, command execution, or host-path leakage;
- repeat apply stability;
- before/after Doctor readiness.

Fixture readiness proves product consistency, not task Effectiveness.

## Out Of Scope

- overwriting or deleting project files;
- dependency installation or environment setup;
- arbitrary template packs;
- interactive terminal prompts;
- automatic project-fact generation;
- level 3 evidence or Effectiveness claims;
- distribution packaging and field experiments.
