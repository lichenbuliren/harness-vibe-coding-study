# Session Progress Log

## Current State

**Last Updated:** 2026-06-28 CST
**Active Feature:** feat-015 — Harness State Retention And Work Ownership
**Branch:** `codex/feat-015-harness-state-retention`
**Status:** implementation started from the accepted state-retention and work-ownership design

## What's Done

- [x] Created the review-oriented README entrypoint.
- [x] Created `docs/evolution/index.md` as the durable stage-record surface.
- [x] Confirmed `/Users/heaven/Projects/harness-template` contains the five generated harness-creator artifacts.
- [x] Ran `harness-creator` structural validation against this repo and recorded the initial score: 32/100, bottleneck `state`.
- [x] Added project-specific lifecycle artifacts instead of copying the generic template verbatim.
- [x] Ran `./init.sh` successfully.
- [x] Re-ran `harness-creator` validation successfully with overall score 100/100.
- [x] Added `docs/evolution/0001-harness-lifecycle-bootstrap.md`.
- [x] Resolved `AGENTS.md` as an Agent Operating Contract via `$grill-with-docs`.
- [x] Added project language for Agent Operating Contract, Workflow Reference, and Generated Reference Material to `CONTEXT.md`.
- [x] Added ADR 0001 for keeping `AGENTS.md` as the root operating contract.
- [x] Slimmed `AGENTS.md` from 249 lines to 111 lines.
- [x] Added `docs/workflows/omx-runtime.md`.
- [x] Ran `./init.sh` successfully after slimming.
- [x] Ran `harness-creator` validation successfully after slimming with overall score 100/100.
- [x] Compressed `docs/learning-harness-summary.md` from 1063 lines to 318 lines.
- [x] Reorganized the summary around five harness subsystems and one execution lifecycle.
- [x] Removed repeated examples, unsupported precision, and accidental example headings.
- [x] Added `docs/evolution/0003-learning-harness-summary-compression.md`.
- [x] Restored `CONTEXT.md` with durable mission, scope, canonical language, product direction, evidence rules, and restart assumptions.
- [x] Unified the five-subsystem model with the earlier `harness-creator` taxonomy.
- [x] Recorded creator/doctor as an accepted direction without claiming the products already exist.
- [x] Added `docs/evolution/0004-project-context-restoration.md`.
- [x] Classified existing creator templates and scripts by reusable boundary.
- [x] Published `docs/workflows/harness-product-boundaries.md`.
- [x] Accepted ADR 0002 for a contract-first shared core.
- [x] Added the complete product roadmap from shared core through field validation.
- [x] Defined the dependency-free package, deterministic JSON, bounded
  discovery, Readiness maturity, and fixture contracts for the shared core.
- [x] Implemented canonical feature, manifest, and assessment schemas.
- [x] Implemented bounded discovery, semantic feature-state validation, and
  deterministic five-subsystem Readiness assessment.
- [x] Added the read-only JSON CLI and 39 contract/fixture tests.
- [x] Migrated this repository to canonical feature state and added a project
  harness manifest.
- [x] Recorded the implementation in
  `docs/evolution/0006-shared-harness-contract-core.md`.
- [x] Captured the legacy audit baseline and finalized the thin, read-only
  Harness Doctor design.
- [x] Implemented the `harness-doctor` skill with canonical JSON plus pure
  Text, Markdown, and safe standalone HTML renderers.
- [x] Verified a single shared-core inspection boundary, deterministic output,
  no target writes, explicit Unknown handling, and stable exit codes.
- [x] Integrated Doctor tests, official skill validation, and repository
  self-inspection into `./init.sh`.
- [x] Recorded the durable Doctor outcome in
  `docs/evolution/0007-harness-doctor-skill.md`.
- [x] Implemented a plan-bound, non-destructive `harness-creator` skill.
- [x] Added exact preconditions, deterministic `planId`, exclusive creation,
  validated feature-state merge, stale rejection, and parent-symlink safety.
- [x] Made `Project Context Restoration` the default real bootstrap task when
  project Context is missing.
- [x] Integrated Creator tests and official skill validation into `./init.sh`.
- [x] Recorded the outcome in
  `docs/evolution/0008-harness-creator-skill.md`.
- [x] Packaged Creator, Doctor, and one shared core as the deterministic
  `harness-engineering` Codex plugin.
- [x] Verified conventional Context completion, non-standard, conflict,
  resume, deterministic, atomic-failure, and concurrent package workflows.
- [x] Passed official plugin validation and both packaged skill validations.
- [x] Recorded the outcome in
  `docs/evolution/0009-harness-product-integration.md`.
- [x] Ran four counterordered bare/harness coding tasks with executable tests.
- [x] Recorded actions, derived metrics, scope, and SHA-256 evidence in
  `experiments/field-validation/runs/pilot-001.json`.
- [x] Kept conclusions at `observed` and Readiness at level 2.
- [x] Updated the canonical theory with fixed coordination cost and evidence
  boundaries.
- [x] Recorded the outcome in
  `docs/evolution/0010-harness-field-validation.md`.
- [x] Added a repository-local Codex marketplace and one-command plugin
  installer with non-destructive generated-output replacement.
- [x] Split partial Doctor recommendations so they name only the unmet
  operational requirements.
- [x] Verified installation, fresh-process skill discovery, Creator apply,
  generated initialization, and Doctor assessment in an isolated Codex home.
- [x] Installed the plugin into the live Codex home and confirmed both
  namespaced skills are discoverable by a fresh Codex process.
- [x] Recorded the outcome in
  `docs/evolution/0011-harness-direct-installation.md`.
- [x] Added one progressive `harness-engineering` user guide covering local
  installation, first use, interpretation, maintenance, and troubleshooting.
- [x] Linked the guide from README and the documentation index.
- [x] Added a documentation contract for canonical workflow order, namespace,
  distribution, and evidence boundaries.
- [x] Recorded the outcome in
  `docs/evolution/0012-harness-engineering-user-guide.md`.

## What's In Progress

- [ ] Add branch-aware feature state 1.1.0 with 1.0.0 read compatibility.
- [ ] Add one-branch/one-thread cooperative leases.
- [ ] Add content-addressed Stage Baseline contracts.
- [ ] Add the user-triggered `harness-archiver` plugin skill.
- [ ] Integrate lifecycle findings into Creator, Doctor, packaging, and docs.
- [ ] Archive the completed current stage through the real product.

## What's Next

1. Give `docs/harness-engineering-guide.md` to an unfamiliar user without
   additional oral instructions.
2. Have that user install the plugin and run Creator then Doctor on a
   representative repository.
3. Record reproducible onboarding friction before changing the guide or
   default harness.
4. Reserve the next Effectiveness study for independent fresh-session agents
   and a realistic multi-file, cross-session task with pre-registered metrics.

## Blockers / Risks

- `harness-creator` validation is structural. The 100/100 score means the harness is easy to inspect, not that the project methodology is fully proven.
- `AGENTS.md` is now shorter and verified, but future generated overlays could reintroduce bulk if not kept behind the ADR boundary.
- Doctor, Creator, plugin distribution, and the bounded field pilot are
  complete.
- The live plugin requires a new Codex thread before this app session exposes
  its newly installed skill catalog.
- The legacy bare `$harness-creator` remains installed separately; the new
  product uses only the `harness-engineering:*` namespace.
- Public marketplace distribution is not available; the guide intentionally
  documents the repository-local installation boundary.
- The guide is contract-tested but has not yet been validated by an unfamiliar
  user following it without assistance.
- Readiness level 3 remains reserved; the same-agent synthetic pilot is
  `observed`, not `validated`.
- The pilot does not demonstrate a general delivery-speed, success-rate, or
  recovery-cost improvement.

## Evidence

- `ba1544b Document project review entrypoint` created the first README/docs review map.
- `node /Users/heaven/.agents/skills/harness-creator/scripts/validate-harness.mjs --target /Users/heaven/Projects/harness-vibe-coding-study --json` returned overall score 32 before lifecycle migration.
- `./init.sh` passed after lifecycle migration.
- `node /Users/heaven/.agents/skills/harness-creator/scripts/validate-harness.mjs --target /Users/heaven/Projects/harness-vibe-coding-study --json` returned overall score 100 after lifecycle migration.
- `./init.sh` passed after `AGENTS.md` slimming.
- `node /Users/heaven/.agents/skills/harness-creator/scripts/validate-harness.mjs --target /Users/heaven/Projects/harness-vibe-coding-study --json` returned overall score 100 after `AGENTS.md` slimming.
- `docs/learning-harness-summary.md` contains 318 lines and exactly seven numbered top-level sections.
- Markdown fence validation returned an even count of 22.
- `git diff --check` and `./init.sh` passed after the summary rewrite.
- `CONTEXT.md` now answers the project mission, scope, canonical model, product direction, evidence rules, and restart assumptions.
- `docs/learning-harness-summary.md` now explicitly maps the earlier creator taxonomy into the canonical five-subsystem model.
- `./init.sh` passed after context restoration.
- `docs/workflows/harness-product-boundaries.md` records the accepted asset matrix and contracts.
- ADR 0002 records the rejected template-first and doctor-first alternatives.
- `feature_list.json` contains one active item, `feat-008`, with valid dependency references.
- `./init.sh` passed after the boundary review.
- `docs/superpowers/specs/2026-06-27-shared-harness-core-design.md` records the
  accepted package, API, maturity, safety, and fixture contracts.
- `node --test packages/harness-core/test/*.test.mjs` passed 39/39 tests.
- Shared-core self-inspection returned all five subsystems at level 2,
  no candidate bottleneck, and Effectiveness `not-assessed`.
- `./init.sh` passed with shared-core tests and self-inspection enabled.
- `docs/evolution/0006-shared-harness-contract-core.md` records the before/after
  maturity profile and remaining product work.
- The old validator baseline returned `overall: 96` and the obsolete
  `instructions/state/verification/scope/lifecycle` taxonomy.
- `docs/superpowers/specs/2026-06-27-harness-doctor-skill-design.md` records
  the accepted thin-skill, pure-renderer, and read-only command contracts.
- `node --test packages/harness-core/test/*.test.mjs tests/harness-doctor/*.test.mjs`
  passed 64 tests with zero failures.
- Official `quick_validate.py` returned `Skill is valid!` for
  `skills/harness-doctor`.
- Doctor self-inspection returned five level-2 subsystems, no candidate
  bottleneck, and Effectiveness `not-assessed`.
- `./init.sh` passed with Doctor tests and official skill validation enabled.
- `git diff --check` completed without errors.
- Creator/core/Doctor full verification passed 95 tests.
- Empty-directory CLI plan/apply/Doctor smoke created five files, preserved
  Effectiveness `not-assessed`, and left Context restoration as the only next
  feature.
- Inline completion review found and fixed one important conflict bug:
  non-operational existing destinations now block rather than skip.
- Full product verification passed 107 tests.
- The generated `harness-engineering` plugin passed official plugin validation;
  both packaged skills passed official skill validation.
- Packaged workflows moved a conventional fixture from `1/2/2/2/2` to
  `2/2/2/2/2` only after project-owned Context completion; non-standard and
  conflict paths behaved as specified.
- Four field runs all passed on the first implementation edit with zero
  corrections and scope violations.
- Bare runs used 8 orientation reads and 2 verification commands in aggregate;
  harness runs used 12 reads, 4 verification commands, and 4 state updates.
- Only harness runs left machine-readable done/evidence state; this is a
  continuity observation, not proof of lower recovery cost.
- The full direct-install verification suite passed 119 tests with zero
  failures.
- The isolated verifier proved real Codex marketplace registration,
  installation, fresh-process discovery, Creator apply, generated
  initialization, and precise Doctor output.
- Live installation registered
  `harness-engineering@harness-engineering-local` version
  `0.1.0+codex.local-20260627-165001` under
  `/Users/heaven/.codex/plugins/cache/harness-engineering-local/`.
- A fresh `codex debug prompt-input` process discovered
  `$harness-engineering:harness-creator` and
  `$harness-engineering:harness-doctor`.
- The onboarding documentation contract passed 3/3 tests.
- The integrated restart check passed 122 tests after adding the guide
  contract to the existing product wildcard.

## Notes for Next Session

Start with `README.md`, then `feature_list.json`, then this file. If resuming unfinished work, read `session-handoff.md` before editing.
