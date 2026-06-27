# Harness Creator Skill Implementation Plan

**Goal:** Implement a plan-bound, non-destructive `harness-creator` skill that
creates a minimal canonical harness and defaults missing project context to a
real restoration feature.

**Architecture:** A pure template layer renders project-agnostic artifacts. A
planner calls shared-core inspection, reads only bounded safe paths, and emits
a deterministic plan whose ID binds exact preconditions and intended content.
An applier re-plans, validates the ID and every action, then performs exclusive
creates or one validated feature-state merge. A thin CLI exposes Text and JSON.

**Tech Stack:** Node.js ESM, Node built-ins, `node:test`, shared harness core,
Codex skill metadata, offline `uv` validation

---

## Task 1: Lock Skill And Public-Core Contracts

**Files:**
- Modify: `packages/harness-core/src/index.mjs`
- Modify: `packages/harness-core/test/contracts.test.mjs`
- Create: `tests/harness-creator/skill-contract.test.mjs`
- Create: `skills/harness-creator/SKILL.md`
- Create: `skills/harness-creator/agents/openai.yaml`

- [x] Write RED tests for public path-safety exports and the minimal skill.
- [x] Scaffold with official `init_skill.py`.
- [x] Export existing path-safety functions without changing their behavior.
- [x] Write a concise workflow: plan, present, apply by plan ID, run Doctor,
  never invent context facts.
- [x] Pass core contracts, skill contracts, and official quick validation.
- [x] Commit `feat: define harness creator contracts`.

## Task 2: Render Minimal Project-Agnostic Artifacts

**Files:**
- Create: `skills/harness-creator/scripts/templates.mjs`
- Create: `tests/harness-creator/templates.test.mjs`

- [x] Write RED tests for AGENTS/CLAUDE guidance, canonical feature state,
  progress, optional handoff, check-first init, and manifest output.
- [x] Render deterministic ASCII content with final newlines.
- [x] Ensure `init.sh` contains no install, network, setup, service, or
  repository-write commands.
- [x] Make `Project Context Restoration` the sole next feature in a new
  feature list.
- [x] Pass template tests and canonical feature validation.
- [x] Commit `feat: render minimal harness artifacts`.

## Task 3: Build Deterministic Plans And Context Merge

**Files:**
- Create: `skills/harness-creator/scripts/planner.mjs`
- Create: `tests/harness-creator/planner.test.mjs`
- Create: `tests/harness-creator/fixtures/`

- [ ] Write RED fixture tests for empty, partial, operational, malformed,
  conflict, and non-standard targets.
- [ ] Discover stack and verification commands without executing them.
- [ ] Call `inspectHarness()` once per plan.
- [ ] Emit stable create/merge/skip/block actions with exact preconditions,
  intended content, and SHA-256 `planId`.
- [ ] Merge the context restoration feature only into valid canonical feature
  state; preserve existing feature values and serial active-count invariants.
- [ ] Prove planning causes zero target writes and leaks no host paths.
- [ ] Commit `feat: plan non-destructive harness changes`.

## Task 4: Apply Accepted Plans Atomically

**Files:**
- Create: `skills/harness-creator/scripts/apply.mjs`
- Create: `tests/harness-creator/apply.test.mjs`

- [ ] Write RED tests for stale IDs, blocked plans, changed preconditions,
  exclusive creates, semantic merge, partial-write prevention, and repeat
  stability.
- [ ] Re-plan and require an exact current `planId`.
- [ ] Preflight every action before writing.
- [ ] Use exclusive file creation and validated feature-state replacement.
- [ ] Return created/merged/skipped/blocked results plus `assessmentAfter`.
- [ ] Prove no overwrite, delete, install, network, or target command execution.
- [ ] Commit `feat: apply accepted harness plans`.

## Task 5: Add The Creator Command

**Files:**
- Create: `skills/harness-creator/scripts/creator.mjs`
- Create: `skills/harness-creator/scripts/renderers.mjs`
- Create: `tests/harness-creator/creator.test.mjs`

- [ ] Write RED CLI tests for help, plan/apply, Text/JSON, pretty validation,
  error codes, deterministic output, and no host paths.
- [ ] Parse only the documented command surface.
- [ ] Keep plan read-only and require `--plan-id` for apply.
- [ ] Render complete actions, context bootstrap, risks, results, and
  before/after readiness without rescoring.
- [ ] Pass Creator, Doctor, and shared-core suites.
- [ ] Commit `feat: add harness creator command`.

## Task 6: Integrate And Complete The Feature

**Files:**
- Modify: `.harness/manifest.json`
- Modify: `init.sh`
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`
- Modify: `docs/index.md`
- Modify: `docs/evolution/index.md`
- Create: `docs/evolution/0008-harness-creator-skill.md`

- [ ] Declare Creator as a tool, not Effectiveness evidence.
- [ ] Add Creator tests and official skill validation to `./init.sh`.
- [ ] Run all core, Doctor, and Creator tests.
- [ ] Run an empty-fixture plan/apply/Doctor smoke workflow.
- [ ] Prove repeat planning stability, no forbidden operations, and clean diff.
- [ ] Set `feat-010` done with structured evidence; set only `feat-011` next.
- [ ] Record design decisions, before/after profile, evidence, and remaining
  integration/field risks.
- [ ] Commit `feat: complete harness creator skill`.

## Final Verification

```bash
node --test packages/harness-core/test/*.test.mjs \
  tests/harness-doctor/*.test.mjs \
  tests/harness-creator/*.test.mjs
uv run --offline --with pyyaml python \
  /Users/heaven/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  skills/harness-creator
./init.sh
git diff --check
```
