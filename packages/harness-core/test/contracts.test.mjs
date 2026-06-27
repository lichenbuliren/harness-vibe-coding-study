import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import * as harnessCore from '../src/index.mjs';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

async function readJson(relativePath) {
  const content = await readFile(path.join(packageRoot, relativePath), 'utf8');
  return JSON.parse(content);
}

test('contracts use JSON Schema 2020-12', async () => {
  const schemaPaths = [
    'schemas/assessment.schema.json',
    'schemas/feature-list.schema.json',
    'schemas/harness-manifest.schema.json'
  ];

  for (const schemaPath of schemaPaths) {
    const schema = await readJson(schemaPath);
    assert.equal(
      schema.$schema,
      'https://json-schema.org/draft/2020-12/schema'
    );
  }
});

test('rules use only the canonical five-subsystem model', async () => {
  const rules = await readJson('rules/capabilities.json');

  assert.deepEqual(rules.subsystemOrder, [
    'instructions',
    'tools',
    'environment',
    'state',
    'feedback'
  ]);
  assert.deepEqual(
    rules.rules.map((rule) => rule.subsystem)
      .filter((value, index, values) => values.indexOf(value) === index)
      .sort(),
    ['environment', 'feedback', 'instructions', 'state', 'tools']
  );
  assert.equal(JSON.stringify(rules).includes('"scope"'), false);
  assert.equal(JSON.stringify(rules).includes('"lifecycle"'), false);
});

test('assessment contract has no total score and represents Unknown explicitly', async () => {
  const schema = await readJson('schemas/assessment.schema.json');
  const subsystem = schema.$defs.subsystem;

  assert.equal(Object.hasOwn(schema.properties, 'overall'), false);
  assert.deepEqual(subsystem.properties.level.type, ['integer', 'null']);
  assert.equal(subsystem.properties.level.minimum, 0);
  assert.equal(subsystem.properties.level.maximum, 3);
  assert.ok(subsystem.properties.label.enum.includes('Unknown'));
  assert.deepEqual(schema.properties.effectiveness.properties.status.const, 'not-assessed');
});

test('feature contract requires structured verification and evidence', async () => {
  const schema = await readJson('schemas/feature-list.schema.json');
  const feature = schema.$defs.feature;

  assert.deepEqual(feature.required, [
    'id',
    'name',
    'behavior',
    'dependencies',
    'status',
    'verification',
    'evidence'
  ]);
  assert.deepEqual(feature.properties.verification.anyOf[0].type, 'null');
  assert.equal(feature.properties.evidence.type, 'array');
  assert.deepEqual(schema.properties.mode.enum, ['serial', 'parallel']);
});

test('manifest contract exposes capability declarations without claims', async () => {
  const schema = await readJson('schemas/harness-manifest.schema.json');

  assert.deepEqual(Object.keys(schema.properties.artifacts.properties), [
    'instructions',
    'context',
    'featureState',
    'progress',
    'handoff',
    'environment',
    'tools',
    'readinessEvidence'
  ]);
  assert.deepEqual(Object.keys(schema.properties.commands.properties), [
    'initialize',
    'setup',
    'verify'
  ]);
  assert.equal(Object.hasOwn(schema.properties, 'score'), false);
});

test('public API exposes bounded path safety for creator writes', () => {
  assert.equal(typeof harnessCore.normalizeDeclaredPath, 'function');
  assert.equal(typeof harnessCore.statSafePath, 'function');
  assert.equal(typeof harnessCore.readBoundedFile, 'function');
  assert.equal(typeof harnessCore.resolveSafeWritePath, 'function');
});
