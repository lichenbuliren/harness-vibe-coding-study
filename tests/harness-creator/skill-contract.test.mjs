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
const skillRoot = path.join(repositoryRoot, 'skills', 'harness-creator');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, 'SKILL.md must start with YAML frontmatter');
  const entries = match[1].split('\n').map((line) => {
    const separator = line.indexOf(':');
    assert.notEqual(separator, -1);
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

test('skill frontmatter is concise and trigger-oriented', async () => {
  const content = await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');
  const {entries, body} = parseFrontmatter(content);
  const frontmatter = Object.fromEntries(entries);

  assert.deepEqual(entries.map(([key]) => key), ['name', 'description']);
  assert.equal(frontmatter.name, 'harness-creator');
  assert.match(frontmatter.description, /^Use when /);
  assert.match(frontmatter.description, /create|improve/i);
  assert.ok(body.trim().split(/\s+/).length <= 500);
});

test('skill enforces plan-bound apply and project-owned context', async () => {
  const content = await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');

  assert.match(content, /\bplanId\b/);
  assert.match(content, /present/i);
  assert.match(content, /Project Context Restoration/);
  assert.match(content, /CONTEXT\.md/);
  assert.match(content, /harness-doctor/);
  assert.match(content, /project facts/i);
  assert.doesNotMatch(content, /--force/);
});

test('OpenAI metadata matches the Creator workflow', async () => {
  const metadata = await readFile(
    path.join(skillRoot, 'agents', 'openai.yaml'),
    'utf8'
  );

  assert.match(metadata, /^interface:\n/);
  assert.match(metadata, /display_name: "Harness Creator"/);
  assert.match(metadata, /short_description: "Create safe coding-agent harnesses"/);
  assert.match(metadata, /default_prompt: "Use \$harness-creator /);
  assert.doesNotMatch(metadata, /^dependencies:/m);
});

test('skill package excludes duplicated contracts and auxiliary docs', async () => {
  const files = await listRelativeFiles(skillRoot);

  assert.equal(files.includes('SKILL.md'), true);
  assert.equal(files.includes('agents/openai.yaml'), true);
  assert.equal(files.some((file) => /readme|changelog/i.test(file)), false);
  assert.equal(files.some((file) => /schema|capabilities\.json/i.test(file)), false);
});
