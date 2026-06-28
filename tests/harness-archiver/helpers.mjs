import { execFile } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function git(root, ...args) {
  return execFileAsync('git', ['-C', root, ...args], {encoding: 'utf8'});
}

export async function fixture({status = 'done'} = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'harness-archiver-'));
  await git(root, 'init', '-b', 'codex/archive-fixture');
  await git(root, 'config', 'user.name', 'Harness Test');
  await git(root, 'config', 'user.email', 'harness@example.test');
  await mkdir(path.join(root, 'docs/evolution'), {recursive: true});
  await mkdir(path.join(root, '.harness'), {recursive: true});
  const verification = status === 'done'
    ? {kind: 'command', steps: ['node --test']}
    : null;
  const evidence = status === 'done'
    ? [{status: 'passed', summary: 'Passed.', verificationStep: 0}]
    : [];
  await writeFile(path.join(root, 'feature_list.json'), `${JSON.stringify({
    schemaVersion: '1.1.0',
    mode: 'serial',
    features: [{
      id: 'feat-001',
      name: 'Fixture',
      behavior: 'Exercise archiving.',
      branch: 'codex/archive-fixture',
      dependencies: [],
      status,
      verification,
      evidence
    }]
  }, null, 2)}\n`);
  await writeFile(path.join(root, 'progress.md'), '# Progress\n\nDone.\n');
  await writeFile(
    path.join(root, 'docs/evolution/0001-fixture.md'),
    '# Fixture evolution\n'
  );
  await writeFile(path.join(root, '.harness/manifest.json'), '{}\n');
  await git(root, 'add', '.');
  await git(root, 'commit', '-m', 'fixture');
  return root;
}

export async function treeDigest(root) {
  const entries = [];
  async function walk(relative = '') {
    for (const entry of await readdir(path.join(root, relative), {
      withFileTypes: true
    })) {
      if (entry.name === '.git') continue;
      const item = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) await walk(item);
      else entries.push([item, await readFile(path.join(root, item), 'utf8')]);
    }
  }
  await walk();
  return JSON.stringify(entries.sort(([a], [b]) => a.localeCompare(b)));
}
