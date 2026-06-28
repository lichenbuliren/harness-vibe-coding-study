# Harness State Retention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add compact current-state retention, content-addressed stage archives, explicit feature branch ownership, and foreign-thread write blocking to the `harness-engineering` plugin.

**Architecture:** Extend the shared core with backward-compatible feature-state validation, a Git-common-dir branch lease, and immutable stage snapshot contracts. Add a separate plan/apply `harness-archiver` skill, keep Creator as the harness-construction writer, extend Doctor with read-only lifecycle findings, then migrate this repository through the new Archiver.

**Tech Stack:** Node.js ESM, built-in `node:test`, JSON Schema 2020-12, Git CLI, Markdown skill contracts, Codex plugin packaging.

---

## File Structure

New focused units:

- `packages/harness-core/src/branch-lease.mjs` — Git identity discovery and branch lease claim/check/release/takeover primitives.
- `packages/harness-core/bin/branch-lease.mjs` — claim/check/release/takeover command used by agents and plugin skills.
- `packages/harness-core/src/stage-archive.mjs` — archive eligibility, canonical closure digest, snapshot manifest, and baseline-chain validation.
- `packages/harness-core/schemas/stage.schema.json` — immutable `harness-stage/v1` manifest contract.
- `packages/harness-core/test/branch-lease.test.mjs` — cross-thread and cross-worktree lease behavior.
- `packages/harness-core/test/stage-archive.test.mjs` — eligibility, stage ID, digest, and baseline fixtures.
- `skills/harness-archiver/` — one skill with `archiver.mjs`, planner, apply, renderers, and agent metadata.
- `tests/harness-archiver/` — CLI, plan/apply, safety, rollback, and skill-contract tests.

Existing units modified:

- `packages/harness-core/schemas/feature-list.schema.json` and `src/feature-state.mjs` — `1.0.0` read compatibility plus canonical `1.1.0` branch ownership.
- `skills/harness-creator/` — emit/migrate branch-aware feature state and enforce leases on writes.
- `skills/harness-doctor/` — report archive eligibility, baseline integrity, missing branches, and foreign leases without writing.
- `scripts/package-harness-plugin.mjs` and product tests — package three skills and one shared core.
- Repository state/docs — record `feat-015`, its evolution evidence, then archive the completed stage with the new tool.

### Task 1: Start The Feature On Its Declared Branch

**Files:**
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`

- [ ] **Step 1: Create and switch to the implementation branch**

Run:

```bash
git switch -c codex/feat-015-harness-state-retention
```

Expected: current branch is `codex/feat-015-harness-state-retention`.

- [ ] **Step 2: Add the active feature using the current 1.0.0 contract**

Append this exact feature after `feat-014`:

```json
{
  "id": "feat-015",
  "name": "Harness State Retention And Work Ownership",
  "behavior": "Keep current feature and progress state compact, archive completed stages through the plugin, and block concurrent thread writes to one branch.",
  "dependencies": ["feat-014"],
  "status": "in-progress",
  "verification": {
    "kind": "command",
    "steps": [
      "node --test packages/harness-core/test/*.test.mjs tests/harness-creator/*.test.mjs tests/harness-doctor/*.test.mjs tests/harness-archiver/*.test.mjs tests/harness-product/*.test.mjs tests/field-validation/*.test.mjs",
      "node scripts/verify-harness-plugin-install.mjs",
      "./init.sh",
      "git diff --check"
    ]
  },
  "evidence": []
}
```

- [ ] **Step 3: Record the active feature and branch**

Set `progress.md` Current State to `feat-015` on
`codex/feat-015-harness-state-retention`, and set `session-handoff.md` active
feature to `feat-015`.

- [ ] **Step 4: Validate and commit the state transition**

Run:

```bash
node -e 'JSON.parse(require("fs").readFileSync("feature_list.json", "utf8"))'
git diff --check
git add feature_list.json progress.md session-handoff.md
git commit -m "chore: start harness state retention"
```

Expected: JSON parse and diff check pass; commit succeeds.

This feature is the bootstrap exception for the lease protocol: the lease
command does not exist yet. Do not start another writer thread on this branch.
Task 3 claims the branch immediately after the command becomes executable.

### Task 2: Add Branch-Aware Feature State 1.1.0

**Files:**
- Modify: `packages/harness-core/schemas/feature-list.schema.json`
- Modify: `packages/harness-core/src/feature-state.mjs`
- Modify: `packages/harness-core/src/index.mjs`
- Modify: `packages/harness-core/test/feature-state.test.mjs`
- Modify: `skills/harness-creator/scripts/templates.mjs`
- Modify: `tests/harness-creator/templates.test.mjs`
- Modify: `feature_list.json`

- [ ] **Step 1: Write failing compatibility and branch tests**

Add tests that assert:

```js
test('accepts legacy 1.0.0 as valid but non-canonical', () => {
  const result = validateFeatureState(legacyDocument());
  assert.equal(result.valid, true);
  assert.equal(result.canonical, false);
});

test('requires branch on unfinished 1.1.0 features', () => {
  const document = canonicalDocument({
    branch: null,
    status: 'in-progress'
  });
  assert.deepEqual(
    validateFeatureState(document).findings.map((item) => item.code),
    ['missing-active-branch']
  );
});

test('allows null branch only for migrated done features', () => {
  const document = canonicalDocument({branch: null, status: 'done'});
  assert.equal(validateFeatureState(document).valid, true);
});

test('migrates 1.0.0 deterministically', () => {
  assert.deepEqual(migrateFeatureState(legacyDocument()), {
    schemaVersion: '1.1.0',
    mode: 'serial',
    features: legacyDocument().features.map((feature) => ({
      ...feature,
      branch: feature.status === 'done' ? null : 'codex/migrate-state'
    }))
  });
});
```

Use an explicit migration option `{branch: 'codex/migrate-state'}` for
unfinished legacy features.

- [ ] **Step 2: Run the tests and confirm RED**

Run:

```bash
node --test packages/harness-core/test/feature-state.test.mjs
```

Expected: FAIL because `1.1.0`, `branch`, and `migrateFeatureState` are not implemented.

- [ ] **Step 3: Implement the 1.1.0 contract**

Implement these exported interfaces:

```js
export const FEATURE_STATE_SCHEMA_VERSION = '1.1.0';
export const LEGACY_FEATURE_STATE_SCHEMA_VERSION = '1.0.0';

export function validateFeatureState(document) {
  // valid=true for supported 1.0.0 and 1.1.0 documents.
  // canonical=true only for valid 1.1.0 documents.
}

export function migrateFeatureState(document, {branch} = {}) {
  // Reject invalid input.
  // Add branch:null to legacy done rows.
  // Require a validated branch for every unfinished legacy row.
  // Return canonical 1.1.0 without mutating input.
}
```

Update the schema so `branch` is required and is either `null` or a Git branch
string. Add conditional validation so non-`done` rows require a string.

- [ ] **Step 4: Update Creator templates and this repository**

Creator’s context-restoration feature must include the discovered branch.
Migrate `feature_list.json` to `1.1.0`, set legacy done rows to `branch: null`,
and set `feat-015.branch` to:

```json
"branch": "codex/feat-015-harness-state-retention"
```

- [ ] **Step 5: Run focused tests and commit**

Run:

```bash
node --test packages/harness-core/test/feature-state.test.mjs tests/harness-creator/templates.test.mjs
git diff --check
git add packages/harness-core/schemas/feature-list.schema.json \
  packages/harness-core/src/feature-state.mjs \
  packages/harness-core/src/index.mjs \
  packages/harness-core/test/feature-state.test.mjs \
  skills/harness-creator/scripts/templates.mjs \
  tests/harness-creator/templates.test.mjs feature_list.json
git commit -m "feat: add feature branch ownership"
```

Expected: focused tests pass and the canonical repository feature state is valid.

### Task 3: Implement The Branch Lease Protocol

**Files:**
- Create: `packages/harness-core/bin/branch-lease.mjs`
- Create: `packages/harness-core/src/branch-lease.mjs`
- Create: `packages/harness-core/test/branch-lease.test.mjs`
- Modify: `packages/harness-core/src/index.mjs`

- [ ] **Step 1: Write failing lease tests**

Cover these exact behaviors:

```js
test('claims a branch once and is idempotent for the same thread', async () => {
  const first = await claimBranchLease(options);
  const second = await claimBranchLease(options);
  assert.equal(first.status, 'claimed');
  assert.equal(second.status, 'owned');
  assert.equal(second.lease.threadId, first.lease.threadId);
});

test('blocks a foreign thread before mutation', async () => {
  await claimBranchLease({...options, threadId: 'thread-a'});
  const result = await claimBranchLease({...options, threadId: 'thread-b'});
  assert.equal(result.status, 'blocked');
  assert.equal(result.reason, 'branch-owned-by-another-thread');
});

test('only the matching owner and token can release', async () => {
  const claimed = await claimBranchLease(options);
  await assert.rejects(
    releaseBranchLease({...options, leaseId: 'wrong'}),
    {code: 'LEASE_OWNER_MISMATCH'}
  );
  assert.equal(
    (await releaseBranchLease({...options, leaseId: claimed.lease.leaseId})).status,
    'released'
  );
});
```

Also test missing thread identity, detached HEAD, concurrent `Promise.all`
claims, normalized ref hashing, and two worktrees resolving the same Git common
directory.

CLI tests must cover:

```text
branch-lease claim --target <directory> --feature-id <id>
branch-lease check --target <directory>
branch-lease release --target <directory>
branch-lease takeover-plan --target <directory>
branch-lease takeover-apply --target <directory> --plan-id <sha256>
```

The CLI reads `CODEX_THREAD_ID`; missing identity exits `2`.

- [ ] **Step 2: Run the tests and confirm RED**

Run:

```bash
node --test packages/harness-core/test/branch-lease.test.mjs
```

Expected: FAIL because `branch-lease.mjs` does not exist.

- [ ] **Step 3: Implement lease discovery and atomic operations**

Export:

```js
export async function discoverGitWorkspace(root) {}
export async function readBranchLease(options) {}
export async function claimBranchLease(options) {}
export async function releaseBranchLease(options) {}
export async function planBranchLeaseTakeover(options) {}
export async function applyBranchLeaseTakeover(options) {}
```

Requirements:

- invoke Git with `execFile`, never a shell;
- normalize to `refs/heads/<branch>`;
- resolve `git rev-parse --git-common-dir`;
- use SHA-256 of the normalized ref for the lease filename;
- create with `flag: 'wx'`;
- never auto-expire;
- use random `leaseId` only in the local lease, never in deterministic plans;
- takeover apply must bind the exact existing lease digest.

- [ ] **Step 4: Implement the lease CLI**

Use direct argument parsing without dependencies. JSON output is deterministic
except for local lease acquisition fields. Foreign-owner text output must name
the branch, feature, owner thread, worktree, acquisition time, state that no
files changed, and list handoff/worktree/takeover recovery choices.

- [ ] **Step 5: Claim the current implementation branch**

Run:

```bash
CODEX_THREAD_ID="$CODEX_THREAD_ID" \
  node packages/harness-core/bin/branch-lease.mjs claim \
  --target . --feature-id feat-015
```

Expected: status is `claimed`; a repeated command returns `owned`.

- [ ] **Step 6: Run lease and full core tests**

Run:

```bash
node --test packages/harness-core/test/branch-lease.test.mjs
node --test packages/harness-core/test/*.test.mjs
```

Expected: all core tests pass.

- [ ] **Step 7: Commit**

```bash
git add packages/harness-core/bin/branch-lease.mjs \
  packages/harness-core/src/branch-lease.mjs \
  packages/harness-core/src/index.mjs \
  packages/harness-core/test/branch-lease.test.mjs
git commit -m "feat: add branch writer leases"
```

### Task 4: Implement Stage Archive Contracts

**Files:**
- Create: `packages/harness-core/src/stage-archive.mjs`
- Create: `packages/harness-core/schemas/stage.schema.json`
- Create: `packages/harness-core/test/stage-archive.test.mjs`
- Modify: `packages/harness-core/src/index.mjs`
- Modify: `init.sh`

- [ ] **Step 1: Write failing archive contract tests**

Add:

```js
test('derives a deterministic content-addressed stage id', () => {
  const first = createStageIdentity(fixture);
  const second = createStageIdentity(fixture);
  assert.deepEqual(first, second);
  assert.match(first.stageId, /^stage-[0-9a-f]{16}$/);
});

test('rejects unfinished or unevidenced stages', () => {
  const result = assessArchiveEligibility(inProgressFixture);
  assert.equal(result.eligible, false);
  assert.deepEqual(
    result.findings.map((item) => item.code),
    ['feature-not-done']
  );
});

test('accepts an empty current workset outside archive eligibility', () => {
  assert.equal(validateFeatureState(emptyCanonicalDocument).valid, true);
  assert.equal(
    assessArchiveEligibility(emptyCanonicalDocument).eligible,
    false
  );
});

test('detects a tampered snapshot artifact', async () => {
  const result = await validateBaselineChain(fixtureRoot);
  assert.equal(result.valid, false);
  assert.equal(result.findings[0].code, 'snapshot-digest-mismatch');
});
```

- [ ] **Step 2: Run the tests and confirm RED**

```bash
node --test packages/harness-core/test/stage-archive.test.mjs
```

Expected: FAIL because archive functions and schema do not exist.

- [ ] **Step 3: Implement canonical archive functions**

Export:

```js
export function assessArchiveEligibility(featureState) {}
export function createStageIdentity({
  featureStateContent,
  progressContent,
  previousBaseline,
  evolutionPath
}) {}
export function createStageManifest(input) {}
export async function validateBaselineChain({root, baselinePath}) {}
export function renderCompactedFeatureState({mode}) {}
export function renderCompactedProgress({stageId}) {}
```

Use stable recursive JSON key sorting for canonical feature content. Preserve
raw UTF-8 bytes for progress. Validate repository-relative paths with the
existing path-safety functions. Derive `closedAt` from the source HEAD Git
committer timestamp so repeated plans for the same state remain byte-stable.

- [ ] **Step 4: Permit an empty current workset in repository initialization**

Replace the inline `features.length === 0` rejection in `init.sh` with
`validateFeatureState` from shared core. Empty canonical `features` must pass.

- [ ] **Step 5: Run focused and initialization tests**

```bash
node --test packages/harness-core/test/*.test.mjs
./init.sh
```

Expected: all core tests and initialization pass.

- [ ] **Step 6: Commit**

```bash
git add packages/harness-core/src/stage-archive.mjs \
  packages/harness-core/schemas/stage.schema.json \
  packages/harness-core/test/stage-archive.test.mjs \
  packages/harness-core/src/index.mjs init.sh
git commit -m "feat: define stage archive contracts"
```

### Task 5: Build The Harness Archiver Skill

**Files:**
- Create: `skills/harness-archiver/SKILL.md`
- Create: `skills/harness-archiver/agents/openai.yaml`
- Create: `skills/harness-archiver/scripts/archiver.mjs`
- Create: `skills/harness-archiver/scripts/planner.mjs`
- Create: `skills/harness-archiver/scripts/apply.mjs`
- Create: `skills/harness-archiver/scripts/renderers.mjs`
- Create: `tests/harness-archiver/skill-contract.test.mjs`
- Create: `tests/harness-archiver/planner.test.mjs`
- Create: `tests/harness-archiver/apply.test.mjs`
- Create: `tests/harness-archiver/archiver.test.mjs`

- [ ] **Step 1: Write failing skill and CLI contract tests**

Assert the skill:

```js
assert.match(metadata, /^name: harness-archiver$/m);
assert.match(skill, /archiver\\.mjs plan/);
assert.match(skill, /archiver\\.mjs apply/);
assert.match(skill, /user.*active|explicit/i);
assert.doesNotMatch(skill, /automatic.*archive/i);
```

Assert CLI usage:

```text
archiver plan --target <directory> --evolution <relative-path>
archiver apply --target <directory> --evolution <relative-path>
  --plan-id <sha256>
```

Invalid arguments and blocked/ineligible plans exit `2`.

- [ ] **Step 2: Write failing plan/apply tests**

Fixtures must prove:

- plan performs zero writes;
- equivalent inputs produce identical `stageId` and `planId`;
- unfinished, dirty, detached, missing-evolution, unsafe-path, and foreign-lease
  targets are blocked;
- apply rejects stale HEAD, source digest, baseline, and plan ID;
- apply creates exactly `stage.json`, `feature_list.json`, `progress.md`,
  `.harness/baseline`, and compacted root state;
- injected failure restores root files;
- existing identical snapshot is idempotent;
- existing mismatched snapshot blocks without writes.

- [ ] **Step 3: Run tests and confirm RED**

```bash
node --test tests/harness-archiver/*.test.mjs
```

Expected: FAIL because the skill does not exist.

- [ ] **Step 4: Implement deterministic planning**

Planner output:

```js
{
  schemaVersion: '1.0.0',
  target: '.',
  planId,
  eligible,
  stage,
  git,
  lease,
  previousBaseline,
  findings,
  actions
}
```

Actions use `create`, `compact`, `link`, or `block`, include source/destination
preconditions, and are stable-sorted by path.

- [ ] **Step 5: Implement guarded apply and rollback**

Apply must:

- regenerate and bind the exact plan;
- acquire a temporary same-thread lease when none exists;
- preserve a pre-existing same-thread lease;
- preflight every path before writing;
- use exclusive snapshot creation;
- restore original root state after injected failures;
- release only a lease acquired by this apply;
- never execute project commands or commit.

- [ ] **Step 6: Run Archiver tests and official validation**

```bash
node --test tests/harness-archiver/*.test.mjs
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" \
  skills/harness-archiver
```

Expected: all tests pass and validator prints `Skill is valid!`.

- [ ] **Step 7: Commit**

```bash
git add skills/harness-archiver tests/harness-archiver
git commit -m "feat: add harness archiver skill"
```

### Task 6: Integrate Leases With Creator And Lifecycle Findings With Doctor

**Files:**
- Modify: `skills/harness-creator/scripts/planner.mjs`
- Modify: `skills/harness-creator/scripts/apply.mjs`
- Modify: `skills/harness-creator/scripts/renderers.mjs`
- Modify: `skills/harness-creator/scripts/templates.mjs`
- Modify: `skills/harness-creator/SKILL.md`
- Modify: `tests/harness-creator/*.test.mjs`
- Modify: `skills/harness-doctor/scripts/doctor.mjs`
- Modify: `skills/harness-doctor/scripts/renderers.mjs`
- Modify: `skills/harness-doctor/SKILL.md`
- Modify: `tests/harness-doctor/*.test.mjs`

- [ ] **Step 1: Write failing Creator lease tests**

Add tests proving:

```js
assert.equal(foreignPlan.actions[0].operation, 'block');
assert.match(foreignPlan.actions[0].reason, /another thread/i);
await assert.rejects(applyPlan(foreignOptions), {code: 'BLOCKED_PLAN'});
```

Also prove no-lease apply claims/releases transiently and same-thread lease
remains after apply.

- [ ] **Step 2: Write failing Doctor lifecycle tests**

Doctor JSON must add:

```js
{
  lifecycle: {
    archiveEligible: true,
    baseline: {status: 'valid', stageId: 'stage-...'},
    branchOwnership: {status: 'foreign', ownerThread: 'thread-a'},
    recommendations: ['Run $harness-engineering:harness-archiver ...']
  }
}
```

Text, Markdown, and HTML renderers must escape values and include lifecycle
findings without changing Readiness scoring.

- [ ] **Step 3: Run focused tests and confirm RED**

```bash
node --test tests/harness-creator/*.test.mjs tests/harness-doctor/*.test.mjs
```

Expected: lifecycle and lease assertions fail.

- [ ] **Step 4: Implement Creator and Doctor integration**

Creator plans include branch/lease observations and block foreign writers.
Apply claims/releases only its own temporary lease.

Doctor calls archive eligibility, baseline validation, feature branch checks,
and current-branch lease read functions. It never calls claim/release/takeover.

Generated Agent Operating Contract text must require branch claim before
`in-progress`, explain one branch/one writer thread, and show the plugin lease
command. Generated initialization reports a foreign lease but does not acquire
one.

- [ ] **Step 5: Run focused tests and commit**

```bash
node --test tests/harness-creator/*.test.mjs tests/harness-doctor/*.test.mjs
git diff --check
git add skills/harness-creator tests/harness-creator \
  skills/harness-doctor tests/harness-doctor
git commit -m "feat: coordinate harness state writers"
```

Expected: focused suites pass.

### Task 7: Package And Document The Three-Entry Plugin

**Files:**
- Modify: `scripts/package-harness-plugin.mjs`
- Modify: `tests/harness-product/package.test.mjs`
- Modify: `tests/harness-product/plugin-contract.test.mjs`
- Modify: `tests/harness-product/install.test.mjs`
- Modify: `tests/harness-product/integration.test.mjs`
- Modify: `tests/harness-product/documentation.test.mjs`
- Modify: `scripts/verify-harness-plugin-install.mjs`
- Modify: `.harness/manifest.json`
- Modify: `CONTEXT.md`
- Modify: `README.md`
- Modify: `docs/index.md`
- Modify: `docs/harness-engineering-guide.md`

- [ ] **Step 1: Write failing package and product tests**

Update expected bundle files to include:

```text
runtime/harness-core/schemas/stage.schema.json
runtime/harness-core/bin/branch-lease.mjs
runtime/harness-core/src/branch-lease.mjs
runtime/harness-core/src/stage-archive.mjs
skills/harness-archiver/SKILL.md
skills/harness-archiver/agents/openai.yaml
skills/harness-archiver/scripts/archiver.mjs
skills/harness-archiver/scripts/planner.mjs
skills/harness-archiver/scripts/apply.mjs
skills/harness-archiver/scripts/renderers.mjs
```

Assert only three skill CLI entrypoints plus core bins are executable, all
repository imports are rewritten, and fresh-process discovery returns:

```text
harness-engineering:harness-creator
harness-engineering:harness-doctor
harness-engineering:harness-archiver
```

- [ ] **Step 2: Run product tests and confirm RED**

```bash
node --test tests/harness-product/*.test.mjs
```

Expected: package graph and third-skill discovery assertions fail.

- [ ] **Step 3: Update packaging and installation verification**

Package all three skills and exactly one shared runtime. Official validation
must run for Creator, Doctor, and Archiver. Update plugin descriptions from
“Create and diagnose” to “Create, diagnose, and archive”.

- [ ] **Step 4: Update product documentation**

Document:

- three-entry/single-core model;
- explicit user-triggered archive flow;
- Stage Baseline and content-addressed stage ID;
- `feature.branch`;
- one branch/one writer thread;
- local cooperative lease and explicit takeover;
- the exact claim/check/release command sequence;
- no claim that Readiness proves Effectiveness.

- [ ] **Step 5: Run product tests and isolated install verification**

```bash
node --test tests/harness-product/*.test.mjs
node scripts/verify-harness-plugin-install.mjs
```

Expected: product tests pass; isolated Codex process discovers all three skills
and completes an Archiver smoke flow.

- [ ] **Step 6: Commit**

```bash
git add scripts/package-harness-plugin.mjs \
  scripts/verify-harness-plugin-install.mjs \
  tests/harness-product .harness/manifest.json \
  CONTEXT.md README.md docs/index.md docs/harness-engineering-guide.md
git commit -m "feat: package harness state lifecycle"
```

### Task 8: Record Completion Before Archiving

**Files:**
- Create: `docs/evolution/0013-harness-state-retention.md`
- Modify: `docs/evolution/index.md`
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`

- [ ] **Step 1: Run the complete pre-archive verification**

```bash
node --test packages/harness-core/test/*.test.mjs \
  tests/harness-creator/*.test.mjs \
  tests/harness-doctor/*.test.mjs \
  tests/harness-archiver/*.test.mjs \
  tests/harness-product/*.test.mjs \
  tests/field-validation/*.test.mjs
node scripts/verify-harness-plugin-install.mjs
./init.sh
git diff --check
```

Expected: every command exits `0`.

- [ ] **Step 2: Write the evolution record**

Record:

- before/after root state size and feature count;
- selected Stage Baseline model;
- `harness-archiver` product boundary;
- branch field and lease protocol;
- exact test counts and verification commands;
- cooperative-enforcement limitation;
- next Effectiveness question.

- [ ] **Step 3: Mark feat-015 done with exact evidence**

Set `feat-015.status` to `done` and add one `passed` observation for every
verification step. Update progress and handoff to state that implementation is
verified and the next action is the first real archive.

- [ ] **Step 4: Validate and commit the completed feature**

```bash
./init.sh
git diff --check
git add docs/evolution/0013-harness-state-retention.md \
  docs/evolution/index.md feature_list.json progress.md session-handoff.md
git commit -m "docs: record harness state retention"
```

Expected: commit succeeds and worktree becomes clean.

- [ ] **Step 5: Release the completed feature lease**

```bash
node packages/harness-core/bin/branch-lease.mjs release --target .
```

Expected: the current thread lease is released. Archiver will acquire and
release its own temporary lease during apply.

### Task 9: Archive The Completed Repository Stage

**Files:**
- Create: `.harness/baseline`
- Create: `docs/evolution/snapshots/stage-*/stage.json`
- Create: `docs/evolution/snapshots/stage-*/feature_list.json`
- Create: `docs/evolution/snapshots/stage-*/progress.md`
- Modify: `feature_list.json`
- Modify: `progress.md`

- [ ] **Step 1: Generate the real archive plan**

Run:

```bash
ARCHIVE_PLAN="$(
  node skills/harness-archiver/scripts/archiver.mjs plan \
  --target . \
  --evolution docs/evolution/0013-harness-state-retention.md \
  --format json
)"
printf '%s\n' "$ARCHIVE_PLAN" | jq .
ARCHIVE_PLAN_ID="$(printf '%s' "$ARCHIVE_PLAN" | jq -r '.planId')"
```

Expected: `eligible: true`, no blocked action, deterministic
`stage-<16 hex>` ID, and a `planId`.

- [ ] **Step 2: Apply exactly the presented plan**

Run:

```bash
node skills/harness-archiver/scripts/archiver.mjs apply \
  --target . \
  --evolution docs/evolution/0013-harness-state-retention.md \
  --plan-id "$ARCHIVE_PLAN_ID" \
  --format json --pretty
```

Expected: snapshot created, baseline linked, and root state compacted.

- [ ] **Step 3: Verify archive integrity and restartability**

```bash
node skills/harness-doctor/scripts/doctor.mjs \
  --target . --format json --pretty
./init.sh
git diff --check
jq '.features | length' feature_list.json
wc -l -c feature_list.json progress.md
```

Expected:

- Doctor reports a valid baseline;
- initialization passes;
- current feature count is `0`;
- no branch lease remains after Archiver exits;
- root state files are substantially smaller than the recorded before values.

- [ ] **Step 4: Commit the immutable snapshot and compact state**

```bash
git add .harness/baseline docs/evolution/snapshots feature_list.json progress.md
git commit -m "chore: archive completed harness stage"
```

Expected: commit succeeds.

### Task 10: Final Completion Audit

**Files:**
- Modify only if a verification failure requires a scoped fix.

- [ ] **Step 1: Re-run the complete verification from the archived state**

```bash
node --test packages/harness-core/test/*.test.mjs \
  tests/harness-creator/*.test.mjs \
  tests/harness-doctor/*.test.mjs \
  tests/harness-archiver/*.test.mjs \
  tests/harness-product/*.test.mjs \
  tests/field-validation/*.test.mjs
node scripts/verify-harness-plugin-install.mjs
./init.sh
git diff --check
git status --short --branch
```

Expected: all tests and verifiers pass; worktree is clean.

- [ ] **Step 2: Audit every accepted requirement**

Confirm from current artifacts:

```text
feature_list current-only and branch-aware
progress current-only
Stage Baseline outside feature schema
content-addressed immutable snapshot
explicit harness-archiver skill
Creator boundary unchanged
Doctor read-only lifecycle findings
foreign-thread block before writes
same-thread idempotent lease
explicit takeover only
three skills packaged and freshly discoverable
repository migrated through the real Archiver
```

- [ ] **Step 3: Report completion evidence**

Final response must include:

- changed product surfaces;
- archive stage ID and snapshot path;
- before/after root file sizes;
- exact verification totals;
- cooperative-lock limitation;
- commit list;
- any remaining risk without overstating Effectiveness.
