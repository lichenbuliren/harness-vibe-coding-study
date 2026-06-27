import assert from 'node:assert/strict';
import {
  readFile,
  readdir
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const skillRoot = path.join(repositoryRoot, 'skills', 'harness-doctor');

async function readRepositoryFile(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), 'utf8');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, 'SKILL.md must start with YAML frontmatter');
  const entries = match[1].split('\n').map((line) => {
    const separator = line.indexOf(':');
    assert.notEqual(separator, -1, `Invalid frontmatter line: ${line}`);
    return [
      line.slice(0, separator).trim(),
      line.slice(separator + 1).trim()
    ];
  });
  return {
    entries,
    body: content.slice(match[0].length)
  };
}

async function listRelativeFiles(root, relativeDirectory = '') {
  const entries = await readdir(path.join(root, relativeDirectory), {
    withFileTypes: true
  });
  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listRelativeFiles(root, relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files.sort();
}

test('legacy validator baseline demonstrates the rejected audit model', async () => {
  const baseline = JSON.parse(await readRepositoryFile(
    'tests/harness-doctor/fixtures/legacy-validator-baseline.json'
  ));

  assert.equal(typeof baseline.overall, 'number');
  assert.equal(baseline.bottleneck, 'state');
  assert.deepEqual(Object.keys(baseline.subsystems), [
    'instructions',
    'state',
    'verification',
    'scope',
    'lifecycle'
  ]);
  assert.notDeepEqual(Object.keys(baseline.subsystems), [
    'instructions',
    'tools',
    'environment',
    'state',
    'feedback'
  ]);
});

test('skill frontmatter is concise and trigger-oriented', async () => {
  const content = await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');
  const { entries, body } = parseFrontmatter(content);
  const frontmatter = Object.fromEntries(entries);

  assert.deepEqual(entries.map(([key]) => key), ['name', 'description']);
  assert.equal(frontmatter.name, 'harness-doctor');
  assert.match(frontmatter.description, /^Use when /);
  assert.match(frontmatter.description, /hard to start, resume, verify, or diagnose/);
  assert.ok(frontmatter.description.length <= 1024);
  const bodyWords = body.trim().split(/\s+/).filter(Boolean);
  assert.ok(bodyWords.length <= 500, `SKILL.md body has ${bodyWords.length} words`);
});

test('skill body preserves interpretation and read-only guardrails', async () => {
  const content = await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');

  assert.match(content, /candidate bottleneck/i);
  assert.match(content, /Effectiveness/);
  assert.match(content, /Unknown/);
  assert.match(content, /read-only/i);
  assert.match(content, /harness-creator/);
  assert.doesNotMatch(content, /overall score/i);
});

test('OpenAI metadata matches the skill and names it in the default prompt', async () => {
  const metadata = await readFile(
    path.join(skillRoot, 'agents', 'openai.yaml'),
    'utf8'
  );

  assert.match(metadata, /^interface:\n/);
  assert.match(metadata, /display_name: "Harness Doctor"/);
  assert.match(
    metadata,
    /short_description: "Diagnose coding-agent harness readiness"/
  );
  assert.match(metadata, /default_prompt: "Use \$harness-doctor /);
  assert.doesNotMatch(metadata, /^dependencies:/m);
  assert.doesNotMatch(metadata, /^policy:/m);
});

test('skill package contains no auxiliary or duplicated contract files', async () => {
  const files = await listRelativeFiles(skillRoot);
  const allowedFiles = new Set([
    'SKILL.md',
    'agents/openai.yaml',
    'scripts/doctor.mjs',
    'scripts/renderers.mjs'
  ]);

  assert.equal(files.some((file) => /readme|changelog/i.test(file)), false);
  assert.equal(files.some((file) => /schema|capabilities\.json/i.test(file)), false);
  assert.equal(files.every((file) => allowedFiles.has(file)), true);
  assert.equal(files.includes('SKILL.md'), true);
  assert.equal(files.includes('agents/openai.yaml'), true);
});
