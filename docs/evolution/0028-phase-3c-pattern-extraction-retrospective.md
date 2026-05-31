# Phase 3C Pattern Extraction Retrospective

## Stage

Phase 3C - Pattern Extraction.

## Goal

Close the Phase 3C reusable-extraction loop.

The goal was to move from Phase 3B lab evidence to a reusable package without
over-claiming that every useful practice was ready to become a public skill or
fully released template.

## Methodology

We used an evidence-first sequence:

```text
evidence inventory -> reuse classification -> template skeleton design ->
dry-run review -> template-safe source files -> throwaway validation
```

Specialist reviewer agents were used for the reuse decision and template
boundary checks. The main agent integrated their reports conservatively,
choosing weaker reusable forms when evidence was not strong enough for public
skill or packaged-template claims.

## Outcome

Phase 3C produced a checked-in reusable skeleton:

- `docs/workflows/phase-3c-evidence-map.md`
- `decisions/0003-template-skill-playbook-reuse-strategy.md`
- `docs/workflows/minimum-project-template-skeleton.md`
- `docs/workflows/template-skeleton-dry-run-review.md`
- `templates/agent-first-living-lab/`
- `docs/workflows/template-skeleton-throwaway-validation.md`

The template skeleton can initialize a temporary project and create first
evidence records from blank templates.

It is ready as a repository-local reusable skeleton. It is not yet a released
generator, public package, or evaluated skill.

## Shareable Takeaway

Reusable harness assets should be extracted in layers:

```text
evidence -> classification -> skeleton -> validation -> packaging
```

Skipping directly from "this worked once" to "publish a skill" or "copy the
whole repo as a template" creates brittle reuse. Phase 3C showed a more careful
path: preserve the operating system, remove false history, and validate that a
new project can start producing its own evidence.

## Open Questions

- Should the next phase design optional packs, such as mobile validation or
  Superpowers specs/plans?
- Should a generator script be created for placeholder replacement?
- Should `standard-capture-loop` receive the first formal skill eval?
- Should a separate fresh-repo agent run be required before external sharing?
