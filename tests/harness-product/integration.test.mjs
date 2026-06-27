import assert from 'node:assert/strict';
import {
  cp,
  mkdtemp,
  readFile,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

import {
  packagedProduct,
  readinessProfile,
  runNode,
  treeDigest
} from './helpers.mjs';

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

async function temporaryTarget(prefix) {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

async function plan(creator, target) {
  const result = await runNode(
    creator,
    ['plan', '--target', target, '--format', 'json'],
    {cwd: target}
  );
  assert.equal(result.code, 0, result.stderr);
  return JSON.parse(result.stdout);
}

async function diagnose(doctor, target) {
  const result = await runNode(
    doctor,
    ['--target', target, '--format', 'json'],
    {cwd: target}
  );
  assert.equal(result.code, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('packaged Creator and Doctor complete the conventional context workflow', async () => {
  const {creator, doctor} = await packagedProduct();
  const target = await temporaryTarget('harness-e2e-conventional-');
  await writeFile(path.join(target, 'package.json'), `${JSON.stringify({
    name: 'representative-node-project',
    private: true,
    scripts: {
      test: 'node --test'
    }
  }, null, 2)}\n`);

  const beforePlan = await treeDigest(target);
  const firstPlan = await plan(creator, target);
  assert.equal(await treeDigest(target), beforePlan);
  assert.equal(
    firstPlan.actions.some((action) => action.operation === 'block'),
    false
  );

  const applied = await runNode(
    creator,
    [
      'apply',
      '--target',
      target,
      '--plan-id',
      firstPlan.planId,
      '--format',
      'json'
    ],
    {cwd: target}
  );
  assert.equal(applied.code, 0, applied.stderr);
  const application = JSON.parse(applied.stdout);
  assert.deepEqual(readinessProfile(application.assessmentAfter), {
    instructions: 1,
    tools: 2,
    environment: 2,
    state: 2,
    feedback: 2
  });

  const firstDiagnosisBefore = await treeDigest(target);
  const firstDiagnosis = await diagnose(doctor, target);
  assert.equal(await treeDigest(target), firstDiagnosisBefore);
  assert.deepEqual(firstDiagnosis.candidateBottlenecks, ['instructions']);
  assert.equal(firstDiagnosis.effectiveness.status, 'not-assessed');

  await writeFile(path.join(target, 'CONTEXT.md'), `# Project Context

## Mission

Exercise safe harness integration for a representative Node project.

## Scope

This fixture owns only local files and never reaches production services.

## Canonical Language

Creator proposes changes; Doctor reports Readiness.

## Product Boundaries

Project facts remain project-owned. The packaged plugin supplies mechanics.

## Evidence Status

Initialization and diagnosis are verified by this integration test.

## Restart Assumptions

Resume from feature_list.json, progress.md, and init.sh.
`);
  const featurePath = path.join(target, 'feature_list.json');
  const featureState = JSON.parse(await readFile(featurePath, 'utf8'));
  assert.equal(featureState.features[0].id, 'harness-context-restoration');
  featureState.features[0].status = 'done';
  featureState.features[0].evidence = [{
    status: 'passed',
    summary: 'The project owner supplied and reviewed all six context areas.'
  }];
  await writeFile(
    featurePath,
    `${JSON.stringify(featureState, null, 2)}\n`
  );

  const completedDiagnosis = await diagnose(doctor, target);
  assert.deepEqual(readinessProfile(completedDiagnosis), {
    instructions: 2,
    tools: 2,
    environment: 2,
    state: 2,
    feedback: 2
  });
  assert.deepEqual(completedDiagnosis.candidateBottlenecks, []);
  assert.equal(completedDiagnosis.effectiveness.status, 'not-assessed');

  const resumedPlan = await plan(creator, target);
  assert.equal(
    resumedPlan.actions.every((action) => action.operation === 'skip'),
    true
  );
  assert.deepEqual(resumedPlan, await plan(creator, target));
});

test('packaged commands preserve a manifest-declared non-standard project', async () => {
  const {creator, doctor} = await packagedProduct();
  const target = await temporaryTarget('harness-e2e-nonstandard-');
  await cp(path.join(coreFixtures, 'nonstandard'), target, {
    recursive: true,
    force: false,
    errorOnExist: false
  });

  const before = await treeDigest(target);
  const creatorPlan = await plan(creator, target);
  const diagnosis = await diagnose(doctor, target);

  assert.equal(await treeDigest(target), before);
  assert.equal(
    creatorPlan.actions.every((action) => action.operation === 'skip'),
    true
  );
  assert.deepEqual(readinessProfile(diagnosis), {
    instructions: 2,
    tools: 2,
    environment: 2,
    state: 2,
    feedback: 2
  });
  assert.deepEqual(diagnosis.candidateBottlenecks, []);
});

test('packaged conflict planning and apply leave the target unchanged', async () => {
  const {creator} = await packagedProduct();
  const target = await temporaryTarget('harness-e2e-conflict-');
  await writeFile(path.join(target, 'AGENTS.md'), '');

  const before = await treeDigest(target);
  const blockedPlan = await plan(creator, target);
  assert.equal(
    blockedPlan.actions.some((action) =>
      action.path === 'AGENTS.md' && action.operation === 'block'),
    true
  );

  const applied = await runNode(
    creator,
    [
      'apply',
      '--target',
      target,
      '--plan-id',
      blockedPlan.planId,
      '--format',
      'json'
    ],
    {cwd: target}
  );
  assert.equal(applied.code, 2);
  assert.match(applied.stderr, /blocked actions/i);
  assert.equal(await treeDigest(target), before);
});
