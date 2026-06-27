# Shared Harness Contract Core Design

## Goal

Build a dependency-free shared core that gives the future `harness-doctor` and
`harness-creator` one canonical contract for repository discovery, feature
state, readiness assessment, and diagnostic JSON.

This feature implements only read-only Readiness inspection. It does not create
files, render HTML, run project commands, or claim Effectiveness.

## Success Criteria

`feat-008` is complete when:

- canonical schemas exist for feature state, project declarations, and
  assessment output;
- capability rules use the five canonical subsystems;
- a library API and CLI inspect a target repository without writing to it;
- identical repository input produces byte-stable JSON;
- fixture tests cover conventional and explicitly declared project shapes;
- the inspector reports maturity profiles instead of a total score;
- the current repository can run the core checks through `./init.sh`.

## Chosen Approach

Create a private package at `packages/harness-core`.

The shared core is a library, not an invocable skill. Future doctor and creator
skills will be thin entrypoints over this package. Product integration will
later define how the package and both skills are distributed together.

Rejected alternatives:

- `skills/_shared/harness-core` couples the contract to one skill layout and
  weakens future standalone CLI packaging.
- modifying the existing `harness-utils.mjs` preserves fixed filenames,
  keyword-sensitive scoring, a single total score, and the obsolete subsystem
  taxonomy.

The package uses Node.js built-ins and `node:test`; it adds no runtime
dependencies and no root package manager requirement.

## Package Shape

```text
packages/harness-core/
  package.json
  bin/
    inspect-harness.mjs
  rules/
    capabilities.json
  schemas/
    assessment.schema.json
    feature-list.schema.json
    harness-manifest.schema.json
  src/
    assess.mjs
    constants.mjs
    discovery.mjs
    feature-state.mjs
    manifest.mjs
    index.mjs
  test/
    fixtures/
    inspect-harness.test.mjs
```

Responsibilities:

- `rules/capabilities.json` owns conventional paths and operational evidence
  requirements for Instructions, Tools, Environment, State, and Feedback.
- `discovery.mjs` reads only bounded conventional or declared paths.
- `manifest.mjs` parses optional project declarations.
- `feature-state.mjs` validates semantic state invariants that JSON Schema
  alone cannot express.
- `assess.mjs` classifies evidence and produces canonical assessment data.
- `index.mjs` exports the stable library API.
- `bin/inspect-harness.mjs` handles arguments, serialization, and exit codes.

## Public Interface

The library exposes:

```js
inspectHarness({
  root,
  manifestPath,
  limits
}) -> Promise<Assessment>
```

The CLI exposes:

```text
node packages/harness-core/bin/inspect-harness.mjs \
  --target <directory> \
  [--manifest <relative-path>] \
  [--pretty]
```

Default output is compact JSON followed by one newline. `--pretty` changes only
serialization whitespace, never findings.

Capability gaps are successful inspections and exit with `0`. Invalid CLI
arguments, an unreadable target root, or an internal contract failure exit with
`2`. Malformed project-owned artifacts are diagnostic findings rather than CLI
failures whenever a canonical assessment can still be produced.

## Project Declaration

Conventional filenames are defaults, not requirements.

Projects may declare equivalents in `.harness/manifest.json`, or pass another
repository-relative manifest with `--manifest`. The manifest can identify:

- instruction and durable-context artifacts;
- feature-state, progress, and handoff artifacts;
- initialization, setup, and verification commands;
- environment manifests and tool configuration;
- machine-readable readiness evidence.

A declaration is discovery metadata, not proof. The inspector still checks
that declared paths stay inside the target root, exist, are readable, and meet
their capability contract. Declared commands are inspected but never executed.

Manifest paths must be repository-relative. Absolute paths, parent traversal,
and symlinks resolving outside the target root produce `unknown` evidence.

## Canonical Feature State

`feature-list.schema.json` defines:

```text
schemaVersion
mode
features[]
  id
  name
  behavior
  dependencies
  status
  verification
  evidence
```

Canonical statuses are:

```text
not-started | next | in-progress | blocked | done
```

Semantic validation enforces:

- unique feature IDs;
- dependencies reference existing IDs;
- no self-dependencies or dependency cycles;
- serial mode has exactly one `next` or `in-progress` item while unfinished
  work remains;
- `done` requires non-empty verification and successful evidence;
- `blocked` requires a recorded blocker.

Legacy or partial feature files remain readable evidence. They classify State
as `Present` and receive precise repair findings rather than crashing the
inspection.

## Readiness Model

The core assesses only the canonical subsystems:

- Instructions
- Tools
- Environment
- State
- Feedback

Scope Control, Verification, and Lifecycle remain cross-system mechanisms.

Each subsystem receives:

- `0 Missing`: bounded discovery completed with no qualifying evidence;
- `1 Present`: relevant artifacts exist but operational requirements fail;
- `2 Operational`: required artifacts and executable declarations are valid;
- `3 Evidenced`: reserved for representative evidence supplied by a future
  evidence provider.

The first inspector never emits level `3`. It sets Effectiveness to
`not-assessed` and explains that structural Readiness is not outcome evidence.

When discovery cannot support a fair assertion, the subsystem uses
`level: null` and `label: "Unknown"`. Unknown is not a fifth maturity level and
is excluded from candidate-bottleneck calculations.

No overall score is computed. All subsystems tied for the lowest known level
are candidate bottlenecks, not proven causal bottlenecks.

## Assessment Contract

Canonical JSON contains:

```text
schemaVersion
target
mode
subsystems
candidateBottlenecks
recommendations
unknowns
limitations
```

Each subsystem contains:

```text
level
label
evidence[]
gaps[]
unknowns[]
```

Evidence records include a stable rule ID, repository-relative source, result,
and concise detail. Recommendations reference failed rule IDs so consumers do
not need to reconstruct scoring logic.

For portability and deterministic fixtures, `target` is `"."`, meaning the
inspected root. Output contains no timestamps, host paths, random IDs, elapsed
times, or filesystem enumeration order.

## Discovery And Safety

Inspection is read-only.

Discovery reads only:

- paths listed in `capabilities.json`;
- paths declared by the project manifest;
- package metadata needed to resolve declared scripts.

It does not recursively crawl the repository, follow escaping symlinks, access
the network, install dependencies, or execute target commands.

Default limits bound the number of declared paths and bytes read per file.
Limit violations and unsupported encodings become explicit unknowns. Evidence,
gaps, recommendations, and object keys are normalized into stable order before
serialization.

The test suite snapshots the target tree before and after inspection to prove
that inspection creates, modifies, and deletes nothing.

## Capability Rules

Rules are declarative and versioned. Each rule defines:

- a stable ID;
- its subsystem;
- conventional discovery signals;
- the threshold for `Present`;
- the checks required for `Operational`;
- the recommendation emitted when the check fails.

Rules may inspect structure and explicitly declared commands. They must not
grant maturity based only on a prose keyword match. Adding or promoting a rule
requires fixture evidence; claiming effectiveness requires field evidence.

## Fixture Strategy

Tests are written before implementation and cover:

1. an empty repository;
2. instructions only;
3. complete-looking artifacts without executable verification;
4. an operational minimal harness;
5. equivalent artifacts declared under non-standard filenames;
6. malformed feature state;
7. a declaration that escapes the repository;
8. deterministic repeated output;
9. preservation of the target tree.

Each fixture owns expected subsystem levels, findings, and limitations. Tests
assert important contract fields directly and use complete JSON snapshots to
detect unintended output drift.

## Integration With This Repository

During implementation, this repository's `feature_list.json` will migrate to
the canonical feature-state contract instead of receiving a compatibility
exception.

`./init.sh` will run:

- existing repository structure checks;
- feature-state contract tests;
- `node --test` for `packages/harness-core`.

The implementation must pass its fixture suite, inspect this repository
successfully, and leave exactly one active feature.

## Out Of Scope

This feature does not include:

- creator planning, generation, merging, or overwrite policy;
- doctor terminal, Markdown, or HTML rendering;
- execution of target initialization or verification commands;
- field experiments or Effectiveness scoring;
- plugin packaging or global installation;
- automatic inference of arbitrary non-standard filenames.

Those responsibilities remain in `feat-009` through `feat-012`.
