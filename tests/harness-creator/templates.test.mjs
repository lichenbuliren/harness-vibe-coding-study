import assert from 'node:assert/strict';
import test from 'node:test';

import {
  renderAgentInstructions,
  renderFeatureState,
  renderHandoff,
  renderInit,
  renderManifest,
  renderProgress
} from '../../skills/harness-creator/scripts/templates.mjs';
import {
  validateFeatureState
} from '../../packages/harness-core/src/index.mjs';

test('agent instructions route startup, state, verification, and context', () => {
  const output = renderAgentInstructions({
    agentFile: 'AGENTS.md',
    verificationCommands: ['npm test', 'npm run lint']
  });

  assert.match(output, /^# Agent Operating Contract\n/);
  assert.match(output, /CONTEXT\.md/);
  assert.match(output, /feature_list\.json/);
  assert.match(output, /progress\.md/);
  assert.match(output, /\.\/init\.sh/);
  assert.match(output, /npm test/);
  assert.match(output, /one active feature/i);
  assert.match(output, /evidence/i);
  assert.doesNotMatch(output, /\[TODO\]|PROJECT_PURPOSE|placeholder/i);
  assert.equal(output.endsWith('\n'), true);
});

test('new feature state contains only the real context restoration task', () => {
  const document = JSON.parse(renderFeatureState());

  assert.equal(validateFeatureState(document).valid, true);
  assert.equal(document.schemaVersion, '1.0.0');
  assert.equal(document.mode, 'serial');
  assert.equal(document.features.length, 1);
  assert.deepEqual(document.features[0], {
    id: 'harness-context-restoration',
    name: 'Project Context Restoration',
    behavior: 'Complete project-owned mission, scope, canonical language, product or architecture boundaries, evidence status, and restart assumptions in CONTEXT.md or a declared equivalent.',
    dependencies: [],
    status: 'next',
    verification: {
      kind: 'manual',
      steps: [
        'Review CONTEXT.md or the declared equivalent for project-owned mission, scope and non-goals, canonical language, product or architecture boundaries, evidence status, and restart assumptions.'
      ]
    },
    evidence: []
  });
});

test('progress and handoff describe actual bootstrap state without fake facts', () => {
  const progress = renderProgress();
  const handoff = renderHandoff();

  assert.match(progress, /harness-context-restoration/);
  assert.match(progress, /Project Context Restoration/);
  assert.match(progress, /project owner/i);
  assert.match(handoff, /Project Context Restoration/);
  assert.doesNotMatch(`${progress}\n${handoff}`, /\[TODO\]|YYYY|feat-XXX/);
});

test('init is check-first and does not execute setup or project commands', () => {
  const output = renderInit({
    requiredPaths: [
      'AGENTS.md',
      'feature_list.json',
      'progress.md',
      '.harness/manifest.json'
    ],
    verificationCommands: ['npm test', 'npm run lint']
  });

  assert.match(output, /^#!\/bin\/bash\nset -euo pipefail\n/);
  assert.match(output, /command -v "\$1"/);
  assert.match(output, /check_tool "npm"/);
  assert.match(output, /npm test/);
  assert.match(output, /npm run lint/);
  assert.match(output, /feature_list\.json/);
  assert.doesNotMatch(output, /^\s*(npm|pnpm|yarn|bun) (install|test|run)/m);
  assert.doesNotMatch(output, /\bcurl\b|\bwget\b|\bfetch\b|\binstall\b/i);
  assert.doesNotMatch(output, /\btee\b|\btouch\b|\bmkdir\b|\brm\b/);
  const withoutSafeRedirections = output
    .replaceAll('>/dev/null', '')
    .replaceAll('>&2', '')
    .replaceAll('2>&1', '');
  assert.doesNotMatch(withoutSafeRedirections, />/);
});

test('manifest declares capabilities and commands without effectiveness claims', () => {
  const manifest = JSON.parse(renderManifest({
    agentFile: 'AGENTS.md',
    environmentPaths: ['package.json'],
    includeHandoff: true,
    verificationCommands: ['npm test']
  }));

  assert.deepEqual(manifest.artifacts.instructions, ['AGENTS.md']);
  assert.deepEqual(manifest.artifacts.context, ['CONTEXT.md']);
  assert.deepEqual(manifest.artifacts.featureState, ['feature_list.json']);
  assert.deepEqual(manifest.artifacts.handoff, ['session-handoff.md']);
  assert.deepEqual(manifest.artifacts.environment, ['package.json']);
  assert.deepEqual(manifest.commands.initialize, ['./init.sh']);
  assert.deepEqual(manifest.commands.verify, ['./init.sh', 'npm test']);
  assert.equal(Object.hasOwn(manifest, 'score'), false);
  assert.equal(Object.hasOwn(manifest, 'effectiveness'), false);
});
