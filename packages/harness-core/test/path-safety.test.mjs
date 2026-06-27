import assert from 'node:assert/strict';
import {
  chmod,
  mkdtemp,
  mkdir,
  readFile,
  symlink,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  normalizeDeclaredPath,
  readBoundedFile,
  resolveSafeWritePath,
  statSafePath
} from '../src/path-safety.mjs';
import { loadManifest } from '../src/manifest.mjs';

const fixturesRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures'
);

function fixture(name) {
  return path.join(fixturesRoot, name);
}

test('loads and normalizes declared repository-relative paths', async () => {
  const result = await loadManifest(fixture('nonstandard'));

  assert.deepEqual(result.manifest.artifacts.instructions, ['PROJECT_GUIDE.md']);
  assert.deepEqual(result.manifest.artifacts.featureState, ['ops/work.json']);
  assert.deepEqual(result.unknowns, []);
});

test('normalizes safe paths without leaking the absolute root', () => {
  const result = normalizeDeclaredPath('/tmp/project', 'docs/../AGENTS.md');

  assert.deepEqual(result, {
    ok: true,
    relativePath: 'AGENTS.md',
    absolutePath: path.join('/tmp/project', 'AGENTS.md')
  });
});

test('rejects absolute paths, traversal, and NUL bytes', () => {
  const unsafe = [
    '/tmp/outside.md',
    '../outside.md',
    'docs/../../outside.md',
    'bad\0path'
  ];

  assert.deepEqual(
    unsafe.map((candidate) => normalizeDeclaredPath('/tmp/project', candidate)),
    [
      { ok: false, relativePath: '/tmp/outside.md', reason: 'absolute-path' },
      { ok: false, relativePath: '../outside.md', reason: 'path-escapes-root' },
      {
        ok: false,
        relativePath: 'docs/../../outside.md',
        reason: 'path-escapes-root'
      },
      { ok: false, relativePath: 'bad\0path', reason: 'invalid-path' }
    ]
  );
});

test('rejects a symlink whose real target escapes the root', async (context) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'harness-path-'));
  const root = path.join(parent, 'project');
  const outside = path.join(parent, 'outside.md');
  await mkdir(root);
  await writeFile(outside, 'outside\n');
  await symlink(outside, path.join(root, 'linked.md'));
  context.after(async () => {
    await import('node:fs/promises').then(({ rm }) => rm(parent, {
      recursive: true,
      force: true
    }));
  });

  const result = await statSafePath(root, 'linked.md');

  assert.deepEqual(result, {
    ok: false,
    relativePath: 'linked.md',
    reason: 'symlink-escapes-root'
  });
});

test('rejects a missing write target beneath an escaping parent symlink', async (context) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'harness-write-'));
  const root = path.join(parent, 'project');
  const outside = path.join(parent, 'outside');
  await mkdir(root);
  await mkdir(outside);
  await symlink(outside, path.join(root, 'generated'));
  context.after(async () => {
    await import('node:fs/promises').then(({ rm }) => rm(parent, {
      recursive: true,
      force: true
    }));
  });

  const result = await resolveSafeWritePath(root, 'generated/new-file.md');

  assert.deepEqual(result, {
    ok: false,
    relativePath: 'generated/new-file.md',
    reason: 'parent-escapes-root'
  });
});

test('bounds file reads and preserves executable metadata', async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'harness-read-'));
  context.after(async () => {
    await import('node:fs/promises').then(({ rm }) => rm(root, {
      recursive: true,
      force: true
    }));
  });
  await writeFile(path.join(root, 'small.sh'), '#!/bin/sh\nexit 0\n');
  await chmod(path.join(root, 'small.sh'), 0o755);
  await writeFile(path.join(root, 'large.txt'), 'x'.repeat(32));

  const small = await readBoundedFile(root, 'small.sh', { maxBytes: 32 });
  const large = await readBoundedFile(root, 'large.txt', { maxBytes: 16 });

  assert.equal(small.ok, true);
  assert.equal(small.executable, true);
  assert.equal(small.content, '#!/bin/sh\nexit 0\n');
  assert.deepEqual(large, {
    ok: false,
    relativePath: 'large.txt',
    reason: 'file-too-large',
    size: 32,
    maxBytes: 16
  });
});

test('reports malformed manifests as stable unknown evidence', async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'harness-manifest-'));
  context.after(async () => {
    await import('node:fs/promises').then(({ rm }) => rm(root, {
      recursive: true,
      force: true
    }));
  });
  await mkdir(path.join(root, '.harness'));
  await writeFile(path.join(root, '.harness', 'manifest.json'), '{bad json');

  const first = await loadManifest(root);
  const second = await loadManifest(root);

  assert.deepEqual(first, second);
  assert.equal(first.manifest.schemaVersion, '1.0.0');
  assert.deepEqual(first.unknowns, [{
    ruleId: 'manifest.load',
    source: '.harness/manifest.json',
    code: 'invalid-json',
    detail: 'Harness manifest is not valid JSON.'
  }]);
});

test('rejects excessive declarations without reading target files', async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'harness-limit-'));
  context.after(async () => {
    await import('node:fs/promises').then(({ rm }) => rm(root, {
      recursive: true,
      force: true
    }));
  });
  await mkdir(path.join(root, '.harness'));
  const manifest = {
    schemaVersion: '1.0.0',
    artifacts: {
      instructions: ['one.md', 'two.md']
    }
  };
  await writeFile(
    path.join(root, '.harness', 'manifest.json'),
    JSON.stringify(manifest)
  );

  const result = await loadManifest(root, { maxDeclaredPaths: 1 });

  assert.deepEqual(result.unknowns, [{
    ruleId: 'manifest.load',
    source: '.harness/manifest.json',
    code: 'declaration-limit-exceeded',
    detail: 'Harness manifest declares 2 paths; limit is 1.'
  }]);
});

test('fixture data remains readable for later assessment tests', async () => {
  const guide = await readFile(
    path.join(fixture('nonstandard'), 'PROJECT_GUIDE.md'),
    'utf8'
  );
  assert.match(guide, /Project Instructions/);
});
