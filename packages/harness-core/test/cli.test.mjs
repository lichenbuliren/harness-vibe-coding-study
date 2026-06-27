import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  lstat,
  readFile,
  readdir,
  readlink
} from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const cliPath = path.join(packageRoot, 'bin', 'inspect-harness.mjs');
const fixturesRoot = path.join(packageRoot, 'test', 'fixtures');

function fixture(name) {
  return path.join(fixturesRoot, name);
}

function runCli(arguments_) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...arguments_], {
      cwd: packageRoot,
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
      resolve({ code, signal, stdout, stderr });
    });
  });
}

async function treeDigest(root) {
  const hash = createHash('sha256');

  async function visit(relativeDirectory) {
    const absoluteDirectory = path.join(root, relativeDirectory);
    const entries = await readdir(absoluteDirectory, { withFileTypes: true });
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

test('emits byte-stable compact JSON and preserves the target tree', async () => {
  const target = fixture('operational');
  const before = await treeDigest(target);
  const first = await runCli(['--target', target]);
  const second = await runCli(['--target', target]);
  const after = await treeDigest(target);

  assert.equal(first.code, 0);
  assert.equal(first.signal, null);
  assert.equal(first.stderr, '');
  assert.equal(first.stdout, second.stdout);
  assert.equal(before, after);
  assert.equal(first.stdout.endsWith('\n'), true);
  assert.equal(first.stdout.includes('\n  "'), false);
  assert.equal(JSON.parse(first.stdout).target, '.');
});

test('pretty output changes whitespace but not assessment data', async () => {
  const target = fixture('operational');
  const compact = await runCli(['--target', target]);
  const pretty = await runCli(['--target', target, '--pretty']);

  assert.equal(pretty.code, 0);
  assert.match(pretty.stdout, /^\{\n  "schemaVersion"/);
  assert.deepEqual(JSON.parse(pretty.stdout), JSON.parse(compact.stdout));
});

test('supports an explicit repository-relative manifest', async () => {
  const result = await runCli([
    '--target',
    fixture('nonstandard'),
    '--manifest',
    '.harness/manifest.json'
  ]);

  assert.equal(result.code, 0);
  assert.deepEqual(
    Object.values(JSON.parse(result.stdout).subsystems)
      .map((item) => item.level),
    [2, 2, 2, 2, 2]
  );
});

test('returns exit 0 when the assessment contains capability gaps', async () => {
  const result = await runCli(['--target', fixture('empty')]);

  assert.equal(result.code, 0);
  assert.deepEqual(JSON.parse(result.stdout).candidateBottlenecks, [
    'instructions',
    'tools',
    'environment',
    'state',
    'feedback'
  ]);
});

test('uses exit 2 and usage text for invalid arguments', async () => {
  const result = await runCli(['--unknown']);

  assert.equal(result.code, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Unknown argument: --unknown/);
  assert.match(result.stderr, /Usage:/);
});

test('uses exit 2 for a missing target directory', async () => {
  const result = await runCli([
    '--target',
    path.join(fixturesRoot, 'does-not-exist')
  ]);

  assert.equal(result.code, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Unable to inspect target/);
});

test('help is side-effect free and exits successfully', async () => {
  const result = await runCli(['--help']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /Usage:/);
  assert.equal(result.stderr, '');
});

test('canonical JSON excludes host paths and volatile metadata', async () => {
  const target = fixture('operational');
  const result = await runCli(['--target', target]);

  assert.equal(result.code, 0);
  assert.equal(result.stdout.includes(target), false);
  assert.equal(result.stdout.includes(packageRoot), false);
  assert.equal(result.stdout.includes('generatedAt'), false);
  assert.equal(result.stdout.includes('elapsed'), false);
});
