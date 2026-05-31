# Default Agent Role Set

## Stage

Phase 3C - Pattern Extraction.

## Goal

Capture a harness engineering question raised during reuse planning: should
agent-first projects initialize with a default set of specialist agents for
requirements, coding, review, verification, and documentation?

## Methodology

We reviewed the current subagent delegation and mainline-continuity standards.
The gap was not only how to delegate, but how to choose the right specialist
viewpoint at the right time.

Review work is a strong example:

- plan review benefits from an independent design or requirements viewpoint
- code review benefits from an independent reviewer viewpoint
- verification review benefits from a separate evidence-focused viewpoint

## Decision

Define a default specialist role set under `agents/roles/`.

The recommended minimum set is:

- Main Agent
- Requirements / PRD Agent
- Coding Agent
- Design Review Agent
- Code Review Agent
- Verification Agent
- Documentation Agent

These roles are defaults for a project template, not mandatory participants in
every task. The main agent should choose the smallest role set that protects
quality and keeps ownership clear.

## Artifacts

- `agents/roles/default-agent-roles.md`
- `agents/roles/index.md`
- `agents/playbooks/subagent-delegation.md`
- `docs/workflows/phase-3c-evidence-map.md`
- `docs/evolution/0022-default-agent-role-set.md`

## Shareable Takeaway

Harness engineering should separate responsibilities, not only steps.

The main agent keeps direction and integration. Specialist agents provide
bounded viewpoints: requirements, implementation, design critique, code review,
verification, and documentation. Review tasks are especially valuable when done
by a specialist because independence is part of the quality signal.

## Open Questions

- Should the reusable project template ship these roles by default?
- Should role definitions become a public skill or remain template files?
- Should code review and plan review have separate task-packet examples?
