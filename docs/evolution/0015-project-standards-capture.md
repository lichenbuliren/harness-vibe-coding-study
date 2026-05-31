# Project Standards Capture Beyond Harness

## Stage

Phase 3B - Harness engineering validation through live collaboration.

## Goal

Generalise the self-correction rule. Some lessons discovered during harness
work are not only harness rules. They may become directory standards,
documentation standards, evaluation standards, lab standards, or runtime agent
rules.

Priority: high. This is a core methodology for the project because it defines
how live collaboration improves future agent behavior.

## Methodology

We used a documentation-grilling lens:

1. Compared the user's term "规范" against existing project language.
2. Identified that `harness/` was too narrow as the only canonical surface.
3. Created `docs/standards/` for cross-cutting project standards.
4. Kept `AGENTS.md` as the runtime enforcement surface.
5. Kept `harness/agent-delivery-contract.md` for delivery-specific standards.
6. Allowed skills such as `grill-with-docs` and subagents to support future
   cross-surface standard updates.

## Decision

Use `Project standard` as the broader canonical term.

A project standard is a reusable rule future agents should follow across
harness, documentation, directory structure, lab implementation, or evaluation.

## Artifacts

- `docs/patterns/standard-capture-loop.md`
- `docs/standards/index.md`
- `docs/index.md`
- `AGENTS.md`
- `harness/agent-delivery-contract.md`
- `CONTEXT.md`
- `decisions/0002-create-project-standards-surface.md`
- `evals/rubrics/harness-validation-rubric.md`

## Shareable Takeaway

Harness work can produce standards outside the harness itself.

A mature agent should not only ask "should this update harness docs?" It should
ask "which canonical project surface should own this reusable rule?"

## Open Questions

- Should directory standards get their own page once more examples appear?
- Should `evals/rubrics/harness-validation-rubric.md` add a separate score for
  standards capture?
