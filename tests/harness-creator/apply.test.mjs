import assert from 'node:assert/strict';
import {
  access,
  mkdtemp,
  readFile,
  stat,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  applyPlan
} from '../../skills/harness-creator/scripts/apply.mjs';
import {
  createPlan
} from '../../skills/harness-creator/scripts/planner.mjs';
import {
  claimBranchLease,
  readBranchLease,
  validateFeatureState
} from '../../packages/harness-core/src/index.mjs';
import {
  fixture as archiveFixture,
  git
} from '../harness-archiver/helpers.mjs';

async function temporaryTarget() {
  return mkdtemp(path.join(os.tmpdir(), 'harness-creator-apply-'));
}

async function doesNotExist(filePath) {
  await assert.rejects(access(filePath), {code: 'ENOENT'});
}

test('applies an accepted empty-target plan with exclusive creates', async () => {
  const root = await temporaryTarget();
  const plan = await createPlan({root});
  const result = await applyPlan({root, planId: plan.planId});

  assert.equal(result.plan.planId, plan.planId);
  assert.deepEqual(
    result.results.map((item) => [item.path, item.status]),
    [
      ['.harness/manifest.json', 'created'],
      ['AGENTS.md', 'created'],
      ['feature_list.json', 'created'],
      ['init.sh', 'created'],
      ['progress.md', 'created']
    ]
  );
  assert.equal(
    validateFeatureState(JSON.parse(
      await readFile(path.join(root, 'feature_list.json'), 'utf8')
    )).valid,
    true
  );
  assert.notEqual((await stat(path.join(root, 'init.sh'))).mode & 0o111, 0);
  assert.equal(result.assessmentAfter.subsystems.state.level, 2);
  assert.equal(result.assessmentAfter.effectiveness.status, 'not-assessed');
});

test('rejects a stale plan before any Creator write', async () => {
  const root = await temporaryTarget();
  const plan = await createPlan({root});
  await writeFile(path.join(root, 'AGENTS.md'), '# Concurrent project change\n');

  await assert.rejects(
    applyPlan({root, planId: plan.planId}),
    (error) => error.code === 'STALE_PLAN'
  );
  await doesNotExist(path.join(root, 'feature_list.json'));
  await doesNotExist(path.join(root, 'progress.md'));
  await doesNotExist(path.join(root, 'init.sh'));
  await doesNotExist(path.join(root, '.harness'));
});

test('rejects a blocked plan without partial creation', async () => {
  const root = await temporaryTarget();
  await writeFile(path.join(root, 'feature_list.json'), '{"features":');
  const plan = await createPlan({root});

  await assert.rejects(
    applyPlan({root, planId: plan.planId}),
    (error) => error.code === 'BLOCKED_PLAN'
  );
  assert.equal(
    await readFile(path.join(root, 'feature_list.json'), 'utf8'),
    '{"features":'
  );
  await doesNotExist(path.join(root, 'AGENTS.md'));
  await doesNotExist(path.join(root, 'progress.md'));
});

test('applies a context feature merge without changing existing feature values', async () => {
  const root = await temporaryTarget();
  const existingFeature = {
    id: 'existing-001',
    name: 'Existing Work',
    behavior: 'Keep this behavior.',
    dependencies: [],
    status: 'in-progress',
    verification: {
      kind: 'manual',
      steps: ['Review it.']
    },
    evidence: []
  };
  await writeFile(path.join(root, 'AGENTS.md'), '# Instructions\n');
  await writeFile(path.join(root, 'feature_list.json'), `${JSON.stringify({
    schemaVersion: '1.0.0',
    mode: 'serial',
    features: [existingFeature]
  }, null, 2)}\n`);
  const plan = await createPlan({root});

  const result = await applyPlan({root, planId: plan.planId});
  const document = JSON.parse(
    await readFile(path.join(root, 'feature_list.json'), 'utf8')
  );

  assert.deepEqual(document.features[0], existingFeature);
  assert.equal(document.features[1].id, 'harness-context-restoration');
  assert.equal(document.features[1].status, 'not-started');
  assert.equal(
    result.results.find((item) => item.path === 'feature_list.json').status,
    'merged'
  );
});

test('repeat planning and skip-only apply are stable', async () => {
  const root = await temporaryTarget();
  const firstPlan = await createPlan({root});
  await applyPlan({root, planId: firstPlan.planId});
  const secondPlan = await createPlan({root});
  const repeatedPlan = await createPlan({root});
  const result = await applyPlan({root, planId: secondPlan.planId});

  assert.deepEqual(secondPlan, repeatedPlan);
  assert.equal(
    result.results.every((item) => item.status === 'skipped'),
    true
  );
  await assert.rejects(
    applyPlan({root, planId: firstPlan.planId}),
    (error) => error.code === 'STALE_PLAN'
  );
});

test('applier does not execute target commands or access the network', async () => {
  const source = await readFile(
    new URL('../../skills/harness-creator/scripts/apply.mjs', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(source, /child_process|execFile|spawn|fetch\(|https?:/);
  assert.match(source, /flag: 'wx'/);
});

test('apply blocks foreign owners and releases only its temporary lease', async () => {
  const foreignRoot = await archiveFixture();
  await claimBranchLease({
    root: foreignRoot,
    featureId: 'feat-a',
    threadId: 'thread-a'
  });
  const foreignPlan = await createPlan({
    root: foreignRoot,
    threadId: 'thread-b'
  });
  await assert.rejects(
    applyPlan({
      root: foreignRoot,
      planId: foreignPlan.planId,
      threadId: 'thread-b'
    }),
    {code: 'BLOCKED_PLAN'}
  );

  const root = await temporaryTarget();
  await git(root, 'init', '-b', 'codex/creator-lease');
  await git(root, 'config', 'user.name', 'Harness Test');
  await git(root, 'config', 'user.email', 'harness@example.test');
  await git(root, 'commit', '--allow-empty', '-m', 'initial');
  const plan = await createPlan({root, threadId: 'thread-owner'});
  await applyPlan({
    root,
    planId: plan.planId,
    threadId: 'thread-owner'
  });
  assert.equal((await readBranchLease({
    root,
    threadId: 'thread-owner'
  })).status, 'missing');
});
