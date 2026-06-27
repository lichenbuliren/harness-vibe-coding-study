import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const packagerPath = path.join(
  repositoryRoot,
  'scripts',
  'package-harness-plugin.mjs'
);

function runPackager(arguments_) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [packagerPath, ...arguments_], {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        NO_COLOR: '1'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code, signal) => {
      resolve({code, signal, stdout, stderr});
    });
  });
}

async function temporaryOutput() {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'harness-product-'));
  return {
    parent,
    output: path.join(parent, 'harness-engineering')
  };
}

test('help exposes one bounded non-overwriting command', async () => {
  const result = await runPackager(['--help']);

  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /--output .*harness-engineering/);
  assert.doesNotMatch(
    result.stdout,
    /--force|--overwrite|--install|--marketplace/
  );
});

test('packages the official minimal plugin manifest', async () => {
  const {output} = await temporaryOutput();
  const result = await runPackager(['--output', output]);
  const manifest = JSON.parse(await readFile(
    path.join(output, '.codex-plugin', 'plugin.json'),
    'utf8'
  ));

  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.deepEqual(manifest, {
    name: 'harness-engineering',
    version: '0.1.0',
    description: 'Create and diagnose restartable coding-agent harnesses.',
    author: {
      name: 'Harness Vibe Coding Study'
    },
    skills: './skills/',
    interface: {
      displayName: 'Harness Engineering',
      shortDescription: 'Create and diagnose coding-agent harnesses.',
      longDescription:
        'Plan safe harness changes and diagnose readiness with one shared contract core.',
      developerName: 'Harness Vibe Coding Study',
      category: 'Developer Tools',
      capabilities: ['Read', 'Write'],
      defaultPrompt:
        'Inspect this project, propose safe harness changes, then diagnose readiness.'
    }
  });
  assert.equal(JSON.parse(result.stdout).plugin.name, 'harness-engineering');
});

test('requires an absent output named harness-engineering', async () => {
  const {parent, output} = await temporaryOutput();
  const wrongName = path.join(parent, 'other-name');
  const wrong = await runPackager(['--output', wrongName]);

  assert.equal(wrong.code, 2);
  assert.equal(wrong.stdout, '');
  assert.match(wrong.stderr, /must be named harness-engineering/i);
  await assert.rejects(access(wrongName), {code: 'ENOENT'});

  await mkdir(output);
  await writeFile(path.join(output, 'owned.txt'), 'keep\n');
  const existing = await runPackager(['--output', output]);

  assert.equal(existing.code, 2);
  assert.equal(existing.stdout, '');
  assert.match(existing.stderr, /already exists/i);
  assert.equal(
    await readFile(path.join(output, 'owned.txt'), 'utf8'),
    'keep\n'
  );
});

test('invalid arguments fail without creating output', async () => {
  const {output} = await temporaryOutput();
  const cases = [
    {arguments: [], message: /Missing required argument: --output/},
    {
      arguments: ['--output', output, '--output', output],
      message: /Duplicate argument: --output/
    },
    {
      arguments: ['--output', output, '--force'],
      message: /Unknown argument: --force/
    }
  ];

  for (const item of cases) {
    const result = await runPackager(item.arguments);
    assert.equal(result.code, 2);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, item.message);
  }
  await assert.rejects(access(output), {code: 'ENOENT'});
});
