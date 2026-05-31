# Minimum Template Skeleton Design

## Stage

Phase 3C - Pattern Extraction.

## Goal

Turn the reuse strategy decision into a concrete minimum project-template
skeleton design.

The goal is not to publish a reusable template yet. It is to decide what belongs
in the smallest viable Agent-First Living Lab skeleton and what should stay
optional.

## Methodology

We followed the Phase 3C reuse decision:

```text
structure -> template skeleton
judgment loop -> future skill candidate
step sequence -> playbook
mandatory constraint -> standard
shareable concept -> pattern
```

The main agent drafted the skeleton from the evidence map and reuse strategy.
A specialist reviewer was delegated to challenge the boundary between required
core files and optional packs. The reviewer recommended treating the template
as an operating and evidence spine, not as a copied version of this project or
the Dinner Picker lab.

## Decision

Create `docs/workflows/minimum-project-template-skeleton.md`.

The skeleton requires:

- root project context and agent contract
- documentation indexes
- evolution and standards surfaces
- default agent roles, handoffs, and subagent delegation playbook
- harness delivery contract and run-record schema
- eval rubric entrypoints
- experiment, lab, and decision entrypoints

It keeps these as optional packs:

- mobile app checks
- Superpowers specs/plans
- deeper experiment reporting
- public skill candidate evaluation
- example lab artifacts such as Dinner Picker
- runtime-specific assumptions such as OMX state or platform-specific tooling

The design also adds readiness criteria that prevent over-packaging:

- every mandatory file listed by an index must exist
- no Dinner Picker specifics, local paths, generated runtime state, or
  current-project phase constraints should leak into the core
- the skeleton must support a dry-run validation task without hidden context

## Artifacts

- `docs/workflows/minimum-project-template-skeleton.md`
- `docs/workflows/index.md`
- `docs/evolution/0024-minimum-template-skeleton-design.md`

## Shareable Takeaway

A reusable harness template should start as a skeleton, not as a full copy of
the learning repository.

The skeleton should preserve the project operating system while leaving domain
content, lab implementation, optional tool packs, and public skills out until a
new project earns them.

## Open Questions

- Should the next task create a real `templates/` directory or first do a dry
  run review?
- Which files need placeholder variables before packaging?
- Should optional packs be separate directories or documented install choices?
