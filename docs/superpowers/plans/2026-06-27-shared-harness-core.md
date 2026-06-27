# Shared Harness Contract Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free, read-only shared core that emits deterministic five-subsystem Readiness assessments for conventional and explicitly declared harness projects.

**Architecture:** A private ESM package owns JSON Schemas, declarative capability rules, bounded repository discovery, semantic feature-state validation, maturity classification, and a thin JSON CLI. The library never executes target commands or writes target files; future creator and doctor skills consume its stable `inspectHarness()` API.

**Tech Stack:** Node.js ESM, Node built-ins (`fs`, `path`, `crypto`), `node:test`, JSON Schema 2020-12

---

## File Map

- `packages/harness-core/package.json`: private package metadata and test script.
- `packages/harness-core/schemas/*.schema.json`: feature, manifest, and
  assessment wire contracts.
- `packages/harness-core/rules/capabilities.json`: versioned conventional
  discovery and remediation rules.
- `packages/harness-core/src/constants.mjs`: subsystem order, maturity labels,
  limits, and assessment version.
- `packages/harness-core/src/path-safety.mjs`: root containment and bounded
  file reads.
- `packages/harness-core/src/manifest.mjs`: optional declaration loading and
  normalization.
- `packages/harness-core/src/feature-state.mjs`: semantic feature graph and
  lifecycle validation.
- `packages/harness-core/src/discovery.mjs`: conventional plus declared
  evidence collection.
- `packages/harness-core/src/assess.mjs`: deterministic Readiness
  classification.
- `packages/harness-core/src/index.mjs`: stable public API.
- `packages/harness-core/bin/inspect-harness.mjs`: CLI parsing and JSON output.
- `packages/harness-core/test/fixtures/*`: isolated target repositories.
- `packages/harness-core/test/*.test.mjs`: contract, discovery, state,
  assessment, CLI, and no-write tests.
- `feature_list.json`: migrate this repository to the canonical feature
  contract.
- `init.sh`: add shared-core tests and self-inspection.
- `docs/evolution/0006-shared-harness-contract-core.md`: durable outcome and
  evidence.

### Task 1: Lock Wire Contracts And Rules

**Files:**
- Create: `packages/harness-core/package.json`
- Create: `packages/harness-core/schemas/feature-list.schema.json`
- Create: `packages/harness-core/schemas/harness-manifest.schema.json`
- Create: `packages/harness-core/schemas/assessment.schema.json`
- Create: `packages/harness-core/rules/capabilities.json`
- Create: `packages/harness-core/test/contracts.test.mjs`

- [x] **Step 1: Write the failing contract test**

The test loads every JSON asset, asserts Schema 2020-12, locks the canonical
subsystem order, rejects the obsolete subsystem names, and checks that the
assessment schema supports `null` for Unknown without defining an overall
score.

```js
test('contracts use the canonical model', async () => {
  const assessment = await readJson('schemas/assessment.schema.json');
  const rules = await readJson('rules/capabilities.json');
  assert.equal(assessment.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.deepEqual(rules.subsystemOrder, [
    'instructions', 'tools', 'environment', 'state', 'feedback'
  ]);
  assert.equal(JSON.stringify(rules).includes('"scope"'), false);
  assert.equal(JSON.stringify(rules).includes('"lifecycle"'), false);
  assert.equal(Object.hasOwn(assessment.properties, 'overall'), false);
});
```

- [x] **Step 2: Run the test and verify RED**

Run:

```bash
node --test packages/harness-core/test/contracts.test.mjs
```

Expected: FAIL because the package contracts do not exist.

- [x] **Step 3: Add the package and schemas**

Use a private ESM package with no dependencies:

```json
{
  "name": "@harness-study/harness-core",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test test/*.test.mjs"
  }
}
```

Define the feature document as:

```js
{
  schemaVersion: '1.0.0',
  mode: 'serial',
  features: [{
    id: 'feat-001',
    name: 'Example',
    behavior: 'Observable outcome',
    dependencies: [],
    status: 'next',
    verification: null,
    evidence: []
  }]
}
```

`verification` is `null` or
`{kind: "command"|"manual", steps: [non-empty strings]}`. Evidence entries are
`{status: "passed"|"failed"|"blocked", summary, verificationStep?}`.

Define `.harness/manifest.json` with these optional arrays:

```js
{
  schemaVersion: '1.0.0',
  artifacts: {
    instructions: [],
    context: [],
    featureState: [],
    progress: [],
    handoff: [],
    environment: [],
    tools: [],
    readinessEvidence: []
  },
  commands: {
    initialize: [],
    setup: [],
    verify: []
  }
}
```

Define assessment subsystem entries as
`{level, label, evidence, gaps, unknowns}` where level is `0..3` or `null`.
Require `effectiveness.status = "not-assessed"` in Readiness mode.

- [x] **Step 4: Add declarative rules**

Use stable rule IDs and conventional paths. Each subsystem declares its
`presentAny`, `operationalAll`, and recommendation. Include `AGENTS.md`,
`CLAUDE.md`, `CONTEXT.md`, `.codex/config.toml`, package/build manifests,
`init.sh`, feature/progress artifacts, CI paths, and package test scripts.
Do not include prose keyword rules or a numeric weight.

- [x] **Step 5: Run the contract test and verify GREEN**

Run:

```bash
node --test packages/harness-core/test/contracts.test.mjs
```

Expected: PASS.

- [x] **Step 6: Commit**

```bash
git add packages/harness-core
git commit -m "feat: define harness core contracts"
```

### Task 2: Implement Safe Manifest And Path Discovery

**Files:**
- Create: `packages/harness-core/src/constants.mjs`
- Create: `packages/harness-core/src/path-safety.mjs`
- Create: `packages/harness-core/src/manifest.mjs`
- Create: `packages/harness-core/test/path-safety.test.mjs`
- Create: `packages/harness-core/test/fixtures/nonstandard/.harness/manifest.json`
- Create: `packages/harness-core/test/fixtures/nonstandard/PROJECT_GUIDE.md`
- Create: `packages/harness-core/test/fixtures/nonstandard/ops/work.json`

- [x] **Step 1: Write failing path and manifest tests**

```js
test('loads declared repository-relative paths', async () => {
  const result = await loadManifest(fixture('nonstandard'));
  assert.deepEqual(result.manifest.artifacts.instructions, ['PROJECT_GUIDE.md']);
  assert.deepEqual(result.unknowns, []);
});

test('rejects absolute and escaping paths as unknown', async () => {
  const result = normalizeDeclaredPath('/repo', '../outside.md');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'path-escapes-root');
});
```

Also test an in-root symlink whose real target escapes the fixture root and a
file over the configured byte limit.

- [x] **Step 2: Run tests and verify RED**

Run:

```bash
node --test packages/harness-core/test/path-safety.test.mjs
```

Expected: FAIL because the modules do not exist.

- [x] **Step 3: Implement bounded path access**

Export:

```js
normalizeDeclaredPath(root, relativePath)
readBoundedFile(root, relativePath, {maxBytes})
statSafePath(root, relativePath)
```

Reject absolute paths, `..` traversal, NUL bytes, escaping realpaths, non-files,
and oversized content. Return structured `{ok, ...}` results; do not throw for
project-owned path defects.

- [x] **Step 4: Implement manifest loading**

Export:

```js
loadManifest(root, {
  manifestPath = '.harness/manifest.json',
  maxBytes = 262144,
  maxDeclaredPaths = 128
})
```

A missing default manifest returns an empty normalized declaration. Invalid
JSON, invalid field types, excessive paths, and unsafe paths become stable
unknown records sorted by source and code.

- [x] **Step 5: Run tests and verify GREEN**

Run:

```bash
node --test packages/harness-core/test/path-safety.test.mjs
```

Expected: PASS.

- [x] **Step 6: Commit**

```bash
git add packages/harness-core/src packages/harness-core/test
git commit -m "feat: add bounded harness discovery"
```

### Task 3: Implement Canonical Feature-State Validation

**Files:**
- Create: `packages/harness-core/src/feature-state.mjs`
- Create: `packages/harness-core/test/feature-state.test.mjs`
- Create: `packages/harness-core/test/fixtures/malformed-state/feature_list.json`
- Create: `packages/harness-core/test/fixtures/operational/feature_list.json`

- [x] **Step 1: Write failing semantic validation tests**

```js
test('accepts one active serial feature with valid dependencies', () => {
  const result = validateFeatureState(validDocument);
  assert.equal(result.valid, true);
  assert.deepEqual(result.findings, []);
});

test('reports cycles, multiple active items, and done without passing evidence', () => {
  const result = validateFeatureState(invalidDocument);
  assert.deepEqual(result.findings.map(item => item.code), [
    'dependency-cycle',
    'done-without-passing-evidence',
    'serial-active-count'
  ]);
});
```

Cover duplicate IDs, missing/self dependencies, blocked without blocked
evidence, an entirely completed serial plan with zero active items, and a
legacy `description` document.

- [x] **Step 2: Run tests and verify RED**

Run:

```bash
node --test packages/harness-core/test/feature-state.test.mjs
```

Expected: FAIL because `validateFeatureState` does not exist.

- [x] **Step 3: Implement structural and semantic validation**

Export:

```js
validateFeatureState(document) -> {
  valid,
  canonical,
  findings
}
```

Validate required fields and types before graph checks. Sort findings by
feature ID then code. Serial mode requires one active item only when unfinished
non-blocked work remains. A legacy/partial document returns `valid: false` and
repair findings without throwing.

- [x] **Step 4: Run tests and verify GREEN**

Run:

```bash
node --test packages/harness-core/test/feature-state.test.mjs
```

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add packages/harness-core/src/feature-state.mjs packages/harness-core/test
git commit -m "feat: validate harness feature state"
```

### Task 4: Build Discovery And Readiness Classification

**Files:**
- Create: `packages/harness-core/src/discovery.mjs`
- Create: `packages/harness-core/src/assess.mjs`
- Create: `packages/harness-core/src/index.mjs`
- Create: `packages/harness-core/test/assessment.test.mjs`
- Create: `packages/harness-core/test/fixtures/empty/.gitkeep`
- Create: `packages/harness-core/test/fixtures/instructions-only/AGENTS.md`
- Create: `packages/harness-core/test/fixtures/structure-only/*`
- Create: `packages/harness-core/test/fixtures/operational/*`
- Create: `packages/harness-core/test/fixtures/escaping-manifest/*`

- [x] **Step 1: Write failing fixture matrix tests**

```js
const cases = [
  ['empty', [0, 0, 0, 0, 0]],
  ['instructions-only', [1, 0, 0, 0, 0]],
  ['structure-only', [2, 1, 1, 1, 1]],
  ['operational', [2, 2, 2, 2, 2]],
  ['nonstandard', [2, 2, 2, 2, 2]]
];

for (const [name, levels] of cases) {
  test(`classifies ${name}`, async () => {
    const result = await inspectHarness({root: fixture(name)});
    assert.deepEqual(
      Object.values(result.subsystems).map(item => item.level),
      levels
    );
    assert.equal(result.effectiveness.status, 'not-assessed');
    assert.equal(Object.hasOwn(result, 'overall'), false);
  });
}
```

Add explicit assertions that malformed/escaping evidence yields `Unknown`
where a fair absence claim cannot be made and that Unknown is omitted from
`candidateBottlenecks`.

- [x] **Step 2: Run tests and verify RED**

Run:

```bash
node --test packages/harness-core/test/assessment.test.mjs
```

Expected: FAIL because discovery and assessment modules do not exist.

- [x] **Step 3: Implement evidence discovery**

Load `capabilities.json`, the optional manifest, and only conventional or
declared paths. Produce normalized evidence:

```js
{
  ruleId: 'state.feature-state',
  subsystem: 'state',
  source: 'feature_list.json',
  result: 'valid',
  detail: 'Canonical serial feature state is valid.'
}
```

Inspect file existence/readability, JSON validity, executable mode, package
scripts, and canonical feature-state semantics. Never execute a command.

- [x] **Step 4: Implement readiness assessment**

Classification rules:

- no evidence after complete bounded discovery -> `0 Missing`;
- qualifying artifact but failed operational checks -> `1 Present`;
- every subsystem operational requirement satisfied -> `2 Operational`;
- unresolved discovery uncertainty -> `null Unknown`;
- never emit `3 Evidenced` in Readiness mode.

Sort all arrays by stable identifiers. When the lowest known level is below
Operational, emit all tied subsystems as candidate bottlenecks and attach
rule-linked recommendations. Emit none for an all-Operational profile.

- [x] **Step 5: Run tests and verify GREEN**

Run:

```bash
node --test packages/harness-core/test/assessment.test.mjs
```

Expected: PASS for the complete fixture matrix.

- [x] **Step 6: Commit**

```bash
git add packages/harness-core/src packages/harness-core/test
git commit -m "feat: assess harness readiness"
```

### Task 5: Add Deterministic Read-Only CLI

**Files:**
- Create: `packages/harness-core/bin/inspect-harness.mjs`
- Create: `packages/harness-core/test/cli.test.mjs`

- [ ] **Step 1: Write failing CLI tests**

```js
test('emits byte-stable compact JSON and preserves the target', async () => {
  const before = await treeDigest(fixture('operational'));
  const first = await runCli(['--target', fixture('operational')]);
  const second = await runCli(['--target', fixture('operational')]);
  const after = await treeDigest(fixture('operational'));
  assert.equal(first.code, 0);
  assert.equal(first.stdout, second.stdout);
  assert.equal(before, after);
  assert.equal(JSON.parse(first.stdout).target, '.');
});

test('uses exit 2 for invalid arguments', async () => {
  const result = await runCli(['--unknown']);
  assert.equal(result.code, 2);
  assert.match(result.stderr, /Usage:/);
});
```

Also test `--pretty`, explicit `--manifest`, missing target, no timestamps or
absolute host paths, and gap assessments exiting `0`.

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
node --test packages/harness-core/test/cli.test.mjs
```

Expected: FAIL because the CLI does not exist.

- [ ] **Step 3: Implement CLI parsing and serialization**

Support only `--target`, `--manifest`, `--pretty`, and `--help`. Serialize the
canonical assessment plus one newline. Print usage/errors to stderr. Do not
render text/Markdown/HTML and do not rescore the result.

- [ ] **Step 4: Run the complete package suite**

Run:

```bash
node --test packages/harness-core/test/*.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/harness-core/bin packages/harness-core/test
git commit -m "feat: add harness readiness CLI"
```

### Task 6: Dogfood The Canonical Contract

**Files:**
- Modify: `feature_list.json`
- Modify: `init.sh`
- Modify: `progress.md`
- Modify: `session-handoff.md`
- Create: `.harness/manifest.json`
- Create: `docs/evolution/0006-shared-harness-contract-core.md`
- Modify: `docs/evolution/index.md`
- Modify: `docs/index.md`

- [ ] **Step 1: Write the failing repository integration check**

Run:

```bash
node packages/harness-core/bin/inspect-harness.mjs --target . --pretty
```

Expected before migration: State is `Present`, with findings for legacy
`description`, missing `schemaVersion`, and unstructured verification/evidence.

- [ ] **Step 2: Migrate repository state**

Add top-level:

```json
{
  "schemaVersion": "1.0.0",
  "mode": "serial",
  "features": []
}
```

For every feature, rename `description` to `behavior`. Use `verification: null`
and `evidence: []` for unfinished items. For completed items, encode the
existing command/manual check and at least one `{status: "passed", summary}`
observation. Keep exactly `feat-008` as `in-progress`.

- [ ] **Step 3: Declare this repository's harness equivalents**

Create `.harness/manifest.json` that identifies `AGENTS.md`, `CONTEXT.md`,
`feature_list.json`, `progress.md`, `session-handoff.md`, `.codex/config.toml`,
`init.sh`, and the shared-core test command. Do not declare field evidence.

- [ ] **Step 4: Extend startup verification**

After existing structure checks, run:

```bash
node --test packages/harness-core/test/*.test.mjs
node packages/harness-core/bin/inspect-harness.mjs --target . >/dev/null
```

Update the feature tracker check to require the canonical top-level fields and
feature fields rather than legacy `description`.

- [ ] **Step 5: Record the durable outcome**

Document:

- why the old fixed-file total scorer was replaced;
- the package/API/schema/rules boundaries;
- fixture matrix and no-write proof;
- actual commands and results;
- remaining doctor/creator/field-validation work.

- [ ] **Step 6: Verify repository integration**

Run:

```bash
node --test packages/harness-core/test/*.test.mjs
node packages/harness-core/bin/inspect-harness.mjs --target . --pretty
./init.sh
git diff --check
```

Expected: tests pass; this repository is Operational across all five
subsystems; Effectiveness remains `not-assessed`; `./init.sh` passes.

- [ ] **Step 7: Complete state and commit**

Set `feat-008` to `done` with the verification commands and passing evidence.
Set only `feat-009` to `next`. Update progress and handoff with exact evidence.

```bash
git add .harness packages feature_list.json init.sh progress.md \
  session-handoff.md docs/evolution docs/index.md
git commit -m "feat: complete shared harness core"
```

### Task 7: Final Feature Audit

**Files:**
- Verify only

- [ ] **Step 1: Check scope exclusions**

Run:

```bash
rg -n "writeFile|copyFile|mkdir|rm\\(|fetch\\(|https?://|<html|overall" \
  packages/harness-core/src packages/harness-core/bin
```

Expected: no target-writing, network, HTML, or total-score implementation.
Schema URLs are outside the searched paths.

- [ ] **Step 2: Check deterministic and no-write behavior**

Run the CLI twice against the operational fixture, compare outputs with
`cmp`, and compare target-tree digests before and after.

- [ ] **Step 3: Re-run all required verification**

Run:

```bash
node --test packages/harness-core/test/*.test.mjs
./init.sh
git status --short
git log --oneline -8
```

Expected: all tests and initialization pass; worktree is clean; commits show
contracts, safe discovery, feature validation, assessment, CLI, and repository
integration.
