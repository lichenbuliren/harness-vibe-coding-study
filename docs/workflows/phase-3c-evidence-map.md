# Phase 3C Evidence Map

This map is the first Phase 3C working artifact.

Its purpose is to keep pattern extraction evidence-based. The project should
not decide what becomes a template, skill, playbook, pattern, or local standard
until it can point to the Phase 3B evidence that survived real work.

## Mainline

```text
study -> define evidence -> validate in lab -> extract reusable patterns
```

Current position:

- Phase 2 completed the harness engineering study and Chinese synthesis.
- Phase 3A defined the evidence contract for local validation.
- Phase 3B validated that contract through `lab/dinner-picker` and live
  user-feedback loops.
- Phase 3C now reviews the evidence and decides what is reusable.

## Evidence Categories

### Lab App Artifacts

- `lab/dinner-picker/`: mobile-first React + TypeScript app used as the first
  real validation surface.
- `lab/README.md`: names the lab as the container for real validation projects.
- `lab/AGENTS.md`: lab-specific verification rules for tests, build, lint,
  mobile viewport checks, LAN URL checks, and secure-context notes.
- `lab/dinner-picker/README.md`: app-level entry point for the Dinner Picker
  implementation.
- `lab/dinner-picker/package.json`: React + TypeScript + Vite app with Vitest,
  ESLint, Tailwind CSS, Testing Library, and lucide-react.
- `lab/dinner-picker/src/App.tsx`: primary UI and interaction surface.
- `lab/dinner-picker/src/App.test.tsx`: app-level interaction tests.
- `lab/dinner-picker/src/lib/dishes.ts`: dish creation, preference, and
  recommendation helpers.
- `lab/dinner-picker/src/lib/dishes.test.ts`: deterministic domain tests.
- `lab/dinner-picker/src/lib/storage.ts`: localStorage persistence surface.

Evidence value: the methodology touched real UI, state, persistence, browser
runtime behavior, tests, and mobile interaction rather than only documents.

### Specs And Plans

- `docs/superpowers/specs/2026-05-30-dinner-picker-lab-design.md`: MVP design
  spec for the first lab project.
- `docs/superpowers/plans/2026-05-30-dinner-picker-lab-mvp.md`: MVP
  implementation plan.
- `docs/superpowers/specs/2026-05-31-dinner-picker-feedback-redraw-design.md`:
  design spec for `想吃` / `不想吃`, automatic redraw, and weighted feedback.
- `docs/superpowers/plans/2026-05-31-dinner-picker-feedback-redraw.md`:
  implementation plan for the feedback-driven recommendation loop.

Evidence value: meaningful lab work was preceded by explicit design and task
planning, which made later verification and evolution logging easier.

Gap: no clear specs or plans were found for the intermediate add-button
feedback and input responsiveness fixes; those are captured mainly through run
records and checklists.

### Run Records

- `harness/runs/2026-05-31-dinner-picker-mvp.md`: first full lab run, including
  tests, build, lint, and 390x844 mobile browser smoke verification.
- `harness/runs/2026-05-31-dinner-picker-mobile-add-bug.md`: phone/LAN bug
  reproduction and fix; showed that localhost mobile viewport is not the same
  as the user's phone-accessible LAN URL.
- `harness/runs/2026-05-31-dinner-picker-add-button-feedback.md`: add-button
  state-feedback improvement; turned disabled/ready UI state into tested
  behavior.
- `harness/runs/2026-05-31-dinner-picker-input-responsiveness.md`: input
  responsiveness optimization; promoted mobile performance into an engineering
  checklist.
- `harness/runs/2026-05-31-dinner-picker-feedback-redraw.md`: feedback-driven
  recommendation loop; includes tests, browser verification, LAN URL, and
  mobile viewport evidence.

Evidence value: run records made local work recoverable and turned task
execution into durable harness evidence.

### Experiment Reports

- `experiments/reports/2026-05-31-dinner-picker-mvp.md`: first lab experiment
  report; showed browser smoke checks catch visual issues that unit tests miss.
- `experiments/reports/2026-05-31-dinner-picker-mobile-add-bug.md`: report on
  the validation-path mismatch between localhost and phone-accessible LAN URL.
- `experiments/reports/2026-05-31-dinner-picker-feedback-redraw.md`: report on
  turning subjective UX feedback into explicit product rules, tests, and
  browser-observed behavior.
- `experiments/reports/index.md`: report discovery surface. It was updated
  during this Phase 3C inventory because the feedback-redraw report existed but
  was missing from the index.

Evidence value: experiments separated "what happened" from "what standard
should we keep", making later abstraction safer.

Gap: add-button feedback and input responsiveness have run records and
checklists, but no dedicated experiment reports were found.

### Evals, Checklists, And Rubrics

- `evals/rubrics/harness-validation-rubric.md`: scoring surface for
  understandability, recoverability, verifiability, and shareability.
- `evals/checklists/mobile-ui-state-feedback.md`: checklist created from the
  add-button state feedback issue.
- `evals/checklists/mobile-interaction-performance.md`: checklist created from
  mobile responsiveness feedback.
- `harness/runs/run-record-schema.md`: required structure and quality bar for
  run records.
- `evals/index.md`, `evals/checklists/index.md`, and
  `evals/rubrics/index.md`: discovery surfaces for eval artifacts.

Evidence value: subjective user feedback became reusable quality gates instead
of remaining only in chat.

Gap: older run records use an earlier `14 / 14` rubric framing, while the
current rubric has evolved. Historical scores should be interpreted as
time-local evidence rather than mechanically compared to the current maximum.

### Standards And Patterns From Feedback

- `docs/patterns/standard-capture-loop.md`: high-priority method for turning
  corrections, failed runs, and repeated friction into project standards.
- `docs/standards/mainline-continuity.md`: standard for returning to the
  larger project direction after useful detours.
- `agents/handoffs/subagent-task-handoff.md`: task packet and return report
  format for bounded subagent delegation.
- `agents/playbooks/subagent-delegation.md`: playbook for delegating,
  integrating, and returning to the mainline.
- `harness/agent-delivery-contract.md`: delivery loop that requires testing,
  user-facing verification, commits, evidence, subagent lifecycle control, and
  mainline continuity.
- `AGENTS.md`: runtime enforcement surface for process-gap capture, mainline
  continuity, subagent lifecycle, and delivery expectations.

Evidence value: user-corrected agent behavior became reusable operating
contracts.

### Evolution Entries

- `docs/evolution/0011-first-lab-project-dinner-picker.md`: first real lab
  project milestone.
- `docs/evolution/0012-mobile-lan-validation-gap.md`: validation-path gap from
  phone/LAN testing.
- `docs/evolution/0013-feedback-driven-recommendation-loop.md`: subjective UX
  feedback converted into tested recommendation behavior.
- `docs/evolution/0014-user-corrected-process-gaps.md`: user-corrected agent
  mistakes treated as harness evidence.
- `docs/evolution/0015-project-standards-capture.md`: generalized reusable
  project standards beyond harness-only docs.
- `docs/evolution/0016-standard-capture-loop-methodology.md`: standard-capture
  method promoted as a high-priority pattern.
- `docs/evolution/0017-subagent-lifecycle-cost-control.md`: subagent use
  treated as a costed lifecycle, not free background work.
- `docs/evolution/0018-phase-3c-pattern-extraction-start.md`: formal phase
  transition into evidence-based pattern extraction.
- `docs/evolution/0019-mainline-continuity-standard.md`: mainline continuity
  captured as a cross-cutting standard.
- `docs/evolution/0020-subagent-delegation-handoff-standard.md`: subagent
  handoff captured as a reusable delegation protocol.

Evidence value: the project has stage-level narrative records suitable for
future sharing, not only task-level changelogs.

## Candidate Reusable Patterns

These candidates should be evaluated in later Phase 3C work.

### Agent-First Living Lab

Evidence:

- `AGENTS.md`
- `CONTEXT.md`
- `docs/workflows/validation-phase-learning-plan.md`
- `lab/dinner-picker/`
- `docs/evolution/0011-first-lab-project-dinner-picker.md`

Reuse candidate: project template plus explanatory pattern.

### Evidence-Based Lab Validation

Evidence:

- `harness/runs/run-record-schema.md`
- `evals/rubrics/harness-validation-rubric.md`
- Dinner Picker run records and experiment reports

Reuse candidate: workflow, checklist, and template skeleton.

### User Feedback To Executable Contract

Evidence:

- `docs/evolution/0013-feedback-driven-recommendation-loop.md`
- `harness/runs/2026-05-31-dinner-picker-feedback-redraw.md`
- `experiments/reports/2026-05-31-dinner-picker-feedback-redraw.md`

Reuse candidate: skill or playbook for converting feedback into rules, tests,
and verification.

### Validation Path Matching

Evidence:

- `docs/evolution/0012-mobile-lan-validation-gap.md`
- `harness/runs/2026-05-31-dinner-picker-mobile-add-bug.md`
- `experiments/reports/2026-05-31-dinner-picker-mobile-add-bug.md`

Reuse candidate: checklist and delivery-contract rule for matching the user's
real access path.

### Mobile UI State Contract

Evidence:

- `harness/runs/2026-05-31-dinner-picker-add-button-feedback.md`
- `evals/checklists/mobile-ui-state-feedback.md`

Reuse candidate: UI checklist or playbook for deriving visible affordances from
application state.

### Mobile Interaction Performance Gate

Evidence:

- `harness/runs/2026-05-31-dinner-picker-input-responsiveness.md`
- `evals/checklists/mobile-interaction-performance.md`

Reuse candidate: checklist for mobile-first UI work and performance feedback.

### Standard Capture Loop

Evidence:

- `docs/patterns/standard-capture-loop.md`
- `docs/evolution/0014-user-corrected-process-gaps.md`
- `docs/evolution/0015-project-standards-capture.md`
- `docs/evolution/0016-standard-capture-loop-methodology.md`

Reuse candidate: public skill, project standard, and shareable pattern.

### Mainline Continuity

Evidence:

- `docs/standards/mainline-continuity.md`
- `docs/evolution/0019-mainline-continuity-standard.md`
- `AGENTS.md`

Reuse candidate: agent operating rule and template default.

### Subagent Delegation Handoff

Evidence:

- `agents/handoffs/subagent-task-handoff.md`
- `agents/playbooks/subagent-delegation.md`
- `docs/evolution/0020-subagent-delegation-handoff-standard.md`

Reuse candidate: playbook, handoff template, and optional skill helper.

### Default Specialist Agent Roles

Evidence:

- `agents/roles/default-agent-roles.md`
- `agents/playbooks/subagent-delegation.md`
- `docs/evolution/0022-default-agent-role-set.md`

Reuse candidate: project-template default and role-selection guide for future
agent-first repositories.

## Risks And Gaps

- Some lab evidence is still manual or semi-manual; executable eval automation
  remains a future opportunity.
- Physical phone testing is not fully automated; LAN and viewport checks reduce
  the gap but do not eliminate it.
- Only one real lab app has been used so far, so reusable extraction should stay
  conservative.
- The current project has standards and patterns, but not yet a packaged
  template or public skill.
- Subagent delegation had one failed spawn attempt because the `explore` role's
  model was unavailable in the current account; the fallback default subagent
  completed the bounded evidence inventory successfully.
- No executable local eval script exists yet for access-path parity, standards
  capture, or evolution-log obligations.

## Recommended Next 3C Step

Use this evidence map to produce a reuse decision:

```text
pattern -> evidence -> reuse form -> why -> minimum package -> open risk
```

The recommended next artifact is:

`decisions/0003-template-skill-playbook-reuse-strategy.md`
