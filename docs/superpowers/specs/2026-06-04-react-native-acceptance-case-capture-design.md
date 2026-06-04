# React Native Acceptance Case Capture Design

Date: 2026-06-04
Status: Draft for user review
Methodology: superpowers:brainstorming

## Context

This repository already distinguishes between deterministic verification and
user-facing path verification. It also already treats mobile and runtime-
sensitive work as requiring stronger evidence than pure logic or prose changes.

What is missing is a standard pre-test gate for React Native work:

- after an implementation draft exists
- before unit or integration tests are written
- ask the user targeted acceptance questions
- write the answers into the task's spec/design document
- use those acceptance cases to drive both automated coverage and manual
  one-to-one validation

The goal is to stop tests from being inferred only from the implementation.
Instead, tests should be derived from explicit user acceptance cases recorded in
the spec.

## Goal

Introduce a reusable React Native acceptance-case capture workflow that:

- applies to all React Native projects using this repository's methodology
- triggers after implementation draft and before unit/integration test writing
- runs as a user Q&A loop led by the agent
- writes answers back into the current task spec/design document
- allows incomplete answers without blocking progress, but records them
  explicitly
- provides a reusable questionnaire and workflow surface that future projects
  can inherit from the template

## Non-Goals

- Do not introduce a hard blocker that prevents further implementation when the
  user does not answer every question.
- Do not require a separate acceptance-case document for each task.
- Do not replace run records; run records still capture what was actually
  verified after implementation.
- Do not generalize this first pass to all mobile stacks. The standard applies
  to React Native first.
- Do not force every case onto a real device. The workflow should record when a
  real device is required, not assume it blindly.

## Confirmed Product Decisions

The user confirmed these design choices during brainstorming:

- Scope: all React Native projects should use this gate.
- Authority surface for case content: the task's spec/design document is the
  source of truth.
- Timing: the gate runs after an implementation draft exists and before unit or
  integration tests are written.
- Data entry model: the agent asks questions in chat and writes the answers back
  into the spec automatically.
- Missing-answer policy: the process is required, but incomplete answers do not
  block progress. Missing items must be explicitly marked.
- Integration shape: use a workflow doc, a checklist doc, template copies, and
  a short runtime rule in `AGENTS.md`.

## Recommended Approach

Adopt a four-surface design:

1. `AGENTS.md` adds a short trigger rule.
2. `docs/workflows/react-native-acceptance-case-capture.md` defines the process.
3. `evals/checklists/react-native-acceptance-case-questionnaire.md` defines the
   reusable question set.
4. The active task spec/design document stores the actual acceptance cases for
   that task.

This keeps runtime enforcement short while preserving detailed execution logic
and reusable prompts in narrower documents.

## Workflow Placement

The workflow should become:

```text
task/spec ready
-> implementation draft complete
-> React Native acceptance Q&A gate
-> spec updated with acceptance cases
-> unit/integration test writing
-> broader verification
-> run record / final report
```

The important boundary is:

- this gate does not replace implementation planning
- this gate does not replace final verification
- this gate exists to define what tests and one-to-one acceptance should prove
  before those tests are written

## Spec Update Contract

For React Native tasks, the active spec/design doc should gain a fixed section:

```md
## React Native Acceptance Cases
```

Each case should use a structured entry:

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

This section is the authority for task-level acceptance intent.

Run records remain the authority for what was actually verified.

## Q&A Execution Model

The agent should not ask an unstructured dump of questions. It should execute a
repeatable loop:

1. Inspect the current implementation draft and active spec.
2. Propose an initial acceptance-case list (`AC-01`, `AC-02`, etc.).
3. Ask the user one case-focused question at a time.
4. After each answer, write or refine the matching acceptance-case entry in the
   spec.
5. Continue until the important user paths have explicit case entries.
6. Mark unanswered or uncertain fields explicitly instead of silently skipping
   them.

The agent's questions should move in this order:

1. Which user actions or flows changed?
2. What must the user observe for each flow to count as success?
3. Which platforms matter: iOS, Android, or both?
4. Does this flow require simulator/emulator only, or real-device validation?
5. Which parts should be covered by deterministic tests?
6. What evidence should count for manual acceptance?

## Missing Answer Policy

The gate is mandatory, but full completeness is not.

If the user does not provide every answer:

- the Q&A step is still considered executed
- the spec must record missing fields as `Not specified yet` or
  `User confirmation pending`
- test writing may continue
- the final run record and final report must surface the gaps

This keeps momentum while preventing silent assumption drift.

## Document Responsibilities

### `AGENTS.md`

Purpose: runtime trigger only.

Recommended rule:

```md
- For React Native tasks, after an implementation draft exists and before writing unit or integration tests, run a user Q&A acceptance-case capture step and write the answers into the task spec/design doc. If some answers are unavailable, mark them explicitly instead of silently skipping them.
```

### `docs/workflows/react-native-acceptance-case-capture.md`

Purpose: define the full process.

It should cover:

- scope
- trigger condition
- step sequence
- spec writeback behavior
- incomplete-answer handling
- relationship to tests, run records, and final verification

### `evals/checklists/react-native-acceptance-case-questionnaire.md`

Purpose: define the reusable question set.

It should include at least:

- case discovery questions
- platform and environment questions
- deterministic-test-routing questions
- manual-evidence questions
- explicit prompts for real-device necessity

### Template Copies

The template should inherit both the workflow and the checklist so new projects
start with the same process shape.

## Testing And Verification Implications

Once the acceptance cases are written into the spec:

- unit/integration tests should be derived from the deterministic parts of
  those cases
- real-device or simulator validation should be derived from the manual
  acceptance fields
- run records should report which acceptance cases were actually verified and
  which remained partially specified or partially validated

This preserves the current harness principle:

```text
acceptance intent in spec -> deterministic coverage in tests ->
user-path evidence in verification -> actual proof in run record
```

## Failure Modes To Prevent

This design is intended to prevent these recurring mistakes:

- tests are written from the implementation only, not from user acceptance
- real-device needs are discovered late
- simulator coverage is misreported as full user-path acceptance
- missing user decisions remain only in chat and never reach durable docs
- manual verification expectations are not visible until final QA

## Planned Artifacts

This design should produce:

- updates to root `AGENTS.md`
- `docs/workflows/react-native-acceptance-case-capture.md`
- `evals/checklists/react-native-acceptance-case-questionnaire.md`
- mirrored template files under `templates/agent-first-living-lab/`
- index updates where needed so the new workflow and checklist are discoverable

## Open Questions

- Should a later phase add a React Native run-record example showing how
  acceptance-case IDs map to actual verification evidence?
- Should the questionnaire later branch by risk type, for example permissions,
  offline flows, deep links, or performance-sensitive interactions?
- Should this workflow later expand from React Native to Expo and hybrid mobile
  shells, or remain React Native-specific until separate validation exists?
