import assert from 'node:assert/strict';
import {
  mkdir,
  mkdtemp,
  readFile,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import * as core from '../src/index.mjs';

function doneFeature(overrides = {}) {
  return {
    id: 'feat-001',
    name: 'Completed feature',
    behavior: 'Produce a verified outcome.',
    branch: 'codex/feat-001',
    dependencies: [],
    status: 'done',
    verification: {
      kind: 'command',
      steps: ['node --test']
    },
    evidence: [{
      status: 'passed',
      summary: 'Tests passed.',
      verificationStep: 0
    }],
    ...overrides
  };
}

function featureState(features = [doneFeature()]) {
  return {
    schemaVersion: '1.1.0',
    mode: 'serial',
    features
  };
}

function closure(overrides = {}) {
  return {
    featureStateContent: `${JSON.stringify(featureState(), null, 2)}\n`,
    progressContent: '# Session Progress\n\nComplete.\n',
    previousBaseline: null,
    evolutionPath: 'docs/evolution/0013-state-retention.md',
    ...overrides
  };
}

test('derives a deterministic content-addressed stage id', () => {
  const first = core.createStageIdentity(closure());
  const second = core.createStageIdentity(closure());

  assert.deepEqual(first, second);
  assert.match(first.stageId, /^stage-[0-9a-f]{16}$/);
  assert.match(first.digest, /^[0-9a-f]{64}$/);
});

test('canonicalizes feature JSON but preserves progress bytes', () => {
  const original = closure();
  const reordered = closure({
    featureStateContent: JSON.stringify({
      features: original.featureStateContent
        ? featureState().features
        : [],
      mode: 'serial',
      schemaVersion: '1.1.0'
    })
  });

  assert.equal(
    core.createStageIdentity(original).stageId,
    core.createStageIdentity(reordered).stageId
  );
  assert.notEqual(
    core.createStageIdentity(original).stageId,
    core.createStageIdentity({
      ...original,
      progressContent: `${original.progressContent} `
    }).stageId
  );
});

test('rejects unfinished, invalid, and empty stages', () => {
  const unfinished = core.assessArchiveEligibility(featureState([
    doneFeature({
      status: 'in-progress',
      verification: null,
      evidence: []
    })
  ]));
  const empty = core.assessArchiveEligibility(featureState([]));

  assert.equal(unfinished.eligible, false);
  assert.ok(unfinished.findings.some(
    (item) => item.code === 'feature-not-done'
  ));
  assert.deepEqual(empty, {
    eligible: false,
    findings: [{
      code: 'no-features',
      detail: 'A stage must contain at least one feature before archiving.'
    }]
  });
});

test('accepts a fully evidenced completed stage', () => {
  assert.deepEqual(core.assessArchiveEligibility(featureState()), {
    eligible: true,
    findings: []
  });
});

test('renders a valid empty current workset and compact progress', () => {
  const current = JSON.parse(core.renderCompactedFeatureState({
    mode: 'serial'
  }));
  const progress = core.renderCompactedProgress({
    stageId: 'stage-a3f927c49db281e6'
  });

  assert.deepEqual(current, {
    schemaVersion: '1.1.0',
    mode: 'serial',
    features: []
  });
  assert.equal(core.validateFeatureState(current).valid, true);
  assert.match(progress, /stage-a3f927c49db281e6/);
  assert.match(progress, /No active feature/);
  assert.doesNotMatch(progress, /What's Done/);
});

test('validates an intact baseline and detects artifact tampering', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'harness-stage-'));
  const identity = core.createStageIdentity(closure());
  const snapshot = path.join(
    root,
    'docs',
    'evolution',
    'snapshots',
    identity.stageId
  );
  await mkdir(snapshot, {recursive: true});
  await mkdir(path.join(root, '.harness'), {recursive: true});
  await writeFile(
    path.join(snapshot, 'feature_list.json'),
    closure().featureStateContent
  );
  await writeFile(
    path.join(snapshot, 'progress.md'),
    closure().progressContent
  );
  const manifest = core.createStageManifest({
    identity,
    previousBaseline: null,
    sourceHead: 'a'.repeat(40),
    closedAt: '2026-06-28T00:00:00+08:00',
    evolutionPath: closure().evolutionPath,
    featureCount: 1,
    passedEvidenceCount: 1
  });
  await writeFile(
    path.join(snapshot, 'stage.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  await writeFile(
    path.join(root, '.harness', 'baseline'),
    `${identity.stageId}\n`
  );

  assert.deepEqual(await core.validateBaselineChain({root}), {
    valid: true,
    head: identity.stageId,
    stages: [identity.stageId],
    findings: []
  });

  await writeFile(
    path.join(snapshot, 'progress.md'),
    `${await readFile(path.join(snapshot, 'progress.md'), 'utf8')}tampered\n`
  );
  const tampered = await core.validateBaselineChain({root});
  assert.equal(tampered.valid, false);
  assert.ok(tampered.findings.some(
    (item) => item.code === 'snapshot-digest-mismatch'
  ));
});
