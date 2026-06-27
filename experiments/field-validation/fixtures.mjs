import {createHash} from 'node:crypto';
import {execFile, spawn} from 'node:child_process';
import {
  chmod,
  mkdir,
  readFile,
  readdir,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';

const execFileAsync = promisify(execFile);

const normalizationTest = (functionName, noun) => `import assert from 'node:assert/strict';
import test from 'node:test';

import {${functionName}} from '../src/normalize.mjs';

test('normalizes, removes empty values, and preserves first-seen order', () => {
  assert.deepEqual(
    ${functionName}([' Alpha ', 'beta', 'ALPHA', '', '  ', 'Beta', 'gamma']),
    ['alpha', 'beta', 'gamma']
  );
});

test('does not mutate the input', () => {
  const ${noun} = [' One ', 'TWO'];
  ${functionName}(${noun});
  assert.deepEqual(${noun}, [' One ', 'TWO']);
});

test('rejects non-array input', () => {
  assert.throws(() => ${functionName}('alpha'), TypeError);
});
`;

const unitTest = (functionName, cases) => `import assert from 'node:assert/strict';
import test from 'node:test';

import {${functionName}} from '../src/units.mjs';

test('parses every supported integer unit', () => {
${cases.map(([input, output]) =>
    `  assert.equal(${functionName}('${input}'), ${output});`).join('\n')}
});

test('trims surrounding whitespace and accepts uppercase units', () => {
  assert.equal(${functionName}('  ${cases[1][0].toUpperCase()}  '), ${cases[1][1]});
});

test('rejects decimals, negatives, missing units, and unknown units', () => {
  for (const value of ['1.5${cases[0][0].replace(/\d+/g, '')}', '-1${cases[0][0].replace(/\d+/g, '')}', '10', '4wat']) {
    assert.throws(() => ${functionName}(value), TypeError);
  }
});
`;

function featureState(definition) {
  return {
    schemaVersion: '1.0.0',
    mode: 'serial',
    features: [{
      id: `pilot-${definition.id}`,
      name: definition.taskName,
      behavior: definition.behavior,
      dependencies: [],
      status: 'in-progress',
      verification: {
        kind: 'command',
        steps: ['npm test']
      },
      evidence: []
    }]
  };
}

const definitions = [
  {
    id: 'fresh-bare',
    order: 1,
    family: 'fresh',
    condition: 'bare',
    taskName: 'Normalize tags',
    functionName: 'normalizeTags',
    source: 'src/normalize.mjs',
    test: 'test/normalize.test.mjs',
    behavior:
      'Implement normalizeTags(values): require an array, trim and lowercase strings, remove empty values, deduplicate, preserve first-seen order, and do not mutate input.',
    entrypoints: ['TASK.md', 'package.json'],
    allowedChangedPaths: ['src/normalize.mjs']
  },
  {
    id: 'fresh-harness',
    order: 2,
    family: 'fresh',
    condition: 'harness',
    taskName: 'Normalize labels',
    functionName: 'normalizeLabels',
    source: 'src/normalize.mjs',
    test: 'test/normalize.test.mjs',
    behavior:
      'Implement normalizeLabels(values): require an array, trim and lowercase strings, remove empty values, deduplicate, preserve first-seen order, and do not mutate input.',
    entrypoints: [
      'AGENTS.md',
      'CONTEXT.md',
      'feature_list.json',
      'progress.md'
    ],
    allowedChangedPaths: [
      'src/normalize.mjs',
      'feature_list.json',
      'progress.md'
    ]
  },
  {
    id: 'resume-harness',
    order: 3,
    family: 'resume',
    condition: 'harness',
    taskName: 'Resume duration parsing',
    functionName: 'parseDuration',
    source: 'src/units.mjs',
    test: 'test/units.test.mjs',
    behavior:
      'Finish parseDuration(value): trim input, accept non-negative integer ms, s, and min units case-insensitively, return milliseconds, and throw TypeError for every invalid value.',
    entrypoints: [
      'AGENTS.md',
      'CONTEXT.md',
      'feature_list.json',
      'progress.md'
    ],
    allowedChangedPaths: [
      'src/units.mjs',
      'feature_list.json',
      'progress.md'
    ],
    units: [
      ['250ms', 250],
      ['2s', 2000],
      ['3min', 180000]
    ],
    factors: {
      ms: 1,
      s: 1000,
      min: 60000
    },
    partialUnits: ['s', 'min']
  },
  {
    id: 'resume-bare',
    order: 4,
    family: 'resume',
    condition: 'bare',
    taskName: 'Resume byte parsing',
    functionName: 'parseBytes',
    source: 'src/units.mjs',
    test: 'test/units.test.mjs',
    behavior:
      'Finish parseBytes(value): trim input, accept non-negative integer b, kb, and mb units case-insensitively, return bytes, and throw TypeError for every invalid value.',
    entrypoints: ['TASK.md', 'package.json'],
    allowedChangedPaths: ['src/units.mjs'],
    units: [
      ['512b', 512],
      ['2kb', 2000],
      ['3mb', 3000000]
    ],
    factors: {
      b: 1,
      kb: 1000,
      mb: 1000000
    },
    partialUnits: ['kb', 'mb']
  }
];

export const fixtureDefinitions = Object.freeze(
  definitions.map((definition) => Object.freeze({
    ...definition,
    entrypoints: Object.freeze([...definition.entrypoints]),
    allowedChangedPaths: Object.freeze([...definition.allowedChangedPaths])
  }))
);

function packageDocument(definition) {
  return {
    name: `field-${definition.id}`,
    private: true,
    type: 'module',
    scripts: {
      test: 'node --test'
    }
  };
}

function freshSource(definition) {
  return `export function ${definition.functionName}(values) {
  throw new Error('Not implemented');
}
`;
}

function partialUnitSource(definition) {
  const partialPattern = definition.partialUnits.join('|');
  return `const factors = ${JSON.stringify(definition.factors, null, 2)};

export function ${definition.functionName}(value) {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a unit string');
  }
  const match = /^(\\d+)(${partialPattern})$/i.exec(value);
  if (match === null) {
    throw new TypeError('invalid unit value');
  }
  return Number(match[1]) * factors[match[2].toLowerCase()];
}
`;
}

async function writeHarness(root, definition) {
  await writeFile(path.join(root, 'AGENTS.md'), `# Agent Contract

Read CONTEXT.md, feature_list.json, and progress.md. Work only on the active
feature. Run ./init.sh on entry and npm test before completion. Update feature
evidence and progress after verification.
`);
  await writeFile(path.join(root, 'CONTEXT.md'), `# Project Context

This small Node library parses or normalizes user-provided strings.

Keep public functions deterministic, avoid input mutation, and throw TypeError
for values outside the declared contract.
`);
  await writeFile(
    path.join(root, 'feature_list.json'),
    `${JSON.stringify(featureState(definition), null, 2)}\n`
  );
  await writeFile(path.join(root, 'progress.md'), `# Progress

Active task: ${definition.taskName}

The implementation is incomplete. The declared npm test suite is the completion
gate. Continue only this feature and record passing evidence when finished.
`);
  await writeFile(path.join(root, 'init.sh'), `#!/bin/sh
set -eu

npm test
`);
  await chmod(path.join(root, 'init.sh'), 0o755);
}

async function initializeGit(root) {
  await execFileAsync('git', ['init', '-q'], {cwd: root});
  await execFileAsync('git', ['config', 'user.name', 'Harness Pilot'], {
    cwd: root
  });
  await execFileAsync('git', ['config', 'user.email', 'pilot@example.invalid'], {
    cwd: root
  });
  await execFileAsync('git', ['add', '.'], {cwd: root});
  await execFileAsync('git', ['commit', '-q', '-m', 'Initial pilot fixture'], {
    cwd: root,
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: '2026-06-27T00:00:00Z',
      GIT_COMMITTER_DATE: '2026-06-27T00:00:00Z'
    }
  });
}

async function createFixture(root, definition) {
  await mkdir(path.join(root, 'src'), {recursive: true});
  await mkdir(path.join(root, 'test'), {recursive: true});
  await writeFile(
    path.join(root, 'package.json'),
    `${JSON.stringify(packageDocument(definition), null, 2)}\n`
  );

  if (definition.family === 'fresh') {
    await writeFile(path.join(root, definition.source), freshSource(definition));
    await writeFile(
      path.join(root, definition.test),
      normalizationTest(
        definition.functionName,
        definition.condition === 'bare' ? 'tags' : 'labels'
      )
    );
  } else {
    await writeFile(
      path.join(root, definition.source),
      partialUnitSource(definition)
    );
    await writeFile(
      path.join(root, definition.test),
      unitTest(definition.functionName, definition.units)
    );
  }

  if (definition.condition === 'harness') {
    await writeHarness(root, definition);
  } else {
    await writeFile(path.join(root, 'TASK.md'), `# ${definition.taskName}

${definition.behavior}

Verification: \`npm test\`.
`);
  }
  await initializeGit(root);
}

export async function createPilotFixtures(parent) {
  await mkdir(parent, {recursive: true});
  const created = {};
  for (const definition of fixtureDefinitions) {
    const root = path.join(parent, definition.id);
    await mkdir(root);
    await createFixture(root, definition);
    created[definition.id] = root;
  }
  return created;
}

export function runVerification(root) {
  return new Promise((resolve, reject) => {
    const environment = {
      ...process.env,
      FORCE_COLOR: '0',
      NO_COLOR: '1'
    };
    delete environment.NODE_TEST_CONTEXT;
    const child = spawn('npm', ['test'], {
      cwd: root,
      env: environment,
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

async function collectTree(root, relative, excludeGit) {
  const entries = await readdir(path.join(root, relative), {
    withFileTypes: true
  });
  const records = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name))) {
    if (excludeGit && relative === '' && entry.name === '.git') {
      continue;
    }
    const item = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      records.push(['directory', item]);
      records.push(...await collectTree(root, item, excludeGit));
    } else if (entry.isFile()) {
      records.push([
        'file',
        item,
        await readFile(path.join(root, item), 'base64')
      ]);
    }
  }
  return records;
}

export async function treeDigest(root, options = {}) {
  return createHash('sha256')
    .update(JSON.stringify(await collectTree(
      root,
      '',
      options.excludeGit === true
    )))
    .digest('hex');
}
