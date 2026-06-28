import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const skillRoot = path.join(root, 'skills', 'harness-archiver');

test('skill is explicit, user-triggered, and plan-bound', async () => {
  const skill = await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8');
  const metadata = skill.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';

  assert.match(metadata, /^name: harness-archiver$/mu);
  assert.match(metadata, /^description: Use when /mu);
  assert.match(skill, /archiver\.mjs plan/u);
  assert.match(skill, /archiver\.mjs apply/u);
  assert.match(skill, /user.*active|explicit/iu);
  assert.doesNotMatch(skill, /automatic.*archive/iu);
  assert.ok(skill.trim().split(/\s+/u).length <= 500);
});

test('OpenAI metadata names the Archiver', async () => {
  const metadata = await readFile(
    path.join(skillRoot, 'agents', 'openai.yaml'),
    'utf8'
  );
  assert.match(metadata, /display_name: "Harness Archiver"/u);
  assert.match(metadata, /default_prompt: "Use \$harness-archiver /u);
});
