import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {
  mkdtemp,
  readFile,
  readdir
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  packagePlugin
} from '../../scripts/package-harness-plugin.mjs';

export function runNode(script, arguments_, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...arguments_], {
      cwd: options.cwd,
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

export async function packagedProduct() {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'harness-e2e-product-'));
  const pluginRoot = path.join(parent, 'harness-engineering');
  await packagePlugin(pluginRoot);
  return {
    pluginRoot,
    creator: path.join(
      pluginRoot,
      'skills',
      'harness-creator',
      'scripts',
      'creator.mjs'
    ),
    doctor: path.join(
      pluginRoot,
      'skills',
      'harness-doctor',
      'scripts',
      'doctor.mjs'
    ),
    archiver: path.join(
      pluginRoot,
      'skills',
      'harness-archiver',
      'scripts',
      'archiver.mjs'
    )
  };
}

async function collectTree(root, relative = '') {
  const entries = await readdir(path.join(root, relative), {
    withFileTypes: true
  });
  const records = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name))) {
    const item = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      records.push(['directory', item]);
      records.push(...await collectTree(root, item));
    } else if (entry.isFile()) {
      records.push([
        'file',
        item,
        await readFile(path.join(root, item), 'base64')
      ]);
    } else if (entry.isSymbolicLink()) {
      records.push(['symlink', item]);
    }
  }
  return records;
}

export async function treeDigest(root) {
  return createHash('sha256')
    .update(JSON.stringify(await collectTree(root)))
    .digest('hex');
}

export function readinessProfile(assessment) {
  return Object.fromEntries(
    Object.entries(assessment.subsystems).map(([name, value]) => [
      name,
      value.level
    ])
  );
}
