import assert from 'node:assert/strict';
import {
  access,
  mkdtemp,
  readFile,
  readdir,
  stat
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  packagePlugin
} from '../../scripts/package-harness-plugin.mjs';

const expectedFiles = [
  '.codex-plugin/plugin.json',
  'runtime/harness-core/bin/branch-lease.mjs',
  'runtime/harness-core/bin/inspect-harness.mjs',
  'runtime/harness-core/package.json',
  'runtime/harness-core/rules/capabilities.json',
  'runtime/harness-core/schemas/assessment.schema.json',
  'runtime/harness-core/schemas/feature-list.schema.json',
  'runtime/harness-core/schemas/harness-manifest.schema.json',
  'runtime/harness-core/schemas/stage.schema.json',
  'runtime/harness-core/src/assess.mjs',
  'runtime/harness-core/src/branch-lease.mjs',
  'runtime/harness-core/src/constants.mjs',
  'runtime/harness-core/src/discovery.mjs',
  'runtime/harness-core/src/feature-state.mjs',
  'runtime/harness-core/src/index.mjs',
  'runtime/harness-core/src/manifest.mjs',
  'runtime/harness-core/src/path-safety.mjs',
  'runtime/harness-core/src/stage-archive.mjs',
  'skills/harness-archiver/agents/openai.yaml',
  'skills/harness-archiver/scripts/apply.mjs',
  'skills/harness-archiver/scripts/archiver.mjs',
  'skills/harness-archiver/scripts/planner.mjs',
  'skills/harness-archiver/scripts/renderers.mjs',
  'skills/harness-archiver/SKILL.md',
  'skills/harness-creator/agents/openai.yaml',
  'skills/harness-creator/scripts/apply.mjs',
  'skills/harness-creator/scripts/creator.mjs',
  'skills/harness-creator/scripts/planner.mjs',
  'skills/harness-creator/scripts/renderers.mjs',
  'skills/harness-creator/scripts/templates.mjs',
  'skills/harness-creator/SKILL.md',
  'skills/harness-doctor/agents/openai.yaml',
  'skills/harness-doctor/scripts/doctor.mjs',
  'skills/harness-doctor/scripts/renderers.mjs',
  'skills/harness-doctor/SKILL.md'
];

async function temporaryOutput() {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'harness-package-'));
  return {
    parent,
    output: path.join(parent, 'harness-engineering')
  };
}

test('packages one exact source-closed product graph', async () => {
  const {output} = await temporaryOutput();
  const result = await packagePlugin(output);

  assert.deepEqual(result.files.map((file) => file.path), expectedFiles);
  assert.equal(
    result.files.filter((file) =>
      file.path.startsWith('runtime/harness-core/')).length,
    17
  );
  assert.equal(
    result.files.some((file) =>
      file.path.includes('/test/') || file.path.includes('/docs/')),
    false
  );

  for (const file of result.files) {
    const content = await readFile(path.join(output, file.path), 'utf8');
    assert.equal(content.includes('../../../packages/harness-core/'), false);
    assert.equal(
      content.includes('/Users/heaven/Projects/harness-vibe-coding-study'),
      false
    );
  }
  assert.match(
    await readFile(
      path.join(output, 'skills/harness-creator/scripts/planner.mjs'),
      'utf8'
    ),
    /\.\.\/\.\.\/\.\.\/runtime\/harness-core\/src\/index\.mjs/
  );
});

test('repeated packages have identical ordered paths and digests', async () => {
  const first = await temporaryOutput();
  const second = await temporaryOutput();

  const firstResult = await packagePlugin(first.output);
  const secondResult = await packagePlugin(second.output);

  assert.deepEqual(firstResult, secondResult);
});

test('only packaged command entrypoints are executable', async () => {
  const {output} = await temporaryOutput();
  const result = await packagePlugin(output);
  const executable = [];

  for (const file of result.files) {
    const mode = (await stat(path.join(output, file.path))).mode;
    if ((mode & 0o111) !== 0) {
      executable.push(file.path);
    }
  }
  assert.deepEqual(executable, [
    'runtime/harness-core/bin/branch-lease.mjs',
    'runtime/harness-core/bin/inspect-harness.mjs',
    'skills/harness-archiver/scripts/archiver.mjs',
    'skills/harness-creator/scripts/creator.mjs',
    'skills/harness-doctor/scripts/doctor.mjs'
  ]);
});

test('a staging failure leaves no output or staging residue', async () => {
  const {parent, output} = await temporaryOutput();
  const incompleteSource = await mkdtemp(
    path.join(os.tmpdir(), 'harness-incomplete-source-')
  );

  await assert.rejects(
    packagePlugin(output, {sourceRoot: incompleteSource}),
    {code: 'ENOENT'}
  );
  await assert.rejects(access(output), {code: 'ENOENT'});
  assert.deepEqual(
    (await readdir(parent)).filter((name) =>
      name.startsWith('.harness-engineering.stage-')),
    []
  );
});

test('concurrent packagers publish exactly one complete product', async () => {
  const {parent, output} = await temporaryOutput();
  const results = await Promise.allSettled([
    packagePlugin(output),
    packagePlugin(output)
  ]);

  assert.equal(
    results.filter((result) => result.status === 'fulfilled').length,
    1
  );
  assert.equal(
    results.filter((result) => result.status === 'rejected').length,
    1
  );
  await access(path.join(output, '.codex-plugin', 'plugin.json'));
  await access(path.join(
    output,
    'skills',
    'harness-creator',
    'scripts',
    'creator.mjs'
  ));
  assert.deepEqual(
    (await readdir(parent)).filter((name) =>
      name.startsWith('.harness-engineering.stage-')),
    []
  );
});
