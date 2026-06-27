# Harness Doctor Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a concise read-only `harness-doctor` skill whose command renders one shared-core assessment as JSON, Text, Markdown, or safe standalone HTML.

**Architecture:** `doctor.mjs` calls `inspectHarness()` exactly once, then delegates presentation to pure renderers that receive only the assessment object. The skill contains workflow guidance and executable scripts; repository-level tests own baseline evidence, contract validation, output parity, and no-write proof.

**Tech Stack:** Node.js ESM, Node built-ins, `node:test`, Codex skill metadata, offline `uv` validation

---

## File Map

- `skills/harness-doctor/SKILL.md`: concise workflow and interpretation
  guardrails.
- `skills/harness-doctor/agents/openai.yaml`: UI metadata generated from the
  final skill.
- `skills/harness-doctor/scripts/renderers.mjs`: pure Text, Markdown, and HTML
  views.
- `skills/harness-doctor/scripts/doctor.mjs`: argument parsing, one core
  inspection, serialization, and exit codes.
- `tests/harness-doctor/fixtures/legacy-validator-baseline.json`: captured RED
  baseline from the old creator audit.
- `tests/harness-doctor/skill-contract.test.mjs`: frontmatter, metadata,
  concision, and packaging rules.
- `tests/harness-doctor/renderers.test.mjs`: renderer parity, escaping, and
  no-rescore tests.
- `tests/harness-doctor/doctor.test.mjs`: end-to-end CLI, formats, error codes,
  determinism, and no-write behavior.
- `docs/evolution/0007-harness-doctor-skill.md`: durable implementation
  evidence.

### Task 1: Capture RED Baseline And Failing Contracts

**Files:**
- Create: `tests/harness-doctor/fixtures/legacy-validator-baseline.json`
- Create: `tests/harness-doctor/skill-contract.test.mjs`
- Create: `tests/harness-doctor/renderers.test.mjs`

- [x] **Step 1: Record the legacy baseline**

Store the observed legacy output:

```json
{
  "overall": 96,
  "bottleneck": "state",
  "subsystems": {
    "instructions": {},
    "state": {},
    "verification": {},
    "scope": {},
    "lifecycle": {}
  }
}
```

The baseline test must assert `overall` exists and the subsystem keys differ
from the canonical five. It is evidence of the old behavior, not the desired
contract.

- [x] **Step 2: Write the failing skill contract test**

Test that:

```js
const skill = await readFile('skills/harness-doctor/SKILL.md', 'utf8');
assert.match(skill, /^---\nname: harness-doctor\n/);
assert.match(skill, /description: Use when /);
assert.ok(bodyWordCount(skill) <= 500);
assert.equal(frontmatterKeys(skill), ['name', 'description']);
assert.match(openaiYaml, /display_name: "Harness Doctor"/);
assert.match(openaiYaml, /\$harness-doctor/);
```

Also assert the skill contains no `README.md`, changelog, or duplicated
schema/rules files.

- [x] **Step 3: Write failing pure-renderer tests**

Import:

```js
import {
  renderHtml,
  renderMarkdown,
  renderText
} from '../../skills/harness-doctor/scripts/renderers.mjs';
```

Use a synthetic assessment with:

```js
{
  instructions: {level: null, label: 'Unknown'},
  tools: {level: 2, label: 'Operational'},
  environment: {level: 1, label: 'Present'},
  state: {level: 0, label: 'Missing'},
  feedback: {level: 2, label: 'Operational'}
}
```

Assert each renderer preserves those exact labels, preserves candidate order,
shows Effectiveness and limitations, and renders rule IDs. Include
`<unsafe & value>` in evidence and require HTML escaping.

- [x] **Step 4: Run tests and verify RED**

Run:

```bash
node --test tests/harness-doctor/skill-contract.test.mjs \
  tests/harness-doctor/renderers.test.mjs
```

Expected: FAIL because `skills/harness-doctor` does not exist.

- [x] **Step 5: Commit RED evidence**

```bash
git add tests/harness-doctor
git commit -m "test: define harness doctor contracts"
```

### Task 2: Scaffold And Write The Minimal Skill

**Files:**
- Create: `skills/harness-doctor/SKILL.md`
- Create: `skills/harness-doctor/agents/openai.yaml`
- Remove: any scaffold placeholder/example files

- [x] **Step 1: Initialize with the official scaffold**

Run:

```bash
python3 /Users/heaven/.codex/skills/.system/skill-creator/scripts/init_skill.py \
  harness-doctor \
  --path skills \
  --resources scripts \
  --interface 'display_name=Harness Doctor' \
  --interface 'short_description=Diagnose coding-agent harness readiness' \
  --interface 'default_prompt=Use $harness-doctor to inspect this repository and explain its highest-priority harness gaps without modifying files.'
```

Expected: `skills/harness-doctor` with `SKILL.md`, `agents/openai.yaml`, and
`scripts/`.

- [x] **Step 2: Replace the scaffold body**

Use exactly two frontmatter fields:

```yaml
---
name: harness-doctor
description: Use when a coding-agent repository is hard to start, resume, verify, or diagnose, or when harness readiness and missing project capabilities need inspection.
---
```

The body must:

- run `scripts/doctor.mjs` against the requested target;
- select Text by default and another format only when requested;
- report the five-dimensional profile and unknowns;
- call low levels candidate bottlenecks rather than causes;
- show at most three prioritized recommendations in the response;
- preserve `Effectiveness: not-assessed`;
- remain read-only and hand repairs to `harness-creator`.

Keep the complete file below 500 words. Do not add a README or reference file.

- [x] **Step 3: Verify metadata**

Ensure `agents/openai.yaml` contains only:

```yaml
interface:
  display_name: "Harness Doctor"
  short_description: "Diagnose coding-agent harness readiness"
  default_prompt: "Use $harness-doctor to inspect this repository and explain its highest-priority harness gaps without modifying files."
```

- [x] **Step 4: Run skill contract validation**

Run:

```bash
node --test tests/harness-doctor/skill-contract.test.mjs
uv run --offline --with pyyaml python \
  /Users/heaven/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  skills/harness-doctor
```

Expected: Node contract test and official validator PASS. Renderer test remains
RED because renderer code is not implemented.

- [x] **Step 5: Commit**

```bash
git add skills/harness-doctor tests/harness-doctor/skill-contract.test.mjs
git commit -m "feat: add harness doctor skill"
```

### Task 3: Implement Pure Human-Readable Renderers

**Files:**
- Create: `skills/harness-doctor/scripts/renderers.mjs`
- Modify: `tests/harness-doctor/renderers.test.mjs`

- [x] **Step 1: Confirm renderer RED independently**

Run:

```bash
node --test tests/harness-doctor/renderers.test.mjs
```

Expected: FAIL with missing `renderers.mjs`.

- [x] **Step 2: Implement common view extraction**

Keep renderers pure:

```js
export function renderText(assessment) {}
export function renderMarkdown(assessment) {}
export function renderHtml(assessment) {}
```

Use the subsystem order from:

```js
import {
  SUBSYSTEM_ORDER
} from '../../../packages/harness-core/src/constants.mjs';
```

Create only presentation helpers:

```js
profileRows(assessment)
formatBottlenecks(assessment)
formatEffectiveness(assessment)
escapeHtml(value)
```

Do not import `inspectHarness`, capability rules, `fs`, or path APIs.

- [x] **Step 3: Implement Text and Markdown**

Text begins:

```text
Harness Doctor
Mode: readiness
Schema: 1.0.0

Readiness profile
Instructions: Unknown
Tools: 2 Operational
```

Markdown begins:

```markdown
# Harness Doctor

| Subsystem | Level | Label |
|---|---:|---|
```

Both include Candidate Bottlenecks, Recommendations, Unknowns, Effectiveness,
and Limitations. Preserve canonical array order.

- [x] **Step 4: Implement safe standalone HTML**

Return a complete UTF-8 document with semantic `<main>`, `<table>`,
`<section>`, and escaped dynamic values. Use inline CSS only. Do not include
`<script>`, external URLs, images, or embedded assessment JSON.

- [x] **Step 5: Run renderer tests and verify GREEN**

Run:

```bash
node --test tests/harness-doctor/renderers.test.mjs
```

Expected: all renderer parity, unusual-value, and escaping tests PASS.

- [x] **Step 6: Commit**

```bash
git add skills/harness-doctor/scripts/renderers.mjs \
  tests/harness-doctor/renderers.test.mjs
git commit -m "feat: render harness doctor reports"
```

### Task 4: Implement The Read-Only Doctor Command

**Files:**
- Create: `skills/harness-doctor/scripts/doctor.mjs`
- Create: `tests/harness-doctor/doctor.test.mjs`

- [x] **Step 1: Write failing CLI tests**

Spawn the command with real shared-core fixtures. Assert:

```js
const result = await runDoctor([
  '--target', fixture('operational'),
  '--format', 'json'
]);
assert.equal(result.code, 0);
assert.deepEqual(
  JSON.parse(result.stdout),
  await inspectHarness({root: fixture('operational')})
);
```

Also cover:

- default Text;
- Markdown and HTML;
- explicit non-standard manifest;
- Unknown fixture;
- `--pretty` accepted only for JSON;
- gaps exit `0`;
- invalid format/arguments and missing target exit `2`;
- `--help` exit `0`;
- byte-stable repeated output;
- fixture digest unchanged;
- no host paths in JSON.

- [x] **Step 2: Run CLI tests and verify RED**

Run:

```bash
node --test tests/harness-doctor/doctor.test.mjs
```

Expected: FAIL because `doctor.mjs` does not exist.

- [x] **Step 3: Implement argument parsing**

Support only:

```text
--target <directory>
--manifest <repository-relative-path>
--format text|json|markdown|html
--pretty
--help
```

Require `--target` unless help is requested. Reject duplicate/unknown options.
Reject `--pretty` unless format is JSON.

- [x] **Step 4: Inspect once and render**

Call:

```js
const assessment = await inspectHarness({
  root: options.target,
  manifestPath: options.manifestPath
});
```

exactly once. JSON uses `JSON.stringify(assessment)` directly. Other formats
call one pure renderer. Append exactly one newline to stdout.

Capability gaps exit `0`. Argument or inspection errors print concise stderr
plus usage and exit `2`.

- [x] **Step 5: Run Doctor tests and complete suite**

Run:

```bash
node --test tests/harness-doctor/*.test.mjs
node --test packages/harness-core/test/*.test.mjs
```

Expected: Doctor and shared-core suites PASS.

- [x] **Step 6: Commit**

```bash
git add skills/harness-doctor/scripts/doctor.mjs \
  tests/harness-doctor/doctor.test.mjs
git commit -m "feat: add harness doctor command"
```

### Task 5: Integrate, Record, And Complete The Feature

**Files:**
- Modify: `.harness/manifest.json`
- Modify: `init.sh`
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`
- Create: `docs/evolution/0007-harness-doctor-skill.md`
- Modify: `docs/evolution/index.md`
- Modify: `docs/index.md`

- [x] **Step 1: Declare the Doctor tool**

Add these tool artifacts to `.harness/manifest.json`:

```json
[
  ".codex/config.toml",
  "skills/harness-doctor/SKILL.md",
  "skills/harness-doctor/scripts/doctor.mjs"
]
```

Do not declare Doctor as target-project verification or Effectiveness evidence.

- [x] **Step 2: Extend startup verification**

Add:

```bash
node --test tests/harness-doctor/*.test.mjs
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" \
  skills/harness-doctor
node skills/harness-doctor/scripts/doctor.mjs \
  --target . --format json >/dev/null
```

- [x] **Step 3: Record the durable outcome**

Document:

- the old total-score/taxonomy baseline;
- thin skill and pure-renderer boundary;
- supported formats and exit codes;
- no-write and output-parity evidence;
- validation commands and results;
- remaining creator, integration, and field-validation work.

- [x] **Step 4: Run complete verification**

Run:

```bash
node --test packages/harness-core/test/*.test.mjs
node --test tests/harness-doctor/*.test.mjs
uv run --offline --with pyyaml python \
  /Users/heaven/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  skills/harness-doctor
node skills/harness-doctor/scripts/doctor.mjs \
  --target . --format json --pretty
./init.sh
git diff --check
```

Expected:

- all tests and skill validation pass;
- repository Doctor output has five Operational dimensions;
- candidate bottlenecks are empty;
- Effectiveness is `not-assessed`;
- no total score or obsolete subsystem appears.

- [x] **Step 5: Complete canonical state**

Set `feat-009` to `done` with structured passing evidence. Set only `feat-010`
to `next`. Update progress and handoff with exact command results.

- [x] **Step 6: Commit**

```bash
git add .harness skills tests init.sh feature_list.json progress.md \
  session-handoff.md docs
git commit -m "feat: complete harness doctor skill"
```

### Task 6: Final Doctor Audit

**Files:**
- Verify only

- [ ] **Step 1: Prove renderer purity and scope exclusions**

Run:

```bash
rg -n "inspectHarness|node:fs|writeFile|copyFile|mkdir|rm\\(|fetch\\(" \
  skills/harness-doctor/scripts/renderers.mjs
rg -n "writeFile|copyFile|mkdir|rm\\(|fetch\\(|child_process" \
  skills/harness-doctor/scripts
```

Expected: no renderer inspection/filesystem imports and no Doctor
write/network/target-command implementation.

- [ ] **Step 2: Prove one canonical assessment**

Compare direct shared-core JSON with Doctor JSON using `cmp`. Run Text,
Markdown, and HTML against the same fixture and assert every canonical level,
label, bottleneck, and Effectiveness status appears.

- [ ] **Step 3: Re-run required verification**

Run:

```bash
node --test packages/harness-core/test/*.test.mjs \
  tests/harness-doctor/*.test.mjs
./init.sh
git status --short
git log --oneline -8
```

Expected: all tests and initialization pass; worktree is clean; history shows
contracts, skill, renderers, command, integration, and verification.
