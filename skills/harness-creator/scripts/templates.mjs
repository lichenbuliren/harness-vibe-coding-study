const CONTEXT_BEHAVIOR = 'Complete project-owned mission, scope, canonical language, product or architecture boundaries, evidence status, and restart assumptions in CONTEXT.md or a declared equivalent.';
const CONTEXT_REVIEW = 'Review CONTEXT.md or the declared equivalent for project-owned mission, scope and non-goals, canonical language, product or architecture boundaries, evidence status, and restart assumptions.';

function finalNewline(value) {
  return `${value.trimEnd()}\n`;
}

function shellDoubleQuoted(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('$', '\\$')
    .replaceAll('`', '\\`');
}

function commandExecutable(command) {
  const token = command.trim().split(/\s+/, 1)[0];
  return token.startsWith('./') ? null : token;
}

export function contextRestorationFeature(status = 'next') {
  return {
    id: 'harness-context-restoration',
    name: 'Project Context Restoration',
    behavior: CONTEXT_BEHAVIOR,
    dependencies: [],
    status,
    verification: {
      kind: 'manual',
      steps: [CONTEXT_REVIEW]
    },
    evidence: []
  };
}

export function renderAgentInstructions({
  agentFile,
  verificationCommands
}) {
  const commands = verificationCommands.length > 0
    ? verificationCommands.map((command) => `- \`${command}\``).join('\n')
    : '- Add a project-specific verification command before claiming work done.';

  return finalNewline(`# Agent Operating Contract

This repository uses a small, restartable coding-agent harness.

## Startup

1. Confirm the working directory with \`pwd\`.
2. Read \`${agentFile}\`, \`README.md\` when present, and \`CONTEXT.md\` when present.
3. Read \`feature_list.json\` and \`progress.md\`.
4. Run \`./init.sh\` to check harness paths and required tools.
5. Work from exactly one active feature.

## Working Rules

- Preserve project-owned facts and existing files.
- Keep one active feature unless the tracker explicitly uses parallel mode.
- Stay inside the active feature's behavior and dependencies.
- Run documented verification before claiming completion.
- Record concrete evidence before setting a feature to \`done\`.
- Update \`progress.md\` when state, blockers, evidence, or next steps change.

## Verification Commands

${commands}

## Definition Of Done

Work is done only when the requested behavior is complete, verification ran,
evidence is recorded, scope remains bounded, and the next session can restart
from this workflow.
`);
}

export function renderFeatureState() {
  return finalNewline(JSON.stringify({
    schemaVersion: '1.0.0',
    mode: 'serial',
    features: [contextRestorationFeature()]
  }, null, 2));
}

export function renderProgress() {
  return finalNewline(`# Session Progress

## Current State

- Active feature: \`harness-context-restoration - Project Context Restoration\`
- Status: The minimal harness exists; project-owned context is still required.

## Completed

- Created a check-first coding-agent harness without replacing project files.

## Next

1. Work with the project owner and repository evidence.
2. Complete \`CONTEXT.md\` or a declared equivalent with real project facts.
3. Run \`./init.sh\` and the documented project verification commands.
4. Record evidence in \`feature_list.json\` before marking the feature done.

## Blockers And Risks

- Mission, scope, canonical language, architecture boundaries, and restart
  assumptions cannot be inferred safely without project evidence.
`);
}

export function renderHandoff() {
  return finalNewline(`# Session Handoff

## Current Objective

Complete the Project Context Restoration feature using project-owned facts.

## Current State

- Harness bootstrap: created
- Active feature: \`harness-context-restoration\`
- Verification evidence: not yet recorded

## Next Session

1. Read the agent instruction file.
2. Read \`feature_list.json\` and \`progress.md\`.
3. Run \`./init.sh\`.
4. Complete and verify Project Context Restoration.
`);
}

export function renderInit({
  requiredPaths,
  verificationCommands
}) {
  const pathChecks = requiredPaths.map((item) => (
    `check_path "${shellDoubleQuoted(item)}"`
  )).join('\n');
  const executables = [...new Set(
    verificationCommands.map(commandExecutable).filter(Boolean)
  )];
  const toolChecks = executables.length > 0
    ? executables.map((item) => `check_tool "${shellDoubleQuoted(item)}"`).join('\n')
    : 'echo "No project verification executable was discovered."';
  const commandLines = verificationCommands.length > 0
    ? verificationCommands.map(
      (command) => `printf '  - %s\\n' "${shellDoubleQuoted(command)}"`
    ).join('\n')
    : 'echo "  - Add a project-specific verification command."';

  return finalNewline(`#!/bin/bash
set -euo pipefail

check_path() {
  if [[ ! -e "$1" ]]; then
    echo "MISSING: $1" >&2
    return 1
  fi
  echo "OK: $1"
}

check_tool() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "MISSING TOOL: $1" >&2
    return 1
  fi
  echo "OK TOOL: $1"
}

echo "=== Harness path check ==="
${pathChecks}

echo "=== Required tool check ==="
${toolChecks}

echo "=== Project verification commands ==="
${commandLines}

echo "=== Harness check complete ==="
echo "Next: read feature_list.json and progress.md, then run the listed verification commands."
`);
}

export function renderManifest({
  agentFile,
  environmentPaths,
  includeHandoff,
  verificationCommands
}) {
  const artifacts = {
    instructions: [agentFile],
    context: ['CONTEXT.md'],
    featureState: ['feature_list.json'],
    progress: ['progress.md'],
    environment: environmentPaths,
    tools: ['init.sh']
  };
  if (includeHandoff) {
    artifacts.handoff = ['session-handoff.md'];
  }

  return finalNewline(JSON.stringify({
    schemaVersion: '1.0.0',
    artifacts,
    commands: {
      initialize: ['./init.sh'],
      verify: [...new Set(['./init.sh', ...verificationCommands])]
    }
  }, null, 2));
}
