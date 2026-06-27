import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {
  access,
  mkdtemp,
  readFile,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createPlan
} from '../../skills/harness-creator/scripts/planner.mjs';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const creatorPath = path.join(
  repositoryRoot,
  'skills',
  'harness-creator',
  'scripts',
  'creator.mjs'
);

async function temporaryTarget() {
  return mkdtemp(path.join(os.tmpdir(), 'harness-creator-cli-'));
}

function runCreator(arguments_) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [creatorPath, ...arguments_], {
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

test('plan JSON is the direct deterministic planner result', async () => {
  const root = await temporaryTarget();
  const arguments_ = ['plan', '--target', root, '--format', 'json'];
  const first = await runCreator(arguments_);
  const second = await runCreator(arguments_);

  assert.equal(first.code, 0);
  assert.equal(first.stderr, '');
  assert.equal(first.stdout, second.stdout);
  assert.deepEqual(JSON.parse(first.stdout), await createPlan({root}));
  assert.equal(first.stdout.includes(root), false);
  assert.equal(first.stdout.endsWith('\n'), true);
  assert.equal(first.stdout.endsWith('\n\n'), false);
  await assert.rejects(access(path.join(root, 'AGENTS.md')), {code: 'ENOENT'});
});

test('default plan Text presents actions, content, risks, and plan ID', async () => {
  const root = await temporaryTarget();
  const result = await runCreator(['plan', '--target', root]);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /^Harness Creator Plan\n/);
  assert.match(result.stdout, /Plan ID: [a-f0-9]{64}/);
  assert.match(result.stdout, /Project Context Restoration/);
  assert.match(result.stdout, /CREATE .*AGENTS\.md/i);
  assert.match(result.stdout, /Intended content/);
  assert.match(result.stdout, /Risks/);
  assert.match(result.stdout, /Effectiveness.*not-assessed/is);
});

test('apply requires the presented plan ID and reports before and after', async () => {
  const root = await temporaryTarget();
  const planned = await runCreator([
    'plan',
    '--target',
    root,
    '--format',
    'json'
  ]);
  const plan = JSON.parse(planned.stdout);
  const applied = await runCreator([
    'apply',
    '--target',
    root,
    '--plan-id',
    plan.planId
  ]);

  assert.equal(applied.code, 0);
  assert.equal(applied.stderr, '');
  assert.match(applied.stdout, /^Harness Creator Apply\n/);
  assert.match(applied.stdout, /Before Readiness/);
  assert.match(applied.stdout, /After Readiness/);
  assert.match(applied.stdout, /CREATED .*feature_list\.json/i);
  assert.match(applied.stdout, /Effectiveness.*not-assessed/is);
  assert.match(
    await readFile(path.join(root, 'feature_list.json'), 'utf8'),
    /harness-context-restoration/
  );
});

test('Claude and handoff options are stable across plan and apply', async () => {
  const root = await temporaryTarget();
  const options = [
    '--target',
    root,
    '--agent-file',
    'CLAUDE.md',
    '--with-handoff',
    '--format',
    'json'
  ];
  const planned = JSON.parse((await runCreator(['plan', ...options])).stdout);
  const applied = await runCreator([
    'apply',
    ...options,
    '--plan-id',
    planned.planId
  ]);

  assert.equal(applied.code, 0);
  assert.equal(JSON.parse(applied.stdout).plan.options.agentFile, 'CLAUDE.md');
  await access(path.join(root, 'CLAUDE.md'));
  await access(path.join(root, 'session-handoff.md'));
});

test('pretty is JSON-only and invalid arguments exit two with usage', async () => {
  const root = await temporaryTarget();
  const cases = [
    {
      arguments: ['plan', '--target', root, '--pretty'],
      message: /--pretty.*JSON/i
    },
    {
      arguments: ['apply', '--target', root],
      message: /Missing required argument: --plan-id/
    },
    {
      arguments: ['plan', '--target', root, '--format', 'yaml'],
      message: /Invalid format: yaml/
    },
    {
      arguments: ['plan', '--target', root, '--target', root],
      message: /Duplicate argument: --target/
    },
    {
      arguments: ['unknown', '--target', root],
      message: /Unknown command: unknown/
    },
    {
      arguments: ['plan', '--force', '--target', root],
      message: /Unknown argument: --force/
    }
  ];

  for (const item of cases) {
    const result = await runCreator(item.arguments);
    assert.equal(result.code, 2);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, item.message);
    assert.match(result.stderr, /Usage:/);
  }
});

test('stale apply exits two without creating harness files', async () => {
  const root = await temporaryTarget();
  const plan = JSON.parse((await runCreator([
    'plan',
    '--target',
    root,
    '--format',
    'json'
  ])).stdout);
  await writeFile(path.join(root, 'AGENTS.md'), '# Changed after planning\n');

  const result = await runCreator([
    'apply',
    '--target',
    root,
    '--plan-id',
    plan.planId
  ]);

  assert.equal(result.code, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /does not match current target state/i);
  assert.match(result.stderr, /Usage:/);
  await assert.rejects(
    access(path.join(root, 'feature_list.json')),
    {code: 'ENOENT'}
  );
});

test('help documents only the bounded command surface', async () => {
  const result = await runCreator(['--help']);

  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /creator plan/);
  assert.match(result.stdout, /creator apply/);
  assert.match(result.stdout, /--plan-id/);
  assert.doesNotMatch(result.stdout, /--force|--output|setup|install/);
});
