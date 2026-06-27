# Template Boundary Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the accepted contract-first asset boundary, close `feat-005`, and create a complete feature path toward the shared core, doctor, creator, and field validation.

**Architecture:** Keep the detailed reusable boundary in a workflow reference and the irreversible product choice in a short ADR. Update lifecycle state so exactly one next feature points to the first shared-core implementation slice.

**Tech Stack:** Markdown, JSON lifecycle state, shell validation, repository `init.sh`.

---

### Task 1: Publish The Product Boundary

**Files:**
- Create: `docs/workflows/harness-product-boundaries.md`
- Modify: `docs/workflows/index.md`

- [x] **Step 1: Create the durable workflow reference**

Write `docs/workflows/harness-product-boundaries.md` with these sections:

```text
Purpose
Boundary Principles
Asset Classification
Shared Contracts
Creator Boundary
Doctor Boundary
Project-Owned Facts
Safety
Verification
Implementation Sequence
```

The asset matrix must classify every existing `harness-creator` template and
script as shared core, creator-only, doctor-only, evidence input, excluded, or
project-owned.

The `Shared Contracts` section must include:

```text
Context contract:
  Mission, Scope/Non-goals, Canonical language, boundaries, evidence status,
  restart assumptions; missing context creates a conditional bootstrap task.

Feature-state contract:
  id, name, behavior, dependencies, status, verification, evidence;
  exactly one next/in-progress item in serial mode; done requires evidence.

Progress and handoff:
  progress is the default state surface; handoff is conditional on complexity.

Initialization:
  check-first, idempotent, no default network/install/write side effects.

Diagnostic contract:
  Instructions, Tools, Environment, State, Feedback maturity from 0 Missing
  through 3 Evidenced; Readiness and Effectiveness remain separate.
```

The `Verification` section must require both:

```text
Contract fixtures:
  empty, instructions-only, no executable verification, operational minimal,
  non-standard equivalent filenames, and overwrite-conflict repositories.

Field experiments:
  verified completion rate, completion time, correction loops, session count,
  and restart cost.
```

- [x] **Step 2: Add the workflow index entry**

Add this entry to `docs/workflows/index.md`:

```markdown
- [`harness-product-boundaries.md`](harness-product-boundaries.md)：未来
  creator/doctor 的 shared core、产品专属能力和项目事实边界。
```

- [x] **Step 3: Verify the reference structure**

Run:

```bash
for heading in "Purpose" "Asset Classification" "Shared Contracts" \
  "Creator Boundary" "Doctor Boundary" "Project-Owned Facts" \
  "Implementation Sequence"; do
  rg -q "^## $heading$" docs/workflows/harness-product-boundaries.md || exit 1
done
```

Expected: exit status 0.

### Task 2: Record The Architectural Decision

**Files:**
- Create: `docs/adr/0002-adopt-contract-first-harness-core.md`
- Modify: `docs/adr/index.md`

- [x] **Step 1: Create ADR 0002**

The ADR must record:

```text
Status: Accepted
Decision: contract-first shared core with creator and doctor as thin entrypoints
Rejected: template-first fork
Rejected: doctor-first independent implementation
Consequences: shared schemas and fixtures precede product entrypoints
```

- [x] **Step 2: Add the ADR index entry**

Add:

```markdown
- [`0002-adopt-contract-first-harness-core.md`](0002-adopt-contract-first-harness-core.md)
```

- [x] **Step 3: Verify decision language**

Run:

```bash
rg -q '^Status: Accepted$' docs/adr/0002-adopt-contract-first-harness-core.md
rg -q 'contract-first' docs/adr/0002-adopt-contract-first-harness-core.md
rg -q 'template-first' docs/adr/0002-adopt-contract-first-harness-core.md
```

Expected: all commands exit 0.

### Task 3: Establish The Product Roadmap

**Files:**
- Modify: `feature_list.json`

- [x] **Step 1: Complete feat-005**

Set `feat-005.status` to `done` and record evidence referencing:

```text
docs/workflows/harness-product-boundaries.md
docs/adr/0002-adopt-contract-first-harness-core.md
./init.sh
```

- [x] **Step 2: Add the remaining product features**

Append:

```json
{
  "id": "feat-008",
  "name": "Shared Harness Contract Core",
  "description": "Implement canonical schemas, capability rules, deterministic readiness inspection, and fixture contract tests.",
  "dependencies": ["feat-005"],
  "status": "next",
  "evidence": ""
},
{
  "id": "feat-009",
  "name": "Harness Doctor Skill",
  "description": "Build the read-only doctor entrypoint over the shared core with canonical JSON and human-readable reports.",
  "dependencies": ["feat-008"],
  "status": "not-started",
  "evidence": ""
},
{
  "id": "feat-010",
  "name": "Harness Creator Skill",
  "description": "Build the non-destructive creator entrypoint with conditional context restoration and check-first initialization.",
  "dependencies": ["feat-008", "feat-009"],
  "status": "not-started",
  "evidence": ""
},
{
  "id": "feat-011",
  "name": "Harness Product Integration",
  "description": "Validate creator-to-doctor workflows across supported fixtures and non-standard project shapes.",
  "dependencies": ["feat-009", "feat-010"],
  "status": "not-started",
  "evidence": ""
},
{
  "id": "feat-012",
  "name": "Harness Field Validation",
  "description": "Run representative before-and-after coding-agent tasks and evaluate effectiveness without conflating it with readiness.",
  "dependencies": ["feat-011"],
  "status": "not-started",
  "evidence": ""
}
```

- [x] **Step 3: Verify roadmap invariants**

Run:

```bash
node - <<'NODE'
const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));
const ids = new Set(data.features.map((feature) => feature.id));
for (const id of ['feat-008', 'feat-009', 'feat-010', 'feat-011', 'feat-012']) {
  if (!ids.has(id)) process.exit(1);
}
const active = data.features.filter((feature) =>
  ['next', 'in-progress'].includes(feature.status)
);
if (active.length !== 1 || active[0].id !== 'feat-008') process.exit(1);
for (const feature of data.features) {
  for (const dependency of feature.dependencies || []) {
    if (!ids.has(dependency)) process.exit(1);
  }
}
NODE
```

Expected: exit status 0.

### Task 4: Record The Stage Outcome

**Files:**
- Create: `docs/evolution/0005-template-boundary-review.md`
- Modify: `docs/evolution/index.md`
- Modify: `progress.md`
- Modify: `session-handoff.md`

- [x] **Step 1: Add evolution record 0005**

Record:

```text
Goal
Starting State
Method
Decisions
Asset Boundary
Evidence
Reusable Conclusion
Next Step: feat-008
```

- [x] **Step 2: Update the evolution index**

Add an entry linking to `0005-template-boundary-review.md`.

- [x] **Step 3: Update progress**

Set:

```text
Active Feature: feat-008 - Shared Harness Contract Core
Status: feat-005 complete; feat-008 next
```

Record the workflow reference, ADR, roadmap, verification, and remaining risk
that no shared-core runtime exists yet.

- [x] **Step 4: Update handoff**

Set the current objective to implementing `feat-008`. Record the accepted
contract-first boundary, verification evidence, changed files, and the exact
next-session startup path.

### Task 5: Verify And Commit

**Files:**
- Test: all files changed by Tasks 1-4

- [x] **Step 1: Check formatting and JSON**

Run:

```bash
git diff --check
node -e 'JSON.parse(require("fs").readFileSync("feature_list.json", "utf8"))'
```

Expected: no output and exit status 0.

- [x] **Step 2: Run repository verification**

Run:

```bash
./init.sh
```

Expected: `=== Verification Complete ===`.

- [x] **Step 3: Check planned scope**

Run:

```bash
git status --short
```

Expected: only the boundary reference, ADR, lifecycle files, evolution record,
and this implementation plan are changed or added.

- [x] **Step 4: Commit the completed feature**

Run:

```bash
git add docs/workflows/harness-product-boundaries.md \
  docs/workflows/index.md \
  docs/adr/0002-adopt-contract-first-harness-core.md \
  docs/adr/index.md \
  docs/evolution/0005-template-boundary-review.md \
  docs/evolution/index.md \
  docs/superpowers/plans/2026-06-27-template-boundary-review.md \
  feature_list.json progress.md session-handoff.md
git commit -m "docs: define harness product boundaries"
```

Expected: one commit containing the completed `feat-005` outcome.
