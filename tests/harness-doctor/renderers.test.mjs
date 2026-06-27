import assert from 'node:assert/strict';
import test from 'node:test';

import {
  renderHtml,
  renderMarkdown,
  renderText
} from '../../skills/harness-doctor/scripts/renderers.mjs';

const assessment = {
  schemaVersion: '1.0.0',
  target: '.',
  mode: 'readiness',
  subsystems: {
    instructions: {
      level: null,
      label: 'Unknown',
      evidence: [],
      gaps: [],
      unknowns: [{
        ruleId: 'instructions.guidance',
        source: 'PROJECT<unsafe>.md',
        code: 'unreadable',
        detail: '<unsafe & value>'
      }]
    },
    tools: {
      level: 2,
      label: 'Operational',
      evidence: [{
        ruleId: 'tools.access',
        source: '.codex/config.toml',
        result: 'valid',
        detail: 'Tool configuration is readable.'
      }],
      gaps: [],
      unknowns: []
    },
    environment: {
      level: 1,
      label: 'Present',
      evidence: [],
      gaps: [{
        ruleId: 'environment.bootstrap',
        source: 'init.sh',
        code: 'not-executable',
        detail: 'Initialization is not executable.'
      }],
      unknowns: []
    },
    state: {
      level: 0,
      label: 'Missing',
      evidence: [],
      gaps: [{
        ruleId: 'state.feature',
        source: 'feature_list.json',
        code: 'missing-feature-state',
        detail: 'Feature state is missing.'
      }],
      unknowns: []
    },
    feedback: {
      level: 2,
      label: 'Operational',
      evidence: [],
      gaps: [],
      unknowns: []
    }
  },
  candidateBottlenecks: ['state', 'environment'],
  recommendations: [
    {
      ruleId: 'state.continuity',
      subsystem: 'state',
      priority: 1,
      message: 'Add canonical feature state.'
    },
    {
      ruleId: 'environment.bootstrap',
      subsystem: 'environment',
      priority: 2,
      message: 'Make initialization executable.'
    }
  ],
  unknowns: [{
    ruleId: 'manifest.load',
    source: '.harness/manifest.json',
    code: 'invalid-json',
    detail: 'Manifest is invalid.'
  }],
  limitations: [
    'This assessment measures structural Readiness, not task Effectiveness.'
  ],
  effectiveness: {
    status: 'not-assessed',
    reason: 'Representative task evidence was not provided.'
  }
};

const renderers = [
  ['Text', renderText],
  ['Markdown', renderMarkdown],
  ['HTML', renderHtml]
];

for (const [name, render] of renderers) {
  test(`${name} preserves the supplied maturity profile`, () => {
    const output = render(assessment);

    assert.match(output, /Instructions/i);
    assert.match(output, /Unknown/);
    assert.match(output, /Tools/);
    assert.match(output, /2/);
    assert.match(output, /Operational/);
    assert.match(output, /Environment/);
    assert.match(output, /Present/);
    assert.match(output, /State/);
    assert.match(output, /Missing/);
    assert.match(output, /Feedback/);
  });

  test(`${name} preserves bottleneck, recommendation, and evidence order`, () => {
    const output = render(assessment);

    assert.ok(output.indexOf('state') < output.indexOf('environment'));
    assert.ok(
      output.indexOf('state.continuity')
      < output.indexOf('environment.bootstrap')
    );
    assert.match(output, /state\.feature/);
    assert.match(output, /Effectiveness/i);
    assert.match(output, /not-assessed/);
    assert.match(output, /Readiness/);
  });
}

test('Text uses a compact terminal-oriented structure', () => {
  const output = renderText(assessment);

  assert.match(output, /^Harness Doctor\nMode: readiness\nSchema: 1\.0\.0\n/);
  assert.match(output, /\nReadiness profile\n/);
  assert.match(output, /\nCandidate bottlenecks\n/);
});

test('Markdown uses stable headings and a profile table', () => {
  const output = renderMarkdown(assessment);

  assert.match(output, /^# Harness Doctor\n/);
  assert.match(output, /\| Subsystem \| Level \| Label \|/);
  assert.match(output, /^## Candidate Bottlenecks$/m);
  assert.match(output, /^## Effectiveness$/m);
});

test('HTML escapes dynamic values and has no executable or external content', () => {
  const output = renderHtml(assessment);

  assert.match(output, /^<!doctype html>/i);
  assert.match(output, /&lt;unsafe &amp; value&gt;/);
  assert.match(output, /PROJECT&lt;unsafe&gt;\.md/);
  assert.doesNotMatch(output, /<unsafe & value>/);
  assert.doesNotMatch(output, /<script/i);
  assert.doesNotMatch(output, /https?:\/\//i);
  assert.doesNotMatch(output, /<img/i);
});

test('renderers do not mutate the canonical assessment', () => {
  const before = JSON.stringify(assessment);

  for (const [, render] of renderers) {
    render(assessment);
  }

  assert.equal(JSON.stringify(assessment), before);
});
