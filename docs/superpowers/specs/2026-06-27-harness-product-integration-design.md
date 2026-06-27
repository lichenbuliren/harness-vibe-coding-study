# Harness Product Integration Design

## Goal

Turn the verified repository-local Creator, Doctor, and shared core into one
installable Codex plugin bundle, then prove the packaged paths work together
across conventional, non-standard, conflict, and resume workflows.

This feature proves product integration and distribution readiness. It does not
claim real-task Effectiveness; that remains `feat-012`.

## Product Boundary

The source of truth remains:

- `skills/harness-creator`;
- `skills/harness-doctor`;
- `packages/harness-core`.

The distribution product is a generated plugin named `harness-engineering`:

```text
harness-engineering/
  .codex-plugin/plugin.json
  skills/harness-creator/
  skills/harness-doctor/
  runtime/harness-core/
```

The bundle contains exactly one shared core. Source skills keep their current
repository imports. Packaging rewrites only the copied skill imports from
`../../../packages/harness-core/` to
`../../../runtime/harness-core/`.

Generated output is a product artifact, not a second editable source tree.

## Approaches Considered

### Duplicate the core into each skill

Each skill would be standalone, but rules and schemas could drift. This rejects
the accepted one-core/two-entrypoint model.

### Commit a manually synchronized plugin tree

The bundle would be directly inspectable, but every source edit would require a
second manual edit. Drift would become a normal failure mode.

### Generate one plugin from canonical sources

A deterministic packager copies both skills and one runtime core, rewrites only
known import prefixes, and validates the result. This is selected because it
preserves one source of truth and produces an independently runnable artifact.

## Packaging Contract

```text
node scripts/package-harness-plugin.mjs --output <path>/harness-engineering
```

The command:

- accepts only an absent output path whose basename is
  `harness-engineering`;
- refuses overwrite, merge, force, delete, install, network, and target command
  execution;
- stages the complete bundle in a sibling temporary directory;
- validates every copied and rewritten file before publication;
- renames the staged directory into place only after validation;
- emits deterministic JSON describing the product files and SHA-256 digests;
- leaves no partial output or staging directory on failure.

The output contains no host paths, timestamps, random identifiers, source tests,
or repository-only documentation. File order and content are deterministic.
Executable modes are preserved only for executable product scripts.

## Plugin Manifest

`.codex-plugin/plugin.json` follows the official plugin ingestion contract:

- name `harness-engineering`;
- strict semantic version;
- real description and author identity;
- `skills: "./skills/"`;
- required interface metadata;
- no undeclared Apps, MCP servers, Hooks, assets, or marketplace entry.

The package test mirrors the official validator's zero-dependency manifest
checks. The official `validate_plugin.py` also runs through offline `uv` with
`PyYAML`, because both system and bundled Python currently lack that dependency.

## Integration Workflows

All workflows invoke Creator and Doctor from the packaged plugin, not the
repository source paths.

### Conventional bootstrap and resume

Start from a minimal Node fixture with real environment metadata:

1. Creator plans without writes.
2. Creator applies the exact accepted plan.
3. Doctor reports the expected post-bootstrap Readiness profile and preserves
   Effectiveness as `not-assessed`.
4. The fixture owner supplies real `CONTEXT.md` facts and completes the
   restoration feature with evidence.
5. Doctor reports all five subsystems Operational with no bottleneck.
6. Replanning is stable and skip-only.

### Non-standard project

A manifest-declared fixture with alternate artifact paths remains Operational.
Creator emits a skip-only plan and Doctor consumes the same declarations.

### Conflict

A non-operational existing destination produces a blocked plan. Apply exits
without changing the target tree.

### Packaged independence

The bundle is copied outside the repository and executed after changing the
working directory. No packaged file may refer to `packages/harness-core` or the
source repository absolute path.

## Verification

Tests cover:

- deterministic, atomic, non-overwriting packaging;
- exact plugin shape and manifest validation;
- one shared core and rewritten import closure;
- official validation for the plugin and both packaged skills;
- packaged Creator plan/apply and packaged Doctor assessment;
- conventional completion/resume, non-standard, and conflict workflows;
- no target mutation during planning or diagnosis;
- no partial output after packaging failure;
- stable repeated package digests.

`./init.sh` packages into a temporary directory and runs the integration suite.
The bundle itself is not committed, so source and distribution cannot silently
diverge.

## Out Of Scope

- marketplace publication or installation policy;
- automatic plugin installation;
- external network access;
- project dependency installation;
- real-task before/after Effectiveness experiments;
- readiness level 3 evidence.
