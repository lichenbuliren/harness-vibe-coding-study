import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdtemp,
  readFile,
  readdir,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createPlan
} from '../../skills/harness-creator/scripts/planner.mjs';
import {
  validateFeatureState
} from '../../packages/harness-core/src/index.mjs';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const coreFixtures = path.join(
  repositoryRoot,
  'packages',
  'harness-core',
  'test',
  'fixtures'
);

async function temporaryTarget() {
  return mkdtemp(path.join(os.tmpdir(), 'harness-creator-plan-'));
}

async function treeDigest(root) {
  const hash = createHash('sha256');

  async function visit(relativeDirectory) {
    const entries = await readdir(path.join(root, relativeDirectory), {
      withFileTypes: true
    });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const relativePath = path.posix.join(relativeDirectory, entry.name);
      hash.update(relativePath);
      if (entry.isDirectory()) {
        await visit(relativePath);
      } else {
        hash.update(await readFile(path.join(root, relativePath)));
      }
    }
  }

  await visit('');
  return hash.digest('hex');
}

function action(plan, relativePath) {
  return plan.actions.find((item) => item.path === relativePath);
}

test('empty target produces a stable read-only creation plan', async () => {
  const root = await temporaryTarget();
  const before = await treeDigest(root);
  const first = await createPlan({root});
  const second = await createPlan({root});
  const after = await treeDigest(root);

  assert.equal(before, after);
  assert.deepEqual(first, second);
  assert.match(first.planId, /^[a-f0-9]{64}$/);
  assert.equal(first.target, '.');
  assert.equal(JSON.stringify(first).includes(root), false);
  assert.deepEqual(
    first.actions.filter((item) => item.operation === 'create')
      .map((item) => item.path),
    [
      '.harness/manifest.json',
      'AGENTS.md',
      'feature_list.json',
      'init.sh',
      'progress.md'
    ]
  );
  const featureState = JSON.parse(action(first, 'feature_list.json').content);
  assert.equal(validateFeatureState(featureState).valid, true);
  assert.equal(featureState.features[0].id, 'harness-context-restoration');
  assert.equal(featureState.features[0].status, 'next');
});

test('valid feature state receives a semantic context bootstrap merge', async () => {
  const root = await temporaryTarget();
  const original = {
    schemaVersion: '1.0.0',
    mode: 'serial',
    features: [{
      id: 'product-001',
      name: 'Existing Product Work',
      behavior: 'Preserve this exact project-owned feature.',
      dependencies: [],
      status: 'in-progress',
      verification: {
        kind: 'manual',
        steps: ['Review the existing behavior.']
      },
      evidence: []
    }]
  };
  await writeFile(path.join(root, 'AGENTS.md'), '# Existing instructions\n');
  await writeFile(
    path.join(root, 'feature_list.json'),
    `${JSON.stringify(original, null, 2)}\n`
  );

  const plan = await createPlan({root});
  const featureAction = action(plan, 'feature_list.json');
  const merged = JSON.parse(featureAction.content);

  assert.equal(action(plan, 'AGENTS.md').operation, 'skip');
  assert.equal(featureAction.operation, 'merge');
  assert.equal(featureAction.precondition.kind, 'sha256');
  assert.deepEqual(merged.features[0], original.features[0]);
  assert.equal(merged.features[1].id, 'harness-context-restoration');
  assert.equal(merged.features[1].status, 'not-started');
  assert.equal(validateFeatureState(merged).valid, true);
});

test('existing context creates empty state instead of invented work', async () => {
  const root = await temporaryTarget();
  await writeFile(path.join(root, 'AGENTS.md'), '# Instructions\n');
  await writeFile(path.join(root, 'CONTEXT.md'), '# Real project context\n');

  const plan = await createPlan({root});
  const featureState = JSON.parse(action(plan, 'feature_list.json').content);

  assert.deepEqual(featureState.features, []);
  assert.doesNotMatch(action(plan, 'progress.md').content, /Context Restoration/);
});

test('malformed feature state blocks rather than rewrites', async () => {
  const root = await temporaryTarget();
  await writeFile(path.join(root, 'feature_list.json'), '{"features":');

  const plan = await createPlan({root});

  assert.equal(action(plan, 'feature_list.json').operation, 'block');
  assert.equal(
    plan.actions.some((item) => item.operation === 'block'),
    true
  );
});

test('operational and non-standard targets preserve discovered equivalents', async () => {
  for (const fixtureName of ['operational', 'nonstandard']) {
    const root = path.join(coreFixtures, fixtureName);
    const before = await treeDigest(root);
    const plan = await createPlan({root});
    const after = await treeDigest(root);

    assert.equal(before, after);
    assert.equal(
      plan.actions.some((item) => item.operation === 'merge'),
      false
    );
    assert.equal(
      plan.actions.some((item) => item.operation === 'block'),
      false
    );
    assert.equal(
      plan.actions.filter((item) => item.operation === 'skip').length >= 4,
      true
    );
  }
});

test('planner uses one shared-core inspection and no write API', async () => {
  const source = await readFile(
    path.join(
      repositoryRoot,
      'skills',
      'harness-creator',
      'scripts',
      'planner.mjs'
    ),
    'utf8'
  );

  assert.equal((source.match(/await inspectHarness\(/g) ?? []).length, 1);
  assert.doesNotMatch(source, /writeFile|appendFile|copyFile|rename|mkdir/);
});
