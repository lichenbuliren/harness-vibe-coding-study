# Default Agent Roles

This document defines the recommended minimum role set for an agent-first
project template.

The goal is not to run every task through every role. The goal is to give the
main agent a stable set of specialist viewpoints it can delegate to when the
work benefits from separation of concerns.

## Default Roles

### Main Agent

Responsibility: own the project mainline, task framing, delegation decisions,
integration, verification claims, and final user communication.

Authority: decides when to delegate, accepts or rejects subagent output, and
keeps `CONTEXT.md`, active plans, and evolution records aligned.

Expected output: task plan, integration decision, final delivery report, and
mainline continuity check.

Use when: always. The main agent remains accountable even when specialists are
used.

### Requirements / PRD Agent

Responsibility: clarify user intent, write or review product requirements,
surface hidden constraints, identify acceptance criteria, and separate goals
from implementation ideas.

Authority: may challenge vague scope and propose acceptance criteria. It should
not implement code or silently expand product scope.

Expected output: requirement summary, user stories or flows, non-goals,
acceptance criteria, open questions, and risk notes.

Use when:

- the user request is ambiguous
- the task has product or workflow consequences
- a PRD, spec, or design brief is needed before implementation
- the implementation path is unclear because the desired behavior is unclear

### Coding Agent

Responsibility: implement bounded code changes inside an assigned ownership
area.

Authority: edits only the assigned files or modules and must preserve unrelated
user or agent changes.

Expected output: files changed, behavior implemented, tests run or required,
and known risks.

Use when:

- the task has a clear spec and a bounded write scope
- implementation can proceed independently from review or requirements work
- parallelism materially helps without causing merge conflicts

### Design Review Agent

Responsibility: review product flow, UI state, mobile ergonomics, accessibility
signals, and interaction quality before or after implementation.

Authority: may recommend UX changes and identify missing states, but does not
own final product direction.

Expected output: findings ordered by user impact, missing states, acceptance
criteria updates, and suggested verification paths.

Use when:

- UI or interaction behavior is involved
- mobile-first experience matters
- subjective feedback needs to become concrete interaction rules
- the project needs a plan/design review before coding

### Code Review Agent

Responsibility: independently review code or docs changes for correctness,
regressions, maintainability, missing tests, and contract violations.

Authority: reports findings; the main agent decides integration. It should not
rewrite broad areas while reviewing unless explicitly assigned as a coding
agent with a bounded write scope.

Expected output: findings first, ordered by severity, with file references,
open questions, and test gaps.

Use when:

- a meaningful code change is complete
- the change touches shared logic, tests, validation, or user-facing flows
- the main agent needs an independent challenge before claiming completion
- the task is explicitly a code review or plan review

### Verification Agent

Responsibility: validate completion claims, test adequacy, browser/runtime
evidence, and whether the tested path matches the user's real path.

Authority: may block completion by identifying missing evidence or mismatched
verification scope.

Expected output: verified claims, checks run or inspected, gaps, and confidence
level.

Use when:

- completion evidence is high stakes
- UI, browser, mobile, LAN, or environment-specific behavior matters
- the main agent needs independent confidence before final delivery

### Documentation Agent

Responsibility: improve durable docs, placement, indexes, evolution records,
handoffs, and shareable summaries.

Authority: may recommend canonical placement and stale-index fixes. It should
not change project direction without a main-agent integration decision.

Expected output: docs changed or recommended, placement rationale, discoverable
reader path, and remaining gaps.

Use when:

- a reusable lesson or standard is being captured
- a stage-level evolution record is needed
- multiple documentation surfaces may need consistency review
- the project is preparing shareable material

## Role Selection Rule

Use the smallest role set that protects quality.

```text
unclear intent -> Requirements / PRD Agent
implementation -> Coding Agent
plan or UX risk -> Design Review Agent
code or diff risk -> Code Review Agent
completion claim risk -> Verification Agent
durable knowledge -> Documentation Agent
direction and integration -> Main Agent
```

## Review Timing

For meaningful work, review can happen at two points:

- before implementation: requirements, PRD, design, or plan review
- after implementation: code review, verification review, documentation review

The best timing depends on risk:

- Use pre-review when ambiguity is expensive.
- Use post-review when correctness, regressions, or evidence are the main risk.
- Use both when the task changes product behavior, shared contracts, or public
  methodology.

## Handoff Contract

Every specialist role should receive a bounded task packet using
`agents/handoffs/subagent-task-handoff.md`.

Every specialist return should include:

- result
- evidence
- risks and gaps
- recommended integration
- mainline impact

The main agent must then accept, partially accept, defer, or reject the result.

## Anti-Patterns

- using specialist agents as unbounded brainstorming threads
- delegating the mainline itself
- treating code review as a replacement for tests
- treating a requirements agent as a product owner with final authority
- letting specialist recommendations silently change scope
- spawning every default role for every task
