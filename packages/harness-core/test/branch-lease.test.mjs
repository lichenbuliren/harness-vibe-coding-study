import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

import * as core from '../src/index.mjs';

const execFileAsync = promisify(execFile);
const cliPath = path.resolve(
  import.meta.dirname,
  '..',
  'bin',
  'branch-lease.mjs'
);

async function git(root, ...arguments_) {
  return execFileAsync('git', ['-C', root, ...arguments_], {
    encoding: 'utf8'
  });
}

async function repository() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'harness-lease-'));
  await git(root, 'init', '-b', 'main');
  await git(root, 'config', 'user.email', 'test@example.com');
  await git(root, 'config', 'user.name', 'Harness Test');
  await writeFile(path.join(root, 'README.md'), '# Fixture\n');
  await git(root, 'add', 'README.md');
  await git(root, 'commit', '-m', 'fixture');
  return root;
}

function claimOptions(root, overrides = {}) {
  return {
    root,
    featureId: 'feat-lease',
    threadId: 'thread-a',
    now: () => '2026-06-28T00:00:00.000Z',
    createLeaseId: () => 'lease-a',
    ...overrides
  };
}

test('claims once and is idempotent for the same thread', async () => {
  const root = await repository();

  const first = await core.claimBranchLease(claimOptions(root));
  const second = await core.claimBranchLease(claimOptions(root));

  assert.equal(first.status, 'claimed');
  assert.equal(second.status, 'owned');
  assert.deepEqual(second.lease, first.lease);
});

test('blocks a foreign thread before mutation', async () => {
  const root = await repository();
  await core.claimBranchLease(claimOptions(root));

  const result = await core.claimBranchLease(claimOptions(root, {
    threadId: 'thread-b',
    createLeaseId: () => 'lease-b'
  }));

  assert.equal(result.status, 'blocked');
  assert.equal(result.reason, 'branch-owned-by-another-thread');
  assert.equal(result.lease.threadId, 'thread-a');
  assert.equal(result.changed, false);
});

test('only the matching owner and token can release', async () => {
  const root = await repository();
  const claimed = await core.claimBranchLease(claimOptions(root));

  await assert.rejects(
    core.releaseBranchLease({
      root,
      threadId: 'thread-a',
      leaseId: 'wrong'
    }),
    {code: 'LEASE_OWNER_MISMATCH'}
  );
  const released = await core.releaseBranchLease({
    root,
    threadId: 'thread-a',
    leaseId: claimed.lease.leaseId
  });

  assert.equal(released.status, 'released');
  assert.equal((await core.readBranchLease({
    root,
    threadId: 'thread-a'
  })).status, 'missing');
});

test('concurrent claims have one winner and one blocked result', async () => {
  const root = await repository();

  const results = await Promise.all([
    core.claimBranchLease(claimOptions(root)),
    core.claimBranchLease(claimOptions(root, {
      threadId: 'thread-b',
      createLeaseId: () => 'lease-b'
    }))
  ]);

  assert.equal(results.filter((item) => item.status === 'claimed').length, 1);
  assert.equal(results.filter((item) => item.status === 'blocked').length, 1);
});

test('requires stable thread identity and an attached branch', async () => {
  const root = await repository();

  await assert.rejects(
    core.claimBranchLease(claimOptions(root, {threadId: ''})),
    {code: 'MISSING_THREAD_ID'}
  );
  await git(root, 'checkout', '--detach');
  await assert.rejects(
    core.claimBranchLease(claimOptions(root)),
    {code: 'DETACHED_HEAD'}
  );
});

test('linked worktrees resolve one Git common directory', async () => {
  const root = await repository();
  const linked = `${root}-linked`;
  await git(root, 'worktree', 'add', '-b', 'linked-work', linked);

  const mainWorkspace = await core.discoverGitWorkspace(root);
  const linkedWorkspace = await core.discoverGitWorkspace(linked);

  assert.equal(mainWorkspace.commonDir, linkedWorkspace.commonDir);
  assert.notEqual(mainWorkspace.gitDir, linkedWorkspace.gitDir);
});

test('takeover binds the exact foreign lease digest', async () => {
  const root = await repository();
  await core.claimBranchLease(claimOptions(root));

  const plan = await core.planBranchLeaseTakeover({
    root,
    threadId: 'thread-b'
  });
  const applied = await core.applyBranchLeaseTakeover({
    root,
    threadId: 'thread-b',
    featureId: 'feat-lease',
    planId: plan.planId,
    now: () => '2026-06-28T01:00:00.000Z',
    createLeaseId: () => 'lease-b'
  });

  assert.equal(applied.status, 'claimed');
  assert.equal(applied.lease.threadId, 'thread-b');
});

test('CLI blocks a foreign thread with actionable text and no rewrite', async () => {
  const root = await repository();
  await core.claimBranchLease(claimOptions(root));
  const workspace = await core.discoverGitWorkspace(root);
  const before = await readFile(workspace.leasePath, 'utf8');

  await assert.rejects(
    execFileAsync(process.execPath, [
      cliPath,
      'claim',
      '--target',
      root,
      '--feature-id',
      'feat-lease'
    ], {
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_THREAD_ID: 'thread-b'
      }
    }),
    (error) => {
      assert.equal(error.code, 2);
      assert.match(error.stdout, /BLOCKED: branch-owned-by-another-thread/);
      assert.match(error.stdout, /No files were modified/);
      assert.match(error.stdout, /separate branch\/worktree/);
      return true;
    }
  );
  assert.equal(await readFile(workspace.leasePath, 'utf8'), before);
});
