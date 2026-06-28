import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { fixture } from './helpers.mjs';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const cli = path.join(
  repositoryRoot,
  'skills/harness-archiver/scripts/archiver.mjs'
);

function run(args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      env: {...process.env, ...env},
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => resolve({code, stdout, stderr}));
  });
}

test('CLI exposes bounded plan/apply usage', async () => {
  const help = await run(['--help']);
  assert.equal(help.code, 0);
  assert.match(help.stdout, /archiver plan --target <directory> --evolution <relative-path>/u);
  assert.match(help.stdout, /archiver apply --target <directory> --evolution <relative-path>/u);
  assert.match(help.stdout, /--plan-id <sha256>/u);
});

test('CLI plans and applies only an eligible target', async () => {
  const root = await fixture();
  const args = [
    '--target', root,
    '--evolution', 'docs/evolution/0001-fixture.md',
    '--format', 'json'
  ];
  const planned = await run(['plan', ...args]);
  assert.equal(planned.code, 0);
  const plan = JSON.parse(planned.stdout);
  const applied = await run([
    'apply',
    ...args,
    '--plan-id',
    plan.planId
  ], {
    CODEX_THREAD_ID: '019f0c3d-8d3b-77d2-93c6-9684d44fe7e2'
  });
  assert.equal(applied.code, 0);

  const invalid = await run(['plan', '--target', root]);
  assert.equal(invalid.code, 2);
  assert.match(invalid.stderr, /Usage:/u);
});
