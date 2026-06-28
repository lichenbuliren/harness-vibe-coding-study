import assert from 'node:assert/strict';
import {
  access,
  readFile,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { applyPlan } from '../../skills/harness-archiver/scripts/apply.mjs';
import { createPlan } from '../../skills/harness-archiver/scripts/planner.mjs';
import { fixture, git, treeDigest } from './helpers.mjs';

const evolutionPath = 'docs/evolution/0001-fixture.md';
const threadId = '019f0c3d-8d3b-77d2-93c6-9684d44fe7e2';

test('apply creates the immutable snapshot and compacts current state', async () => {
  const root = await fixture();
  const plan = await createPlan({root, evolutionPath, threadId});
  const result = await applyPlan({
    root,
    evolutionPath,
    planId: plan.planId,
    threadId
  });
  const snapshot = path.join(
    root,
    'docs/evolution/snapshots',
    plan.stage.stageId
  );
  assert.equal(result.stageId, plan.stage.stageId);
  await access(path.join(snapshot, 'stage.json'));
  await access(path.join(snapshot, 'feature_list.json'));
  await access(path.join(snapshot, 'progress.md'));
  assert.equal(
    (await readFile(path.join(root, '.harness/baseline'), 'utf8')).trim(),
    plan.stage.stageId
  );
  assert.deepEqual(
    JSON.parse(await readFile(path.join(root, 'feature_list.json'), 'utf8'))
      .features,
    []
  );
  assert.match(await readFile(path.join(root, 'progress.md'), 'utf8'), /No active/);
  assert.equal((await applyPlan({
    root,
    evolutionPath,
    planId: plan.planId,
    threadId
  })).status, 'unchanged');
});

test('stale plans and injected failures do not leave partial state', async () => {
  const stale = await fixture();
  const plan = await createPlan({root: stale, evolutionPath, threadId});
  await writeFile(path.join(stale, 'progress.md'), '# changed\n');
  await assert.rejects(
    applyPlan({
      root: stale,
      evolutionPath,
      planId: plan.planId,
      threadId
    }),
    {code: 'STALE_PLAN'}
  );

  const rollback = await fixture();
  const rollbackPlan = await createPlan({
    root: rollback,
    evolutionPath,
    threadId
  });
  const before = await treeDigest(rollback);
  await assert.rejects(
    applyPlan({
      root: rollback,
      evolutionPath,
      planId: rollbackPlan.planId,
      threadId,
      injectFailureAfter: 2
    }),
    {code: 'INJECTED_FAILURE'}
  );
  assert.equal(await treeDigest(rollback), before);
});

test('identical snapshots are idempotent and mismatched snapshots block', async () => {
  const root = await fixture();
  const plan = await createPlan({root, evolutionPath, threadId});
  await applyPlan({root, evolutionPath, planId: plan.planId, threadId});
  await git(root, 'add', '.');
  await git(root, 'commit', '-m', 'archive');
  const compactPlan = await createPlan({root, evolutionPath, threadId});
  assert.equal(compactPlan.eligible, false);

  const mismatch = await fixture();
  const mismatchPlan = await createPlan({
    root: mismatch,
    evolutionPath,
    threadId
  });
  const snapshot = path.join(
    mismatch,
    'docs/evolution/snapshots',
    mismatchPlan.stage.stageId
  );
  await import('node:fs/promises').then(({mkdir}) => mkdir(snapshot, {
    recursive: true
  }));
  await writeFile(path.join(snapshot, 'stage.json'), '{}\n');
  await assert.rejects(
    applyPlan({
      root: mismatch,
      evolutionPath,
      planId: mismatchPlan.planId,
      threadId
    }),
    {code: 'SNAPSHOT_CONFLICT'}
  );
});
