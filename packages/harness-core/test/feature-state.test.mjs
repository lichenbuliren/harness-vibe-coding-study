import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import * as featureState from '../src/feature-state.mjs';

const { validateFeatureState } = featureState;

const fixturesRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures'
);

function feature(overrides = {}) {
  return {
    id: 'feat-001',
    name: 'Example feature',
    behavior: 'Produce an observable outcome.',
    branch: 'codex/feat-001',
    dependencies: [],
    status: 'next',
    verification: null,
    evidence: [],
    ...overrides
  };
}

function document(features, overrides = {}) {
  return {
    schemaVersion: '1.1.0',
    mode: 'serial',
    features,
    ...overrides
  };
}

test('accepts one active serial feature with valid dependencies', () => {
  const input = document([
    feature({
      id: 'feat-001',
      status: 'done',
      verification: {
        kind: 'command',
        steps: ['./verify.sh']
      },
      evidence: [{
        status: 'passed',
        summary: './verify.sh exited 0.',
        verificationStep: 0
      }]
    }),
    feature({
      id: 'feat-002',
      dependencies: ['feat-001'],
      status: 'in-progress'
    }),
    feature({
      id: 'feat-003',
      dependencies: ['feat-002'],
      status: 'not-started'
    })
  ]);

  assert.deepEqual(validateFeatureState(input), {
    valid: true,
    canonical: true,
    findings: []
  });
});

test('accepts a completed serial plan with no active feature', () => {
  const input = document([
    feature({
      status: 'done',
      verification: {
        kind: 'manual',
        steps: ['Review the generated report.']
      },
      evidence: [{
        status: 'passed',
        summary: 'Report review completed.'
      }]
    })
  ]);

  assert.equal(validateFeatureState(input).valid, true);
});

test('accepts legacy 1.0.0 as valid but non-canonical', () => {
  const input = document([
    feature({
      branch: undefined,
      status: 'done',
      verification: {
        kind: 'manual',
        steps: ['Review the generated report.']
      },
      evidence: [{
        status: 'passed',
        summary: 'Report review completed.'
      }]
    })
  ], {
    schemaVersion: '1.0.0'
  });

  assert.deepEqual(validateFeatureState(input), {
    valid: true,
    canonical: false,
    findings: []
  });
});

test('requires branch on unfinished 1.1.0 features', () => {
  const input = document([
    feature({
      branch: null,
      status: 'in-progress'
    })
  ]);

  assert.deepEqual(
    validateFeatureState(input).findings.map((item) => item.code),
    ['missing-active-branch']
  );
});

test('allows null branch only for migrated done features', () => {
  const input = document([
    feature({
      branch: null,
      status: 'done',
      verification: {
        kind: 'command',
        steps: ['node --test']
      },
      evidence: [{
        status: 'passed',
        summary: 'Tests passed.'
      }]
    })
  ]);

  assert.equal(validateFeatureState(input).valid, true);
});

test('rejects branch names Git would not accept', () => {
  const input = document([
    feature({
      branch: 'codex/bad..branch'
    })
  ]);

  assert.deepEqual(
    validateFeatureState(input).findings.map((item) => item.code),
    ['invalid-branch']
  );
});

test('migrates 1.0.0 deterministically without mutating input', () => {
  const input = document([
    feature({
      id: 'feat-done',
      branch: undefined,
      status: 'done',
      verification: {
        kind: 'manual',
        steps: ['Review output.']
      },
      evidence: [{
        status: 'passed',
        summary: 'Review passed.'
      }]
    }),
    feature({
      id: 'feat-next',
      branch: undefined,
      status: 'next'
    })
  ], {
    schemaVersion: '1.0.0'
  });
  const before = structuredClone(input);

  const first = featureState.migrateFeatureState(input, {
    branch: 'codex/migrate-state'
  });
  const second = featureState.migrateFeatureState(input, {
    branch: 'codex/migrate-state'
  });

  assert.deepEqual(first, second);
  assert.deepEqual(input, before);
  assert.equal(first.schemaVersion, '1.1.0');
  assert.equal(first.features[0].branch, null);
  assert.equal(first.features[1].branch, 'codex/migrate-state');
  assert.equal(validateFeatureState(first).canonical, true);
});

test('migration requires a branch when legacy unfinished work exists', () => {
  const input = document([
    feature({
      branch: undefined,
      status: 'next'
    })
  ], {
    schemaVersion: '1.0.0'
  });

  assert.throws(
    () => featureState.migrateFeatureState(input),
    {code: 'MISSING_MIGRATION_BRANCH'}
  );
});

test('reports cycles, multiple active items, and done without passing evidence', () => {
  const input = document([
    feature({
      id: 'feat-a',
      dependencies: ['feat-b'],
      status: 'next'
    }),
    feature({
      id: 'feat-b',
      dependencies: ['feat-a'],
      status: 'in-progress'
    }),
    feature({
      id: 'feat-c',
      status: 'done',
      verification: {
        kind: 'command',
        steps: ['node --test']
      },
      evidence: [{
        status: 'failed',
        summary: 'One test failed.'
      }]
    })
  ]);

  const result = validateFeatureState(input);

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.findings.map((item) => item.code),
    [
      'serial-active-count',
      'dependency-cycle',
      'done-without-passing-evidence'
    ]
  );
});

test('reports duplicate, missing, and self dependencies deterministically', () => {
  const input = document([
    feature({
      id: 'feat-a',
      dependencies: ['feat-a', 'feat-missing']
    }),
    feature({
      id: 'feat-a',
      status: 'not-started'
    })
  ]);

  const result = validateFeatureState(input);

  assert.deepEqual(
    result.findings.map(({ featureId, code }) => ({ featureId, code })),
    [
      { featureId: 'feat-a', code: 'duplicate-id' },
      { featureId: 'feat-a', code: 'missing-dependency' },
      { featureId: 'feat-a', code: 'self-dependency' }
    ]
  );
});

test('requires blocked evidence for blocked features', () => {
  const input = document([
    feature({
      status: 'blocked',
      evidence: [{
        status: 'failed',
        summary: 'Setup failed.'
      }]
    })
  ]);

  assert.deepEqual(
    validateFeatureState(input).findings.map((item) => item.code),
    ['blocked-without-blocker']
  );
});

test('reports legacy feature documents without throwing', () => {
  const input = {
    features: [{
      id: 'feat-legacy',
      name: 'Legacy feature',
      description: 'Old field name',
      dependencies: [],
      status: 'next',
      evidence: ''
    }]
  };

  const result = validateFeatureState(input);

  assert.equal(result.valid, false);
  assert.equal(result.canonical, false);
  assert.deepEqual(
    result.findings.map((item) => item.code),
    [
      'missing-mode',
      'missing-schema-version',
      'invalid-evidence',
      'legacy-description',
      'missing-verification'
    ]
  );
});

test('validates fixture documents with stable findings', async () => {
  const cases = [
    ['operational', true, []],
    [
      'malformed-state',
      false,
      ['serial-active-count', 'missing-dependency', 'done-without-passing-evidence']
    ]
  ];

  for (const [name, valid, codes] of cases) {
    const content = await readFile(
      path.join(fixturesRoot, name, 'feature_list.json'),
      'utf8'
    );
    const result = validateFeatureState(JSON.parse(content));
    assert.equal(result.valid, valid, name);
    assert.deepEqual(result.findings.map((item) => item.code), codes, name);
  }
});
