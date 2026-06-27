# Harness Direct Installation Design

## Goal

Make the generated `harness-engineering` plugin directly usable in a new Codex
session from this repository, while preserving the accepted one-core,
two-entrypoint product boundary.

The canonical invocation surface is:

```text
$harness-engineering:harness-creator
$harness-engineering:harness-doctor
```

No bare-name compatibility layer is added. The existing machine-local
`$harness-creator` may coexist, but it is not part of this product.

## Verified Baseline

An isolated `CODEX_HOME` experiment proved that the current generated plugin:

1. can be exposed through a local marketplace;
2. can be installed and enabled with the Codex plugin CLI;
3. is discovered by a fresh `codex debug prompt-input` process under both
   canonical names;
4. can run packaged Creator plan/apply outside this repository;
5. creates the default `Project Context Restoration` task;
6. produces a passing `init.sh`;
7. can be reassessed by the packaged Doctor.

The experiment also exposed two missing product contracts:

- the repository has no marketplace or one-command install entrypoint;
- Doctor emits a compound environment recommendation even when the
  initialization requirement is already satisfied.

## Approaches Considered

### Install loose skills into `~/.agents/skills`

This preserves a short bare name, but duplicates distribution logic, weakens
the one-plugin boundary, and makes the shared core harder to version. Rejected.

### Add bare-name aliases beside the plugin

This keeps familiar calls but introduces two additional installed artifacts,
collision migration, and another compatibility contract. Rejected.

### Use the standard plugin namespace

The repository becomes an explicit local marketplace, the plugin remains the
only distribution unit, and Codex owns skill namespacing. Selected.

## Marketplace Contract

The repository contains `.agents/plugins/marketplace.json` with:

- marketplace name `harness-engineering-local`;
- one local plugin entry named `harness-engineering`;
- source path `./plugins/harness-engineering`;
- installation policy `AVAILABLE`;
- authentication policy `ON_INSTALL`;
- category `Developer Tools`.

`plugins/harness-engineering` is generated and ignored. It is never an editable
source tree.

## Installer Contract

```text
node scripts/install-harness-plugin.mjs
```

The installer:

1. packages Creator, Doctor, and one shared core into a staged bundle;
2. applies one Codex cachebuster suffix to the generated manifest version;
3. publishes the complete bundle at `plugins/harness-engineering`;
4. registers this repository as the local marketplace when needed;
5. installs `harness-engineering@harness-engineering-local`;
6. verifies the installed plugin is enabled at the expected version;
7. emits deterministic JSON fields plus the two canonical skill names.

The source packager remains deterministic at version `0.1.0`. Only the local
install artifact receives the cachebuster required for reliable reinstall.

The installer accepts explicit marketplace-root, Codex binary, and cachebuster
overrides for isolated tests. Defaults target this repository, `codex` on
`PATH`, and a UTC timestamp cachebuster.

It may replace only a generated `plugins/harness-engineering` directory whose
manifest identifies the expected plugin. An unexpected existing directory is a
hard failure.

## Recommendation Contract

Capability rules retain their operational requirement groups, but each group
gets its own recommendation message. Doctor combines only the messages for
unsatisfied groups.

For the environment subsystem:

- missing `environment.file` recommends adding environment metadata;
- missing `initialize.executable` recommends adding a check-first
  initialization command;
- when only one requirement is missing, the satisfied requirement is not
  mentioned.

This behavior applies consistently across all five subsystems.

## Verification

Automated tests cover:

- marketplace schema and plugin source shape;
- installer argument validation and safe replacement;
- cachebuster version replacement without suffix accumulation;
- real Codex CLI registration and installation under an isolated
  `CODEX_HOME`;
- fresh-process discovery of both canonical skill names;
- packaged Creator plan/apply, generated `init.sh`, and packaged Doctor;
- precise partial-state recommendations;
- all existing product, field-validation, official plugin, and official skill
  checks.

The final live-profile install is run only after isolated verification passes.
A newly started Codex thread is the pickup boundary for the installed plugin.

## Out Of Scope

- bare-name compatibility aliases;
- deleting or rewriting the existing machine-local `$harness-creator`;
- network or public marketplace publication;
- automatic project Context invention;
- Readiness level 3 or general Effectiveness claims.
