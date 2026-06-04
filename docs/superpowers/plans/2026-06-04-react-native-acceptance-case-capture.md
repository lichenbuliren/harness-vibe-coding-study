# React Native Acceptance Case Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable React Native acceptance-case capture gate so agents ask the user targeted acceptance questions after an implementation draft exists, write the answers into the task spec, and use those cases to guide later tests and manual verification.

**Architecture:** Keep the runtime trigger in `AGENTS.md`, keep the procedural detail in a workflow doc, keep the reusable questions in an eval checklist, and mirror the same surfaces into `templates/agent-first-living-lab/`. Record the methodology change in `CONTEXT.md` and `docs/evolution/` so the gate is durable and discoverable.

**Tech Stack:** Markdown documentation, existing repo indexes, git verification commands.

---

## File Structure

- Modify `AGENTS.md`: add one short React Native trigger rule to the operating rules.
- Create `docs/workflows/react-native-acceptance-case-capture.md`: define the gate, sequence, spec writeback, and missing-answer policy.
- Modify `docs/workflows/index.md`: list the new workflow.
- Create `evals/checklists/react-native-acceptance-case-questionnaire.md`: define the reusable Q&A prompts and review checklist.
- Modify `evals/checklists/index.md`: list the new checklist.
- Modify `templates/agent-first-living-lab/AGENTS.md`: mirror the short runtime trigger.
- Create `templates/agent-first-living-lab/docs/workflows/react-native-acceptance-case-capture.md`: mirror the workflow for new projects.
- Modify `templates/agent-first-living-lab/docs/workflows/index.md`: list the mirrored workflow.
- Create `templates/agent-first-living-lab/evals/checklists/react-native-acceptance-case-questionnaire.md`: mirror the checklist.
- Modify `templates/agent-first-living-lab/evals/checklists/index.md`: list the mirrored checklist.
- Modify `CONTEXT.md`: add the new workflow/checklist/gate to current artifacts or current methodology state.
- Create `docs/evolution/0042-react-native-acceptance-case-capture.md`: record the stage-level methodology decision and artifacts.
- Modify `docs/evolution/index.md`: add the new evolution entry and ensure the latest entries remain discoverable.

---

### Task 1: Add The Runtime Trigger And Root Discovery Surfaces

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/workflows/index.md`
- Modify: `evals/checklists/index.md`

- [ ] **Step 1: Add the React Native trigger rule to `AGENTS.md`**

Insert one operating rule near the existing process and verification rules:

```md
- For React Native tasks, after an implementation draft exists and before writing unit or integration tests, run a user Q&A acceptance-case capture step and write the answers into the task spec/design doc. If some answers are unavailable, mark them explicitly instead of silently skipping them.
```

- [ ] **Step 2: Add the workflow to `docs/workflows/index.md`**

Append a bilingual index entry:

```md
- `react-native-acceptance-case-capture.md`：为 React Native 任务定义“实现草稿之后、单测之前”的问答式验收 case 补全流程。
  Defines the post-draft, pre-test Q&A workflow for capturing React Native acceptance cases into the task spec.
```

- [ ] **Step 3: Add the checklist to `evals/checklists/index.md`**

Append a bilingual index entry:

```md
- `react-native-acceptance-case-questionnaire.md`：为 React Native 任务提供问答式验收 case 采集问题集和完成检查项。
  Provides the reusable Q&A prompts and completion checks for React Native acceptance-case capture.
```

- [ ] **Step 4: Verify the new entries are discoverable**

Run:

```bash
rg -n "React Native|acceptance-case capture|acceptance-case-questionnaire" AGENTS.md docs/workflows/index.md evals/checklists/index.md
```

Expected: all three files contain the new React Native gate or index entries.

### Task 2: Write The Root Workflow And Questionnaire Docs

**Files:**
- Create: `docs/workflows/react-native-acceptance-case-capture.md`
- Create: `evals/checklists/react-native-acceptance-case-questionnaire.md`

- [ ] **Step 1: Write the workflow doc**

Create `docs/workflows/react-native-acceptance-case-capture.md` with these sections and core content:

```md
# React Native Acceptance Case Capture

Use this workflow for React Native tasks after an implementation draft exists
and before unit or integration tests are written.

## Purpose

- capture user acceptance intent before tests are inferred from implementation
- distinguish deterministic coverage from real-device or manual acceptance
- write durable acceptance cases into the active spec/design doc

## Trigger

Run this workflow when:

- the task is in a React Native project
- the implementation draft exists
- the agent is about to write unit or integration tests

## Output

The active task spec/design doc gains:

```md
## React Native Acceptance Cases
```

Each case should follow:

```md
### AC-01 Case title

- User path:
- Trigger / action:
- Expected result:
- Platform: iOS / Android / Both
- Environment: Simulator / Emulator / Real device / Any
- Risk type: UI / Permission / Deep link / Native API / Network / Offline / Performance / Other
- Must verify on real device: Yes / No / Not specified yet
- Deterministic test expected: Yes / No / Partial
- Suggested automated coverage:
- Manual acceptance evidence:
- Notes / open questions:
```

## Sequence

1. Inspect the implementation draft and active spec.
2. Propose the initial acceptance-case list.
3. Ask the user one case-focused question at a time.
4. Write each answer back into the matching case entry.
5. Mark missing information explicitly.
6. Start test writing only after the spec contains the captured cases.

## Missing Answers

- do not silently assume missing details
- record `Not specified yet` or `User confirmation pending`
- continue with test writing when the task must proceed, but surface gaps in
  later verification and reporting

## Relationship To Later Steps

- deterministic parts feed unit/integration tests
- manual-evidence fields feed simulator or real-device acceptance
- run records report what was actually verified
```

- [ ] **Step 2: Write the questionnaire checklist**

Create `evals/checklists/react-native-acceptance-case-questionnaire.md` with concrete prompts:

```md
# React Native Acceptance Case Questionnaire

Use this checklist after an implementation draft exists and before unit or
integration tests are written for a React Native task.

## Case Discovery

- List each changed user flow as a separate acceptance case.
- Ask: what action starts this case?
- Ask: what must the user see for this case to count as successful?

## Platform And Environment

- Ask whether the case matters on iOS, Android, or both.
- Ask whether simulator/emulator is sufficient or a real device is required.
- Ask whether the case depends on native permissions, OS integrations, deep
  links, offline behavior, gestures, keyboard handling, file access, camera,
  notifications, or performance-sensitive rendering.

## Deterministic Coverage

- Ask which part of the case should be covered by unit or integration tests.
- Ask which assertions can be made without a physical device.
- Mark `Partial` when only part of the case can be automated.

## Manual Acceptance Evidence

- Ask what evidence should count as acceptance:
  - screenshot
  - screen recording
  - device/OS note
  - observed result after a precise action sequence
  - log or native error observation

## Completion Check

- The active spec/design doc contains `## React Native Acceptance Cases`.
- Each important flow has an `AC-*` entry.
- Missing information is explicit, not implied.
- The agent can explain which later tests map to which deterministic fields.
- The agent can explain which later verification maps to which manual fields.
```

- [ ] **Step 3: Verify the new docs contain the required structure**

Run:

```bash
rg -n "^# React Native Acceptance Case|^## React Native Acceptance Cases|^## Sequence|^## Missing Answers|^## Completion Check|AC-01 Case title" docs/workflows/react-native-acceptance-case-capture.md evals/checklists/react-native-acceptance-case-questionnaire.md
```

Expected: all named sections and the acceptance-case shape are present.

### Task 3: Mirror The Gate Into The Template

**Files:**
- Modify: `templates/agent-first-living-lab/AGENTS.md`
- Create: `templates/agent-first-living-lab/docs/workflows/react-native-acceptance-case-capture.md`
- Modify: `templates/agent-first-living-lab/docs/workflows/index.md`
- Create: `templates/agent-first-living-lab/evals/checklists/react-native-acceptance-case-questionnaire.md`
- Modify: `templates/agent-first-living-lab/evals/checklists/index.md`

- [ ] **Step 1: Mirror the AGENTS rule**

Add the same short rule to `templates/agent-first-living-lab/AGENTS.md`:

```md
- For React Native tasks, after an implementation draft exists and before writing unit or integration tests, run a user Q&A acceptance-case capture step and write the answers into the task spec/design doc. If some answers are unavailable, mark them explicitly instead of silently skipping them.
```

- [ ] **Step 2: Mirror the workflow doc**

Copy the root workflow doc into:

```text
templates/agent-first-living-lab/docs/workflows/react-native-acceptance-case-capture.md
```

Preserve the same process and acceptance-case structure unless the template
needs wording adjusted from "this repository" to "this project".

- [ ] **Step 3: Mirror the checklist doc**

Copy the root checklist doc into:

```text
templates/agent-first-living-lab/evals/checklists/react-native-acceptance-case-questionnaire.md
```

Preserve the same question order and completion checks.

- [ ] **Step 4: Update template indexes**

Add these entries:

```md
- `react-native-acceptance-case-capture.md`：为 React Native 任务定义“实现草稿之后、单测之前”的问答式验收 case 补全流程。
  Defines the post-draft, pre-test Q&A workflow for capturing React Native acceptance cases into the task spec.
```

```md
- `react-native-acceptance-case-questionnaire.md`：为 React Native 任务提供问答式验收 case 采集问题集和完成检查项。
  Provides the reusable Q&A prompts and completion checks for React Native acceptance-case capture.
```

- [ ] **Step 5: Verify template discoverability**

Run:

```bash
rg -n "React Native|acceptance-case capture|acceptance-case-questionnaire" templates/agent-first-living-lab/AGENTS.md templates/agent-first-living-lab/docs/workflows/index.md templates/agent-first-living-lab/evals/checklists/index.md templates/agent-first-living-lab/docs/workflows/react-native-acceptance-case-capture.md templates/agent-first-living-lab/evals/checklists/react-native-acceptance-case-questionnaire.md
```

Expected: the mirrored runtime rule, workflow, checklist, and index entries are all present.

### Task 4: Record The Methodology Change In Context And Evolution

**Files:**
- Modify: `CONTEXT.md`
- Create: `docs/evolution/0042-react-native-acceptance-case-capture.md`
- Modify: `docs/evolution/index.md`

- [ ] **Step 1: Update `CONTEXT.md` current artifacts**

Add concise artifact bullets describing:

```md
- `docs/workflows/react-native-acceptance-case-capture.md`: workflow for user Q&A acceptance-case capture after React Native implementation drafts and before test writing.
- `evals/checklists/react-native-acceptance-case-questionnaire.md`: reusable prompt set and completion gate for React Native acceptance-case capture.
```

- [ ] **Step 2: Write the evolution entry**

Create `docs/evolution/0042-react-native-acceptance-case-capture.md` with these sections:

```md
# 0042 - React Native Acceptance Case Capture

## Stage

Post-Phase 3C methodology hardening.

## Goal

Close the gap between implementation-first behavior and acceptance-first test design for React Native tasks.

## Method

- wrote and approved a design spec
- added a runtime trigger
- added a workflow doc
- added a reusable questionnaire checklist
- mirrored the same surfaces into the template

## Outcome / Decision

React Native tasks now use a required post-draft, pre-test Q&A gate that writes acceptance cases into the task spec/design doc. Missing answers do not block progress, but they must be recorded explicitly.

## Artifacts

- `AGENTS.md`
- `docs/workflows/react-native-acceptance-case-capture.md`
- `evals/checklists/react-native-acceptance-case-questionnaire.md`
- template mirror files
- `CONTEXT.md`

## Shareable Takeaway

When tests are written only from the implementation, React Native acceptance intent drifts into chat and late QA. A lightweight Q&A gate preserves momentum while making user-path expectations durable before test writing begins.

## Open Questions

- whether later phases need a matching run-record example
- whether the questionnaire should branch by risk type
```

- [ ] **Step 3: Update `docs/evolution/index.md`**

Ensure the index contains these latest entries in chronological order:

```md
- `0039-harness-primitives-verification-assessment.md`
- `0040-harness-session-lifecycle-tools-multiagent.md`
- `0041-harness-adapters-success-patterns-adoption-playbook.md`
- `0042-react-native-acceptance-case-capture.md`
```

- [ ] **Step 4: Verify context and evolution references**

Run:

```bash
rg -n "react-native-acceptance-case-capture|react-native-acceptance-case-questionnaire|0042-react-native-acceptance-case-capture" CONTEXT.md docs/evolution/index.md docs/evolution/0042-react-native-acceptance-case-capture.md
```

Expected: the new workflow, checklist, and evolution entry are all referenced.

### Task 5: Final Verification And Commit

**Files:**
- All modified documentation surfaces

- [ ] **Step 1: Run placeholder and structure checks**

Run:

```bash
rg -n "TODO|TBD|FIXME|Not specified yet|User confirmation pending" AGENTS.md CONTEXT.md docs/workflows evals docs/evolution templates/agent-first-living-lab 2>/dev/null
```

Expected: only intentional mentions remain inside the new workflow/checklist guidance, not accidental placeholders.

- [ ] **Step 2: Run root structure verification**

Run:

```bash
find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort
```

Expected: new workflow/checklist/evolution files exist in both root and template surfaces and no forbidden first-stage directories were created.

- [ ] **Step 3: Check git status before commit**

Run:

```bash
git status --short
```

Expected: only the intended docs and template files are modified or created.

- [ ] **Step 4: Commit the implementation**

```bash
git add AGENTS.md CONTEXT.md docs/workflows/index.md docs/workflows/react-native-acceptance-case-capture.md evals/checklists/index.md evals/checklists/react-native-acceptance-case-questionnaire.md docs/evolution/index.md docs/evolution/0042-react-native-acceptance-case-capture.md templates/agent-first-living-lab/AGENTS.md templates/agent-first-living-lab/docs/workflows/index.md templates/agent-first-living-lab/docs/workflows/react-native-acceptance-case-capture.md templates/agent-first-living-lab/evals/checklists/index.md templates/agent-first-living-lab/evals/checklists/react-native-acceptance-case-questionnaire.md
git commit -m "Standardize React Native acceptance-case capture before test writing" \
  -m "React Native tasks need a durable acceptance-intent gate between implementation draft and test authoring so agents stop inferring all tests from code alone." \
  -m "Constraint: Missing user answers must remain explicit but must not block progress entirely" \
  -m "Rejected: Separate acceptance-case file per task | duplicates the spec as authority and weakens discoverability" \
  -m "Confidence: high" \
  -m "Scope-risk: moderate" \
  -m "Directive: Keep task-level acceptance content in the active spec/design doc and keep reusable prompts in eval checklists" \
  -m "Tested: Discoverability grep, structure check, git status review" \
  -m "Not-tested: No live React Native repo was available to exercise the gate end-to-end in this documentation-only change"
```

- [ ] **Step 5: Confirm clean state after commit**

Run:

```bash
git status --short && git log --oneline -n 1
```

Expected: clean worktree and the new commit at `HEAD`.
