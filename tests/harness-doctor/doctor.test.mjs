import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  lstat,
  readFile,
  readdir,
  readlink
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  inspectHarness
} from '../../packages/harness-core/src/index.mjs';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const doctorPath = path.join(
  repositoryRoot,
  'skills',
  'harness-doctor',
  'scripts',
  'doctor.mjs'
);
const fixturesRoot = path.join(
  repositoryRoot,
  'packages',
  'harness-core',
  'test',
  'fixtures'
);

function fixture(name) {
  return path.join(fixturesRoot, name);
}

function runDoctor(arguments_) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [doctorPath, ...arguments_], {
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

async function treeDigest(root) {
  const hash = createHash('sha256');

  async function visit(relativeDirectory) {
    const directory = path.join(root, relativeDirectory);
    const entries = await readdir(directory, {withFileTypes: true});
    entries.sort((left, right) => (
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0
    ));
    for (const entry of entries) {
      const relativePath = path.posix.join(
        relativeDirectory.replaceAll(path.sep, '/'),
        entry.name
      );
      const absolutePath = path.join(root, relativePath);
      const metadata = await lstat(absolutePath);
      hash.update(relativePath);
      hash.update(String(metadata.mode));
      if (entry.isDirectory()) {
        hash.update('directory');
        await visit(relativePath);
      } else if (entry.isSymbolicLink()) {
        hash.update('symlink');
        hash.update(await readlink(absolutePath));
      } else {
        hash.update('file');
        hash.update(await readFile(absolutePath));
      }
    }
  }

  await visit('');
  return hash.digest('hex');
}

test('JSON is the direct shared-core assessment and is byte-stable', async () => {
  const target = fixture('operational');
  const expected = await inspectHarness({root: target});
  const first = await runDoctor(['--target', target, '--format', 'json']);
  const second = await runDoctor(['--target', target, '--format', 'json']);

  assert.equal(first.code, 0);
  assert.equal(first.signal, null);
  assert.equal(first.stderr, '');
  assert.equal(first.stdout, second.stdout);
  assert.deepEqual(JSON.parse(first.stdout), expected);
  assert.equal(first.stdout.endsWith('\n'), true);
  assert.equal(first.stdout.endsWith('\n\n'), false);
});

test('defaults to Text and supports Markdown and safe HTML', async () => {
  const targetArguments = ['--target', fixture('operational')];
  const text = await runDoctor(targetArguments);
  const markdown = await runDoctor([...targetArguments, '--format', 'markdown']);
  const html = await runDoctor([...targetArguments, '--format', 'html']);

  assert.equal(text.code, 0);
  assert.match(text.stdout, /^Harness Doctor\nMode: readiness/);
  assert.equal(markdown.code, 0);
  assert.match(markdown.stdout, /^# Harness Doctor\n/);
  assert.equal(html.code, 0);
  assert.match(html.stdout, /^<!doctype html>/i);
  assert.doesNotMatch(html.stdout, /<script|https?:\/\//i);
});

test('supports an explicit non-standard manifest', async () => {
  const target = fixture('nonstandard');
  const result = await runDoctor([
    '--target',
    target,
    '--manifest',
    '.harness/manifest.json',
    '--format',
    'json'
  ]);

  assert.equal(result.code, 0);
  assert.deepEqual(
    JSON.parse(result.stdout),
    await inspectHarness({
      root: target,
      manifestPath: '.harness/manifest.json'
    })
  );
});

test('preserves Unknown findings and exits zero for capability gaps', async () => {
  const result = await runDoctor([
    '--target',
    fixture('escaping-manifest'),
    '--format',
    'json'
  ]);
  const assessment = JSON.parse(result.stdout);

  assert.equal(result.code, 0);
  assert.equal(assessment.subsystems.instructions.level, null);
  assert.equal(assessment.subsystems.instructions.label, 'Unknown');
  assert.equal(assessment.candidateBottlenecks.length > 0, true);
});

test('pretty JSON changes only whitespace', async () => {
  const arguments_ = [
    '--target',
    fixture('operational'),
    '--format',
    'json'
  ];
  const compact = await runDoctor(arguments_);
  const pretty = await runDoctor([...arguments_, '--pretty']);

  assert.equal(pretty.code, 0);
  assert.match(pretty.stdout, /^\{\n  "schemaVersion"/);
  assert.deepEqual(JSON.parse(pretty.stdout), JSON.parse(compact.stdout));
});

test('rejects pretty non-JSON, duplicate, unknown, and incomplete options', async () => {
  const cases = [
    {
      arguments: ['--target', fixture('operational'), '--pretty'],
      message: /--pretty.*JSON/i
    },
    {
      arguments: ['--target', fixture('operational'), '--target', fixture('empty')],
      message: /Duplicate argument: --target/
    },
    {
      arguments: ['--target', fixture('operational'), '--format', 'yaml'],
      message: /Invalid format: yaml/
    },
    {
      arguments: ['--unknown'],
      message: /Unknown argument: --unknown/
    },
    {
      arguments: [],
      message: /Missing required argument: --target/
    }
  ];

  for (const item of cases) {
    const result = await runDoctor(item.arguments);
    assert.equal(result.code, 2);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, item.message);
    assert.match(result.stderr, /Usage:/);
  }
});

test('missing targets are runtime errors with exit two', async () => {
  const result = await runDoctor([
    '--target',
    fixture('does-not-exist')
  ]);

  assert.equal(result.code, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Unable to inspect target/);
  assert.match(result.stderr, /Usage:/);
});

test('help succeeds without a target', async () => {
  const result = await runDoctor(['--help']);

  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /--format text\|json\|markdown\|html/);
});

test('inspection is read-only and JSON contains no host paths', async () => {
  const target = fixture('operational');
  const before = await treeDigest(target);
  const result = await runDoctor([
    '--target',
    target,
    '--format',
    'json'
  ]);
  const after = await treeDigest(target);

  assert.equal(result.code, 0);
  assert.equal(before, after);
  assert.equal(result.stdout.includes(target), false);
  assert.equal(result.stdout.includes(repositoryRoot), false);
  assert.equal(result.stdout.includes('generatedAt'), false);
});

test('command has a single shared-core inspection boundary', async () => {
  const source = await readFile(doctorPath, 'utf8');
  const calls = source.match(/await inspectHarness\(/g) ?? [];

  assert.equal(calls.length, 1);
  assert.doesNotMatch(source, /node:fs|child_process/);
});
