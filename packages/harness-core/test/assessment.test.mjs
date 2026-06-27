import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { inspectHarness } from '../src/index.mjs';

const fixturesRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures'
);
const subsystemOrder = [
  'instructions',
  'tools',
  'environment',
  'state',
  'feedback'
];

function fixture(name) {
  return path.join(fixturesRoot, name);
}

function levels(result) {
  return subsystemOrder.map((name) => result.subsystems[name].level);
}

const cases = [
  ['empty', [0, 0, 0, 0, 0]],
  ['instructions-only', [1, 0, 0, 0, 0]],
  ['structure-only', [2, 1, 1, 1, 1]],
  ['operational', [2, 2, 2, 2, 2]],
  ['nonstandard', [2, 2, 2, 2, 2]]
];

for (const [name, expectedLevels] of cases) {
  test(`classifies ${name} fixture`, async () => {
    const result = await inspectHarness({ root: fixture(name) });

    assert.deepEqual(levels(result), expectedLevels);
    assert.equal(result.schemaVersion, '1.0.0');
    assert.equal(result.target, '.');
    assert.equal(result.mode, 'readiness');
    assert.equal(result.effectiveness.status, 'not-assessed');
    assert.equal(Object.hasOwn(result, 'overall'), false);
    assert.equal(
      Object.values(result.subsystems).some((item) => item.level === 3),
      false
    );
  });
}

test('emits no candidate bottleneck for an all-Operational profile', async () => {
  const result = await inspectHarness({ root: fixture('operational') });

  assert.deepEqual(result.candidateBottlenecks, []);
});

test('emits every tied lowest deficient subsystem in canonical order', async () => {
  const result = await inspectHarness({ root: fixture('instructions-only') });

  assert.deepEqual(result.candidateBottlenecks, [
    'tools',
    'environment',
    'state',
    'feedback'
  ]);
});

test('classifies malformed feature state as Present with repair findings', async () => {
  const result = await inspectHarness({ root: fixture('malformed-state') });

  assert.equal(result.subsystems.state.level, 1);
  assert.deepEqual(
    result.subsystems.state.gaps.map((item) => item.code),
    [
      'serial-active-count',
      'missing-dependency',
      'done-without-passing-evidence',
      'missing-progress'
    ]
  );
});

test('uses Unknown for an unsafe declared capability and excludes it from bottlenecks', async () => {
  const result = await inspectHarness({ root: fixture('escaping-manifest') });

  assert.equal(result.subsystems.instructions.level, null);
  assert.equal(result.subsystems.instructions.label, 'Unknown');
  assert.deepEqual(result.candidateBottlenecks, [
    'tools',
    'environment',
    'state',
    'feedback'
  ]);
  assert.equal(
    result.subsystems.instructions.unknowns[0].code,
    'path-escapes-root'
  );
});

test('normalizes findings and repeated assessments deterministically', async () => {
  const first = await inspectHarness({ root: fixture('structure-only') });
  const second = await inspectHarness({ root: fixture('structure-only') });

  assert.equal(JSON.stringify(first), JSON.stringify(second));
  for (const subsystem of Object.values(first.subsystems)) {
    assert.deepEqual(
      subsystem.evidence.map((item) => item.ruleId),
      [...subsystem.evidence.map((item) => item.ruleId)].sort()
    );
  }
});

test('reports the structural Readiness limitation explicitly', async () => {
  const result = await inspectHarness({ root: fixture('operational') });

  assert.deepEqual(result.effectiveness, {
    status: 'not-assessed',
    reason: 'Representative task evidence was not provided.'
  });
  assert.ok(result.limitations.some((item) => (
    item.includes('Readiness') && item.includes('Effectiveness')
  )));
});
