# Remove Session Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `session-handoff` from the repository and Harness Engineering product so `progress.md` is the only cross-session continuity surface.

**Architecture:** Delete the redundant artifact at every active boundary: root contract, Creator CLI/templates, manifest contract, discovery mapping, package verification, and current documentation. Keep historical evolution records and superseded plans unchanged. Existing Feature State, Branch Lease, Progress, Stage Snapshot, and Stage Baseline behavior remains the complete lifecycle.

**Tech Stack:** Node.js ESM, `node:test`, JSON Schema 2020-12, Markdown, Bash, Git worktrees.

---

## File Map

- `packages/harness-core/src/constants.mjs`: remove the `handoff` manifest artifact key.
- `packages/harness-core/src/discovery.mjs`: remove the handoff-to-State unknown mapping.
- `packages/harness-core/schemas/harness-manifest.schema.json`: reject `artifacts.handoff`.
- `packages/harness-core/test/contracts.test.mjs`: lock the reduced manifest contract.
- `packages/harness-core/test/assessment.test.mjs`: prove a declared handoff is unsupported.
- `skills/harness-creator/scripts/creator.mjs`: remove the CLI flag.
- `skills/harness-creator/scripts/apply.mjs`: remove the obsolete option.
- `skills/harness-creator/scripts/planner.mjs`: stop planning the file and stop encoding the option.
- `skills/harness-creator/scripts/templates.mjs`: remove handoff rendering and manifest emission.
- `skills/harness-creator/SKILL.md`: document one continuity surface.
- `tests/harness-creator/creator.test.mjs`: prove the removed flag fails without writes.
- `tests/harness-creator/templates.test.mjs`: prove Progress and manifest are sufficient.
- `scripts/verify-harness-plugin-install.mjs`: verify the packaged Creator without handoff.
- `AGENTS.md`, `CONTEXT.md`, `README.md`, `docs/index.md`,
  `docs/harness-engineering-guide.md`, `docs/learning-harness-summary.md`, and
  `docs/workflows/harness-product-boundaries.md`: align active documentation.
- `init.sh`, `.harness/manifest.json`: remove the root requirement and declaration.
- `session-handoff.md`: delete the redundant root artifact.
- `feature_list.json`, `progress.md`: track the active removal feature and evidence.
- `docs/evolution/0014-remove-session-handoff.md`, `docs/evolution/index.md`: record the stage outcome.

### Task 1: Remove the Shared Core contract

**Files:**
- Modify: `packages/harness-core/test/contracts.test.mjs`
- Modify: `packages/harness-core/test/assessment.test.mjs`
- Modify: `packages/harness-core/src/constants.mjs`
- Modify: `packages/harness-core/src/discovery.mjs`
- Modify: `packages/harness-core/schemas/harness-manifest.schema.json`

- [ ] **Step 1: Write the failing contract test**

Change the expected manifest artifact keys to:

```js
assert.deepEqual(Object.keys(schema.properties.artifacts.properties), [
  'instructions',
  'context',
  'featureState',
  'progress',
  'environment',
  'tools',
  'readinessEvidence'
]);
```

Add an assessment test that writes a manifest containing:

```json
{
  "schemaVersion": "1.0.0",
  "artifacts": {
    "handoff": ["session-handoff.md"]
  }
}
```

and asserts that inspection returns an `unknown-key` finding for
`Manifest artifacts key "handoff" is not supported.`

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test packages/harness-core/test/contracts.test.mjs packages/harness-core/test/assessment.test.mjs
```

Expected: FAIL because the schema and `ARTIFACT_KEYS` still accept `handoff`.

- [ ] **Step 3: Remove the contract surface**

Delete `handoff` from:

```js
export const ARTIFACT_KEYS = Object.freeze([
  'instructions',
  'context',
  'featureState',
  'progress',
  'environment',
  'tools',
  'readinessEvidence'
]);
```

Remove the `handoff` property from the manifest schema and the handoff mapping
from `subsystemForManifestUnknown`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the same `node --test` command.

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/harness-core
git commit -m "refactor: remove handoff manifest contract"
```

### Task 2: Remove Harness Creator generation

**Files:**
- Modify: `tests/harness-creator/creator.test.mjs`
- Modify: `tests/harness-creator/templates.test.mjs`
- Modify: `skills/harness-creator/scripts/creator.mjs`
- Modify: `skills/harness-creator/scripts/apply.mjs`
- Modify: `skills/harness-creator/scripts/planner.mjs`
- Modify: `skills/harness-creator/scripts/templates.mjs`
- Modify: `skills/harness-creator/SKILL.md`

- [ ] **Step 1: Write failing Creator tests**

Replace the handoff option test with:

```js
test('removed handoff option fails without changing the target', async () => {
  const root = await temporaryTarget();
  const result = await runCreator([
    'plan',
    '--target',
    root,
    '--with-handoff'
  ]);

  assert.equal(result.code, 2);
  assert.match(result.stderr, /Unknown argument: --with-handoff/);
  await assert.rejects(
    access(path.join(root, 'session-handoff.md')),
    {code: 'ENOENT'}
  );
});
```

Change the template test to import only `renderProgress`, and assert:

```js
assert.match(progress, /harness-context-restoration/);
assert.match(progress, /Project Context Restoration/);
assert.match(progress, /project owner/i);
assert.doesNotMatch(progress, /\[TODO\]|YYYY|feat-XXX/);
```

Render the manifest without `includeHandoff` and assert:

```js
assert.equal(Object.hasOwn(manifest.artifacts, 'handoff'), false);
```

- [ ] **Step 2: Run focused Creator tests and verify RED**

Run:

```bash
node --test tests/harness-creator/creator.test.mjs tests/harness-creator/templates.test.mjs
```

Expected: FAIL because the flag, renderer, and manifest output still exist.

- [ ] **Step 3: Remove the Creator surface**

Apply these minimal removals:

- usage contains no `--with-handoff`;
- parser and shared options contain no `withHandoff`;
- `applyPlan` and `createPlan` contain no `withHandoff`;
- planner contains no `session-handoff.md` action;
- plan identity contains only `agentFile`;
- `renderHandoff` is deleted;
- `renderManifest` contains no `handoffPath` or `includeHandoff`;
- `SKILL.md` states that `progress.md` is the continuity surface.

- [ ] **Step 4: Run focused Creator tests and verify GREEN**

Run the same focused test command.

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add skills/harness-creator tests/harness-creator
git commit -m "refactor: remove creator handoff surface"
```

### Task 3: Remove product and repository integration

**Files:**
- Modify: `scripts/verify-harness-plugin-install.mjs`
- Modify: `tests/harness-product/documentation.test.mjs`
- Modify: `.harness/manifest.json`
- Modify: `init.sh`
- Delete: `session-handoff.md`
- Modify: `AGENTS.md`
- Modify: `CONTEXT.md`
- Modify: `README.md`
- Modify: `docs/index.md`
- Modify: `docs/harness-engineering-guide.md`
- Modify: `docs/learning-harness-summary.md`
- Modify: `docs/workflows/harness-product-boundaries.md`

- [ ] **Step 1: Write failing product assertions**

In plugin verification, invoke Creator without `--with-handoff`, then assert:

```js
await assert.rejects(
  access(path.join(target, 'session-handoff.md')),
  {code: 'ENOENT'}
);
```

Extend documentation tests:

```js
test('active product documentation has one progress continuity surface', async () => {
  for (const relative of [
    'AGENTS.md',
    'CONTEXT.md',
    'README.md',
    'docs/index.md',
    'docs/harness-engineering-guide.md',
    'docs/learning-harness-summary.md',
    'docs/workflows/harness-product-boundaries.md'
  ]) {
    assert.doesNotMatch(await read(relative), /session-handoff|with-handoff/i);
  }
});
```

- [ ] **Step 2: Run focused product tests and verify RED**

Run:

```bash
node --test tests/harness-product/*.test.mjs
```

Expected: FAIL because active documentation and packaged verification still
reference handoff.

- [ ] **Step 3: Remove current integration**

- Delete `session-handoff.md`.
- Remove it from `init.sh` and `.harness/manifest.json`.
- Rewrite active contracts to route all continuation through `progress.md`.
- Remove `--with-handoff` from isolated plugin verification.
- Do not edit `docs/evolution/0001-*`, old snapshots, old specs, or old plans.

- [ ] **Step 4: Run focused product tests and verify GREEN**

Run the same product test command.

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add AGENTS.md CONTEXT.md README.md .harness/manifest.json init.sh \
  scripts/verify-harness-plugin-install.mjs tests/harness-product \
  docs/index.md docs/harness-engineering-guide.md \
  docs/learning-harness-summary.md docs/workflows/harness-product-boundaries.md
git add -u session-handoff.md
git commit -m "refactor: remove session handoff artifact"
```

### Task 4: Record, verify, and archive the change

**Files:**
- Modify: `feature_list.json`
- Modify: `progress.md`
- Create: `docs/evolution/0014-remove-session-handoff.md`
- Modify: `docs/evolution/index.md`

- [ ] **Step 1: Record completion evidence**

Mark `feat-016-remove-session-handoff` done with passing evidence for:

```text
node --test packages/harness-core/test/*.test.mjs tests/harness-creator/*.test.mjs tests/harness-doctor/*.test.mjs tests/harness-archiver/*.test.mjs tests/harness-product/*.test.mjs tests/field-validation/*.test.mjs
node scripts/verify-harness-plugin-install.mjs
./init.sh
git diff --check
```

Create evolution record `0014` describing the single State continuity surface
and the absence of a compatibility layer.

- [ ] **Step 2: Run full verification**

Run all four commands above.

Expected:

- all Node tests pass with zero failures;
- isolated plugin discovery and workflow verification pass;
- root startup verification passes without `session-handoff.md`;
- no whitespace errors.

- [ ] **Step 3: Verify active references are gone**

Run:

```bash
rg -n "session-handoff|withHandoff|includeHandoff|handoffPath|--with-handoff" \
  AGENTS.md CONTEXT.md README.md .harness init.sh packages skills scripts tests \
  docs/index.md docs/harness-engineering-guide.md \
  docs/learning-harness-summary.md docs/workflows/harness-product-boundaries.md
```

Expected: no matches.

- [ ] **Step 4: Commit the completed feature**

```bash
git add feature_list.json progress.md docs/evolution
git commit -m "docs: record session handoff removal"
```

- [ ] **Step 5: Archive the completed stage**

Run Archiver plan/apply against
`docs/evolution/0014-remove-session-handoff.md`, commit the generated snapshot,
compacted State files, and Stage Baseline, then rerun `./init.sh`.

- [ ] **Step 6: Final repository check**

Run:

```bash
git status --short --branch
git log --oneline -5
```

Expected: clean feature branch with the archived stage at HEAD.
