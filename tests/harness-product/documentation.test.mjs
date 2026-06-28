import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

async function read(relative) {
  return readFile(path.join(repositoryRoot, relative), 'utf8');
}

test('guide preserves the canonical first-run workflow', async () => {
  const guide = await read('docs/harness-engineering-guide.md');
  const markers = [
    'node scripts/install-harness-plugin.mjs',
    '新建 Codex thread',
    '$harness-engineering:harness-creator',
    'Project Context Restoration',
    './init.sh',
    '$harness-engineering:harness-doctor'
  ];
  let cursor = -1;
  for (const marker of markers) {
    const next = guide.indexOf(marker, cursor + 1);
    assert.notEqual(next, -1, `missing workflow marker: ${marker}`);
    assert.ok(next > cursor, `workflow marker is out of order: ${marker}`);
    cursor = next;
  }
});

test('guide states namespace and evidence boundaries', async () => {
  const guide = await read('docs/harness-engineering-guide.md');
  assert.match(guide, /bare.*\$harness-creator|裸名.*\$harness-creator/s);
  assert.match(guide, /Readiness/);
  assert.match(guide, /Effectiveness/);
  assert.match(guide, /尚未.*公开|没有.*公开/s);
  assert.doesNotMatch(guide, /npm install.*harness-engineering/);
});

test('repository navigation links to the user guide', async () => {
  for (const relative of ['README.md', 'docs/index.md']) {
    assert.match(
      await read(relative),
      /harness-engineering-guide\.md/,
      `${relative} must link to the guide`
    );
  }
});
