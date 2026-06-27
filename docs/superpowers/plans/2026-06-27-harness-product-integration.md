# Harness Product Integration Implementation Plan

**Goal:** Package Creator, Doctor, and one shared core as an independently
runnable Codex plugin and verify their complete supported workflows.

**Architecture:** A deterministic Node packager stages a minimal plugin from
canonical source directories, rewrites only repository-relative core imports,
validates the staged graph, and publishes with one rename. Integration tests
invoke the packaged commands from outside the repository.

**Tech Stack:** Node.js ESM, Node built-ins, `node:test`, Codex plugin and skill
validators, offline `uv`

---

## Task 1: Lock Packaging And Plugin Contracts

**Files:**
- Create: `tests/harness-product/plugin-contract.test.mjs`
- Create: `scripts/package-harness-plugin.mjs`

- [x] Write RED tests for the CLI, minimal plugin manifest, output-name
  boundary, and refusal to overwrite.
- [x] Implement argument parsing and the deterministic plugin manifest.
- [x] Add a zero-dependency validator matching the official manifest contract
  used by this product.
- [x] Pass targeted contract tests.

## Task 2: Build The Atomic Distribution Bundle

**Files:**
- Modify: `scripts/package-harness-plugin.mjs`
- Create: `tests/harness-product/package.test.mjs`

- [x] Write RED tests for exact file inclusion, one shared core, import
  rewriting, stable digests, executable modes, and no source-path leakage.
- [x] Stage copies in a sibling temporary directory.
- [x] Rewrite only the known core import prefix in copied skill scripts.
- [x] Validate the staged graph and publish with one rename.
- [x] Prove failures leave neither partial output nor staging residue.

## Task 3: Verify Packaged Creator-To-Doctor Workflows

**Files:**
- Create: `tests/harness-product/integration.test.mjs`
- Create: `tests/harness-product/helpers.mjs`

- [x] Write RED end-to-end tests that invoke only packaged commands.
- [x] Verify conventional plan/apply/Doctor, owner-supplied Context completion,
  all-Operational diagnosis, and stable resume.
- [x] Verify manifest-declared non-standard projects remain skip-only and
  Operational.
- [x] Verify conflicts block without target mutation.
- [x] Verify Effectiveness remains `not-assessed`.

## Task 4: Integrate And Complete The Feature

**Files:**
- Modify: `.harness/manifest.json`
- Modify: `init.sh`
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`
- Modify: `docs/index.md`
- Modify: `docs/evolution/index.md`
- Create: `docs/evolution/0009-harness-product-integration.md`

- [x] Add packager and product tests to repository startup verification.
- [x] Run official validation for the plugin and both packaged skills through
  offline `uv`.
- [x] Run all core, Doctor, Creator, and product suites.
- [x] Record package shape, workflow evidence, validation limits, and remaining
  field-validation risk.
- [x] Set `feat-011` done and only `feat-012` next.

## Final Verification

```bash
node --test packages/harness-core/test/*.test.mjs \
  tests/harness-doctor/*.test.mjs \
  tests/harness-creator/*.test.mjs \
  tests/harness-product/*.test.mjs
tmp="$(mktemp -d)"
node scripts/package-harness-plugin.mjs \
  --output "$tmp/harness-engineering"
uv run --offline --with pyyaml python \
  /Users/heaven/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py \
  "$tmp/harness-engineering"
./init.sh
git diff --check
```
