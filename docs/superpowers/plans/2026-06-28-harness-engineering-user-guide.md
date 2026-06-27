# Harness Engineering User Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one accurate onboarding guide that takes repository collaborators from local plugin installation through Creator, Context restoration, initialization, Doctor diagnosis, maintenance, and troubleshooting while stating the external distribution boundary.

**Architecture:** Keep `docs/harness-engineering-guide.md` as the single user-facing source of truth. Link to it from the review-map README and documentation index, and protect canonical commands, ordering, namespace, and evidence boundaries with one focused Node test. Do not change plugin metadata because the current local package has no stable public documentation URL and a repository-relative URL would not survive installation.

**Tech Stack:** Markdown, Node.js built-in test runner, repository lifecycle JSON, existing `init.sh`.

---

## File Map

- Create `docs/harness-engineering-guide.md`: complete progressive onboarding guide.
- Create `tests/harness-product/documentation.test.mjs`: documentation contract and navigation checks.
- Modify `README.md`: add one product-user entry without changing its review-map role.
- Modify `docs/index.md`: make the guide the primary Harness product entry and keep implementation links secondary.
- Modify `feature_list.json`: track the guide as one serial feature with verification evidence.
- Modify `progress.md`: record completion, evidence, limitations, and next user-validation step.
- Modify `session-handoff.md`: preserve the restart path and guide validation evidence.
- Create `docs/evolution/0012-harness-engineering-user-guide.md`: durable stage outcome and remaining public-distribution boundary.
- Modify `docs/evolution/index.md`: link evolution stage 0012.
- Modify `init.sh`: run the focused documentation contract with the product suite.

### Task 1: Add The Documentation Contract

**Files:**
- Create: `tests/harness-product/documentation.test.mjs`
- Modify: `feature_list.json`

- [ ] **Step 1: Add `feat-014` as the only active feature**

Append a serial feature with:

```json
{
  "id": "feat-014",
  "name": "Harness Engineering User Guide",
  "behavior": "Provide one progressive guide for local installation, first use, interpretation, maintenance, troubleshooting, and the current external distribution boundary.",
  "dependencies": ["feat-013"],
  "status": "in-progress",
  "verification": {
    "kind": "command",
    "steps": [
      "node --test tests/harness-product/documentation.test.mjs",
      "./init.sh",
      "git diff --check"
    ]
  },
  "evidence": []
}
```

- [ ] **Step 2: Write the failing documentation contract**

Create a Node test that reads the guide, README, and docs index. Use helpers:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

async function read(relative) {
  return readFile(path.join(repositoryRoot, relative), 'utf8');
}
```

The tests must assert:

```js
test('guide preserves the canonical first-run workflow', async () => {
  const guide = await read('docs/harness-engineering-guide.md');
  const markers = [
    'node scripts/install-harness-plugin.mjs',
    '新建 Codex thread',
    '$harness-engineering:harness-creator',
    'Project Context Restoration',
    './init.sh',
    '$harness-engineering:harness-doctor'
  ];
  let cursor = -1;
  for (const marker of markers) {
    const next = guide.indexOf(marker, cursor + 1);
    assert.notEqual(next, -1, `missing workflow marker: ${marker}`);
    assert.ok(next > cursor, `workflow marker is out of order: ${marker}`);
    cursor = next;
  }
});

test('guide states namespace and evidence boundaries', async () => {
  const guide = await read('docs/harness-engineering-guide.md');
  assert.match(guide, /bare.*\\$harness-creator|裸名.*\\$harness-creator/s);
  assert.match(guide, /Readiness/);
  assert.match(guide, /Effectiveness/);
  assert.match(guide, /尚未.*公开|没有.*公开/s);
  assert.doesNotMatch(guide, /npm install.*harness-engineering/);
});

test('repository navigation links to the user guide', async () => {
  for (const relative of ['README.md', 'docs/index.md']) {
    assert.match(
      await read(relative),
      /harness-engineering-guide\\.md/,
      `${relative} must link to the guide`
    );
  }
});
```

- [ ] **Step 3: Run the contract and verify RED**

Run:

```bash
node --test tests/harness-product/documentation.test.mjs
```

Expected: FAIL with `ENOENT` for `docs/harness-engineering-guide.md`.

- [ ] **Step 4: Commit the red contract**

```bash
git add feature_list.json tests/harness-product/documentation.test.mjs
git commit -m "test: define harness user guide contract"
```

### Task 2: Write The Progressive User Guide

**Files:**
- Create: `docs/harness-engineering-guide.md`
- Test: `tests/harness-product/documentation.test.mjs`

- [ ] **Step 1: Write the product and distribution introduction**

State that the plugin creates or improves a minimal restartable coding-agent
harness and diagnoses structural readiness. Explain that current installation
requires this repository and its local marketplace; there is no public
marketplace or standalone external install yet.

- [ ] **Step 2: Write the five-minute workflow**

Include this exact ordered path:

```bash
node scripts/install-harness-plugin.mjs
```

Then instruct the user to start a new Codex thread and invoke:

```text
$harness-engineering:harness-creator
```

Explain plan review and apply, Context restoration, `./init.sh`, then:

```text
$harness-engineering:harness-doctor
```

- [ ] **Step 3: Document Creator behavior and options**

Cover:

- plan before apply and exact `planId`;
- `AGENTS.md` default or `--agent-file CLAUDE.md`;
- optional `--with-handoff`;
- skip, merge, blocked, stale, and non-overwrite behavior;
- project-owned facts and the real `Project Context Restoration` task;
- no dependency installation, network access, service startup, deletion, or
  target command execution during creation.

List internal CLI syntax only under an advanced command reference:

```text
creator plan --target <directory> [--agent-file AGENTS.md|CLAUDE.md] [--with-handoff] [--format text|json] [--pretty]
creator apply --target <directory> --plan-id <sha256> [--agent-file AGENTS.md|CLAUDE.md] [--with-handoff] [--format text|json] [--pretty]
```

- [ ] **Step 4: Document Doctor interpretation and formats**

Explain Instructions, Tools, Environment, State, and Feedback with levels
`0 Missing`, `1 Present`, `2 Operational`, and `Unknown`. State that low
dimensions are candidate bottlenecks rather than proven causes. Document:

```text
doctor --target <directory> [--manifest <relative-path>] [--format text|json|markdown|html] [--pretty]
```

Clarify that Doctor is read-only and `--pretty` is JSON-only.

- [ ] **Step 5: Document non-standard paths and maintenance**

Explain that `.harness/manifest.json` declares safe repository-relative
equivalents, but declarations do not make missing or invalid artifacts
operational.

State:

- rerun `node scripts/install-harness-plugin.mjs` to install a new cache-busted
  local build;
- start a new thread after install or update;
- `plugins/harness-engineering/` and the Codex cache are generated copies;
- only `packages/harness-core/` and repository skill sources are edited;
- uninstall through `codex plugin remove
  harness-engineering@harness-engineering-local`;
- remove the local marketplace separately with `codex plugin marketplace
  remove harness-engineering-local` only when the user no longer needs this
  repository registration.

- [ ] **Step 6: Add troubleshooting and evidence boundaries**

Cover missing namespaced skills, legacy bare-name confusion, blocked plans,
stale plan IDs, incomplete Context, `Unknown`, cache identity, and unsupported
public installation. End with the rule that structural Readiness does not
prove task Effectiveness.

- [ ] **Step 7: Run the focused contract and verify GREEN**

Run:

```bash
node --test tests/harness-product/documentation.test.mjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 8: Commit the guide**

```bash
git add docs/harness-engineering-guide.md
git commit -m "docs: add harness engineering user guide"
```

### Task 3: Connect Navigation And Restart Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/index.md`
- Modify: `init.sh`
- Test: `tests/harness-product/documentation.test.mjs`

- [ ] **Step 1: Add the README entry**

Under `如何阅读这个仓库`, add:

```markdown
- [`docs/harness-engineering-guide.md`](docs/harness-engineering-guide.md)：
  `harness-engineering` plugin 的安装、首次使用和故障排查指南。
```

- [ ] **Step 2: Make the guide the primary docs product entry**

At the start of `Harness 产品实现`, add:

```markdown
- [`harness-engineering-guide.md`](harness-engineering-guide.md)：面向接入用户的
  完整安装、首次运行、结果解释、维护和故障排查指南。
```

Keep source-package and internal skill links as implementation references.

- [ ] **Step 3: Add the contract to `init.sh`**

Run the documentation contract immediately before or as part of the Harness
Product check:

```bash
node --test tests/harness-product/*.test.mjs
```

If the existing wildcard already includes the new test, make no command change;
verify that the reported product test count increases by three.

- [ ] **Step 4: Run navigation and product checks**

```bash
node --test tests/harness-product/*.test.mjs
```

Expected: all product tests pass and the total is three higher than the
previous 18-test baseline.

- [ ] **Step 5: Commit navigation**

```bash
git add README.md docs/index.md init.sh
git commit -m "docs: link harness onboarding guide"
```

### Task 4: Record Outcome And Verify The Repository

**Files:**
- Create: `docs/evolution/0012-harness-engineering-user-guide.md`
- Modify: `docs/evolution/index.md`
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`

- [ ] **Step 1: Write evolution stage 0012**

Record:

- the prior fragmented onboarding surface;
- the progressive single-guide decision;
- the tested canonical first-run sequence;
- why plugin metadata was not given a repository-relative docs URL;
- the local-versus-public distribution boundary;
- the next validation: an unfamiliar user following only the guide.

- [ ] **Step 2: Close `feat-014` with fresh evidence**

Set `status` to `done` and add one passing evidence object for each verification
step. Evidence must report actual fresh counts from Task 3 and Task 4, not the
expected counts in this plan.

- [ ] **Step 3: Update progress and handoff**

Set Active Feature to none. Record the guide path, contract result, `./init.sh`
result, and the unresolved need for unfamiliar-user onboarding validation.

- [ ] **Step 4: Run final verification**

```bash
node --test tests/harness-product/documentation.test.mjs
./init.sh
git diff --check
```

Expected:

- focused documentation contract passes;
- all core, Doctor, Creator, Product, and Field checks pass;
- official validators pass;
- no whitespace errors.

- [ ] **Step 5: Commit the completed feature**

```bash
git add docs/evolution/0012-harness-engineering-user-guide.md \
  docs/evolution/index.md feature_list.json progress.md session-handoff.md
git commit -m "docs: record harness onboarding guide"
```

- [ ] **Step 6: Confirm repository state**

```bash
git status --short --branch
git log --oneline -5
```

Expected: clean working tree, `feat-014` done, and no `next` or `in-progress`
feature.
