import assert from 'node:assert/strict';
import {
  access,
  mkdtemp,
  readFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {pathToFileURL} from 'node:url';

import {
  createPilotFixtures,
  fixtureDefinitions,
  runVerification,
  treeDigest
} from '../../experiments/field-validation/fixtures.mjs';
import {
  validateResults
} from '../../experiments/field-validation/validate-results.mjs';

const expectedRuns = [
  ['fresh-bare', 1, 'fresh', 'bare'],
  ['fresh-harness', 2, 'fresh', 'harness'],
  ['resume-harness', 3, 'resume', 'harness'],
  ['resume-bare', 4, 'resume', 'bare']
];

function validRun(definition) {
  const sourcePaths = definition.allowedChangedPaths.filter((item) =>
    item.startsWith('src/'));
  return {
    id: definition.id,
    order: definition.order,
    family: definition.family,
    condition: definition.condition,
    taskName: definition.taskName,
    start: {
      gitClean: true,
      verification: 'failed-as-expected'
    },
    actions: [
      ...definition.entrypoints.map((entrypoint) => ({
        kind: 'read',
        path: entrypoint
      })),
      {
        kind: 'edit',
        paths: sourcePaths
      },
      {kind: 'verify', command: 'npm test', result: 'passed'}
    ],
    metrics: {
      orientationReads: definition.entrypoints.length,
      verificationCommands: 1,
      correctionLoops: 0,
      stateUpdates: 0,
      changedFiles: sourcePaths.length
    },
    outcome: {
      verification: 'passed',
      scopeViolations: [],
      restartStateCorrect: definition.condition === 'harness' ? true : null,
      elapsedMs: 100,
      diffSha256: 'a'.repeat(64),
      testOutputSha256: 'b'.repeat(64)
    }
  };
}

function validRecord() {
  return {
    schemaVersion: '1.0.0',
    id: 'pilot-001',
    evidenceLevel: 'observed',
    execution: {
      agent: 'current-codex-session',
      independent: false
    },
    runs: fixtureDefinitions.map(validRun),
    conclusions: [{
      id: 'pilot-boundary',
      status: 'observed',
      claim: 'The pilot supports only bounded observations.',
      supportingRuns: fixtureDefinitions.map((item) => item.id)
    }],
    limitations: [
      'Same agent executed every condition.',
      'Sequential runs can transfer learning.',
      'Synthetic tasks do not represent a large production codebase.'
    ],
    readinessLevelClaim: 2
  };
}

test('declares four balanced counterordered runs', () => {
  assert.deepEqual(
    fixtureDefinitions.map((item) => [
      item.id,
      item.order,
      item.family,
      item.condition
    ]),
    expectedRuns
  );
  assert.equal(
    fixtureDefinitions.filter((item) => item.condition === 'bare').length,
    2
  );
  assert.equal(
    fixtureDefinitions.filter((item) => item.condition === 'harness').length,
    2
  );
  for (const definition of fixtureDefinitions) {
    assert.equal(definition.entrypoints.length > 0, true);
    assert.equal(definition.allowedChangedPaths.includes(definition.source), true);
  }
});

test('fixture generation is deterministic and starts clean but failing', async () => {
  const firstRoot = await mkdtemp(path.join(os.tmpdir(), 'field-pilot-a-'));
  const secondRoot = await mkdtemp(path.join(os.tmpdir(), 'field-pilot-b-'));
  const first = await createPilotFixtures(firstRoot);
  const second = await createPilotFixtures(secondRoot);

  for (const definition of fixtureDefinitions) {
    const firstPath = first[definition.id];
    const secondPath = second[definition.id];
    assert.equal(await treeDigest(firstPath, {excludeGit: true}), await treeDigest(
      secondPath,
      {excludeGit: true}
    ));
    const verification = await runVerification(firstPath);
    assert.equal(
      verification.code,
      1,
      `${definition.id} unexpectedly returned ${verification.code}\n${verification.stdout}\n${verification.stderr}`
    );
    assert.equal(
      (await readFile(path.join(firstPath, '.git', 'HEAD'), 'utf8')).length > 0,
      true
    );
    if (definition.condition === 'harness') {
      await access(path.join(firstPath, 'AGENTS.md'));
      await access(path.join(firstPath, 'feature_list.json'));
      await access(path.join(firstPath, 'progress.md'));
      await access(path.join(firstPath, 'init.sh'));
    } else {
      await assert.rejects(access(path.join(firstPath, 'AGENTS.md')), {
        code: 'ENOENT'
      });
      await access(path.join(firstPath, 'TASK.md'));
    }
    if (definition.family === 'resume') {
      const module = await import(
        `${pathToFileURL(path.join(firstPath, definition.source))}?pilot=${definition.id}`
      );
      const parse = module[definition.functionName];
      assert.equal(parse(definition.units[1][0]), definition.units[1][1]);
      assert.equal(parse(definition.units[2][0]), definition.units[2][1]);
      assert.throws(() => parse(definition.units[0][0]), TypeError);
    }
  }
});

test('accepts one complete observed pilot record', () => {
  assert.deepEqual(validateResults(validRecord()), []);
});

test('rejects missing runs, scope violations, and promoted conclusions', () => {
  const missing = validRecord();
  missing.runs.pop();
  assert.match(validateResults(missing).join('\n'), /exactly four runs/i);

  const scope = validRecord();
  scope.runs[0].outcome.scopeViolations = ['README.md'];
  assert.match(validateResults(scope).join('\n'), /scope violations/i);

  const promoted = validRecord();
  promoted.evidenceLevel = 'validated';
  promoted.conclusions[0].status = 'canonical';
  promoted.readinessLevelClaim = 3;
  assert.match(
    validateResults(promoted).join('\n'),
    /evidenceLevel.*observed|status.*observed|readinessLevelClaim.*2/i
  );
});
