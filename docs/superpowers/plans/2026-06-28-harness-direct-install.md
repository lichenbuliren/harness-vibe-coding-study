# Harness Direct Installation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the generated Harness Engineering plugin installable with one command, discoverable in a fresh Codex process, independently executable, and precise about partially missing Readiness requirements.

**Architecture:** Keep `skills/harness-creator`, `skills/harness-doctor`, and `packages/harness-core` as the only editable product sources. Add a repository marketplace plus an installer that packages a cache-busted local artifact, registers the marketplace, installs through the Codex CLI, and verifies the result. Refine shared-core recommendations at the operational-requirement boundary so both source and packaged Doctor report only missing work.

**Tech Stack:** Node.js ESM, `node:test`, Codex plugin CLI, JSON marketplace and plugin manifests, Bash startup verification.

---

## File Map

- `.agents/plugins/marketplace.json`: stable repository marketplace metadata.
- `.gitignore`: excludes the generated `plugins/harness-engineering` artifact.
- `packages/harness-core/rules/capabilities.json`: requirement-specific recommendation text.
- `packages/harness-core/src/assess.mjs`: selects recommendations for unsatisfied requirement groups.
- `packages/harness-core/test/assessment.test.mjs`: partial-state recommendation regression.
- `packages/harness-core/test/contracts.test.mjs`: rule/recommendation alignment contract.
- `scripts/install-harness-plugin.mjs`: safe package, cachebuster, marketplace registration, install, and verification entrypoint.
- `scripts/verify-harness-plugin-install.mjs`: isolated real-Codex fresh-process and packaged-workflow proof.
- `tests/harness-product/install.test.mjs`: installer parsing, cachebuster, safety, and CLI orchestration tests.
- `init.sh`: required-path and isolated installation verification integration.
- `docs/index.md`: user-facing install and invocation entrypoint.
- `docs/evolution/0011-harness-direct-installation.md`: durable stage outcome and evidence.
- `docs/evolution/index.md`: stage navigation.
- `feature_list.json`, `progress.md`, `session-handoff.md`: completion, evidence, and restart state.

### Task 1: Make Recommendations Requirement-Specific

**Files:**
- Modify: `packages/harness-core/test/assessment.test.mjs`
- Modify: `packages/harness-core/test/contracts.test.mjs`
- Modify: `packages/harness-core/rules/capabilities.json`
- Modify: `packages/harness-core/src/assess.mjs`

- [ ] **Step 1: Write the failing partial-environment regression**

Create a temporary target with only an executable `init.sh`, inspect it, and
assert that the environment recommendation mentions metadata but not another
initialization command:

```js
test('recommends only unsatisfied operational requirements', async () => {
  const root = await mkdtemp(path.join(
    os.tmpdir(),
    'harness-partial-recommendation-'
  ));
  await writeFile(path.join(root, 'init.sh'), '#!/bin/sh\nexit 0\n', {
    mode: 0o755
  });

  const result = await inspectHarness({root});
  const recommendation = result.recommendations.find(
    (item) => item.ruleId === 'environment.bootstrap'
  );

  assert.equal(recommendation.message, 'Add environment metadata.');
  assert.doesNotMatch(recommendation.message, /initialization command/i);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test packages/harness-core/test/assessment.test.mjs
```

Expected: FAIL because the current compound message still recommends a
check-first initialization command.

- [ ] **Step 3: Add the rule-shape contract**

Assert each rule has one non-empty recommendation for each
`operationalAll` group:

```js
for (const rule of rules.rules) {
  assert.equal(rule.recommendations.length, rule.operationalAll.length);
  assert.ok(rule.recommendations.every(
    (message) => typeof message === 'string' && message.length > 0
  ));
}
```

- [ ] **Step 4: Replace compound rule messages with aligned messages**

Use one message per operational group. The environment rule becomes:

```json
"recommendations": [
  "Add environment metadata.",
  "Add a check-first initialization command."
]
```

Apply the same split to instructions, tools, and state. Feedback retains one
message because it has one alternative group.

- [ ] **Step 5: Select only unmet requirement messages**

Replace the static recommendation branch with group-aware selection:

```js
function unmetRecommendation(rule, discovery) {
  return rule.operationalAll
    .map((group, index) => (
      group.some((id) => discovery.signals[id].operational)
        ? null
        : rule.recommendations[index]
    ))
    .filter(Boolean)
    .join(' ');
}
```

Pass `discovery` into `recommendationsFor`, retain one recommendation per
deficient subsystem, and preserve current priority/order behavior.

- [ ] **Step 6: Run core and Doctor tests and verify GREEN**

Run:

```bash
node --test packages/harness-core/test/*.test.mjs tests/harness-doctor/*.test.mjs
```

Expected: all tests pass and the partial-state regression reports only missing
metadata.

- [ ] **Step 7: Commit the recommendation fix**

```bash
git add packages/harness-core/rules/capabilities.json \
  packages/harness-core/src/assess.mjs \
  packages/harness-core/test/assessment.test.mjs \
  packages/harness-core/test/contracts.test.mjs
git commit -m "fix: make harness recommendations precise"
```

### Task 2: Add the Repository Marketplace Contract

**Files:**
- Create: `.agents/plugins/marketplace.json`
- Modify: `.gitignore`
- Modify: `tests/harness-product/install.test.mjs`

- [ ] **Step 1: Write the failing marketplace contract test**

Read `.agents/plugins/marketplace.json` and assert:

```js
assert.equal(marketplace.name, 'harness-engineering-local');
assert.deepEqual(marketplace.plugins, [{
  name: 'harness-engineering',
  source: {
    source: 'local',
    path: './plugins/harness-engineering'
  },
  policy: {
    installation: 'AVAILABLE',
    authentication: 'ON_INSTALL'
  },
  category: 'Developer Tools'
}]);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/harness-product/install.test.mjs
```

Expected: FAIL with `ENOENT` for the missing marketplace file.

- [ ] **Step 3: Add the marketplace and generated-output ignore**

Create the exact tested JSON shape and add:

```gitignore
/plugins/harness-engineering/
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/harness-product/install.test.mjs
```

Expected: marketplace contract passes.

- [ ] **Step 5: Commit the marketplace contract**

```bash
git add .agents/plugins/marketplace.json .gitignore \
  tests/harness-product/install.test.mjs
git commit -m "feat: add local harness marketplace"
```

### Task 3: Implement Safe One-Command Installation

**Files:**
- Modify: `tests/harness-product/install.test.mjs`
- Create: `scripts/install-harness-plugin.mjs`

- [ ] **Step 1: Write failing cachebuster and safety tests**

Cover:

```js
assert.equal(
  withCachebuster('0.1.0+codex.old', 'local-20260628-120000'),
  '0.1.0+codex.local-20260628-120000'
);
await assert.rejects(
  installPlugin({marketplaceRoot: unsafeRoot, runCodex}),
  /refusing to replace unexpected plugin directory/
);
```

Also verify duplicate/unknown/missing CLI arguments return exit code 2 without
creating plugin output.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
node --test tests/harness-product/install.test.mjs
```

Expected: FAIL because the installer module and exports do not exist.

- [ ] **Step 3: Implement argument and cachebuster helpers**

Expose:

```js
function withCachebuster(version, token) {
  const base = version.split('+', 1)[0];
  return `${base}+codex.${token}`;
}
```

Support:

```text
--marketplace-root <directory>
--codex-bin <executable>
--cachebuster <token>
--help
```

Reject path separators and non `[A-Za-z0-9.-]` cachebuster characters.

- [ ] **Step 4: Implement staged publication and guarded replacement**

Package into a temporary sibling root, update only the staged
`.codex-plugin/plugin.json` version, verify any existing destination is a real
directory with plugin name `harness-engineering`, then replace only that
generated destination.

- [ ] **Step 5: Implement Codex CLI orchestration**

Run and parse:

```text
codex plugin marketplace add <marketplace-root> --json
codex plugin add harness-engineering@harness-engineering-local --json
codex plugin list --available --json
```

Require an installed, enabled record whose version equals the generated
cache-busted version. Emit:

```json
{
  "schemaVersion": "1.0.0",
  "pluginId": "harness-engineering@harness-engineering-local",
  "version": "0.1.0+codex.<token>",
  "installedPath": "<Codex cache path>",
  "skills": [
    "harness-engineering:harness-creator",
    "harness-engineering:harness-doctor"
  ],
  "newThreadRequired": true
}
```

- [ ] **Step 6: Test the installer with an injected fake Codex runner**

Assert exact command order, JSON parsing, enabled-state verification, stable
summary keys, and propagated stderr for failed CLI commands.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run:

```bash
node --test tests/harness-product/install.test.mjs
```

Expected: all marketplace, helper, safety, and orchestration tests pass.

- [ ] **Step 8: Commit the installer**

```bash
git add scripts/install-harness-plugin.mjs tests/harness-product/install.test.mjs
git commit -m "feat: install harness plugin from local marketplace"
```

### Task 4: Prove Fresh-Process Discovery And Packaged Execution

**Files:**
- Create: `scripts/verify-harness-plugin-install.mjs`
- Modify: `tests/harness-product/install.test.mjs`
- Modify: `init.sh`

- [ ] **Step 1: Write the failing verifier smoke test**

Invoke the verifier and assert exit zero plus:

```js
assert.deepEqual(result.skills, [
  'harness-engineering:harness-creator',
  'harness-engineering:harness-doctor'
]);
assert.equal(result.contextFeature, 'harness-context-restoration');
assert.equal(result.doctor.environmentRecommendation, 'Add environment metadata.');
```

- [ ] **Step 2: Run the smoke test and verify RED**

Run:

```bash
node --test tests/harness-product/install.test.mjs
```

Expected: FAIL because the verifier does not exist.

- [ ] **Step 3: Implement isolated real-Codex verification**

The verifier must:

1. create temporary marketplace, `CODEX_HOME`, and target roots;
2. copy the committed marketplace file;
3. call `installPlugin` with cachebuster `verify`;
4. run `codex debug prompt-input` under the isolated home;
5. assert both namespaced skills and installed cache paths are visible;
6. run installed Creator plan/apply on the empty target;
7. run the generated `./init.sh`;
8. run installed Doctor and assert the precise environment recommendation;
9. remove all temporary roots in `finally`.

- [ ] **Step 4: Integrate the verifier into startup checks**

Add both scripts and the marketplace file to `required_paths`, then run:

```bash
node scripts/verify-harness-plugin-install.mjs
```

once in the Harness Product section.

- [ ] **Step 5: Run product and startup verification**

Run:

```bash
node --test tests/harness-product/*.test.mjs
./init.sh
```

Expected: real isolated installation, discovery, Creator, init, and Doctor all
pass without changing the live Codex profile.

- [ ] **Step 6: Commit the E2E verifier**

```bash
git add scripts/verify-harness-plugin-install.mjs \
  tests/harness-product/install.test.mjs init.sh
git commit -m "test: verify fresh harness plugin installation"
```

### Task 5: Document, Install Live, And Close The Feature

**Files:**
- Modify: `docs/index.md`
- Create: `docs/evolution/0011-harness-direct-installation.md`
- Modify: `docs/evolution/index.md`
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`

- [ ] **Step 1: Add the user-facing install and invocation path**

Document:

```bash
node scripts/install-harness-plugin.mjs
```

and the new-thread invocations:

```text
$harness-engineering:harness-creator
$harness-engineering:harness-doctor
```

State explicitly that the old bare `$harness-creator` is not this plugin.

- [ ] **Step 2: Run the complete repository verification**

Run:

```bash
node --test packages/harness-core/test/*.test.mjs \
  tests/harness-doctor/*.test.mjs \
  tests/harness-creator/*.test.mjs \
  tests/harness-product/*.test.mjs \
  tests/field-validation/*.test.mjs
node scripts/verify-harness-plugin-install.mjs
./init.sh
git diff --check
```

Expected: all tests and isolated product checks pass.

- [ ] **Step 3: Install into the live Codex profile**

Run:

```bash
node scripts/install-harness-plugin.mjs
```

Then verify:

```bash
codex plugin list --available --json
codex debug prompt-input 'Use the installed Harness Engineering plugin.'
```

Expected: the plugin is installed and enabled, and both canonical skills point
at the installed cache path.

- [ ] **Step 4: Record durable evidence**

Write the stage record with:

- the baseline gap;
- the rejected loose-skill and alias approaches;
- isolated and live install evidence;
- Creator/init/Doctor evidence;
- the precise-recommendation defect and fix;
- the remaining `observed`, not general Effectiveness, boundary.

Mark `feat-013` done only after all command evidence is recorded.

- [ ] **Step 5: Run final verification after state updates**

Run:

```bash
./init.sh
git diff --check
git status --short
```

Expected: verification passes and only intended completion documents are
modified.

- [ ] **Step 6: Commit the completed feature**

```bash
git add docs/index.md docs/evolution/0011-harness-direct-installation.md \
  docs/evolution/index.md feature_list.json progress.md session-handoff.md
git commit -m "docs: record direct harness installation"
```
