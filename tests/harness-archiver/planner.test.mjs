import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { createPlan } from '../../skills/harness-archiver/scripts/planner.mjs';
import { fixture, git, treeDigest } from './helpers.mjs';

test('planning is read-only and deterministic', async () => {
  const root = await fixture();
  const before = await treeDigest(root);
  const first = await createPlan({
    root,
    evolutionPath: 'docs/evolution/0001-fixture.md'
  });
  const second = await createPlan({
    root,
    evolutionPath: 'docs/evolution/0001-fixture.md'
  });
  assert.equal(await treeDigest(root), before);
  assert.deepEqual(first, second);
  assert.equal(first.eligible, true);
  assert.match(first.stage.stageId, /^stage-[0-9a-f]{16}$/u);
  assert.match(first.planId, /^[0-9a-f]{64}$/u);
  assert.deepEqual(
    first.actions.map((item) => item.path),
    [...first.actions.map((item) => item.path)].sort()
  );
});

test('unfinished, dirty, detached, missing evolution, and unsafe paths block', async () => {
  const unfinished = await fixture({status: 'in-progress'});
  assert.equal((await createPlan({
    root: unfinished,
    evolutionPath: 'docs/evolution/0001-fixture.md'
  })).eligible, false);

  const dirty = await fixture();
  await writeFile(path.join(dirty, 'progress.md'), '# dirty\n');
  assert.ok((await createPlan({
    root: dirty,
    evolutionPath: 'docs/evolution/0001-fixture.md'
  })).findings.some((item) => item.code === 'dirty-worktree'));

  const detached = await fixture();
  await git(detached, 'checkout', '--detach');
  assert.ok((await createPlan({
    root: detached,
    evolutionPath: 'docs/evolution/0001-fixture.md'
  })).findings.some((item) => item.code === 'detached-head'));

  const missing = await fixture();
  assert.equal((await createPlan({
    root: missing,
    evolutionPath: 'docs/evolution/missing.md'
  })).eligible, false);
  assert.equal((await createPlan({
    root: missing,
    evolutionPath: '../escape.md'
  })).eligible, false);
});
