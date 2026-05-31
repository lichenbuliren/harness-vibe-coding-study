# Template Skill Playbook Reuse Decision

## Stage

Phase 3C - Pattern Extraction.

## Goal

Decide how Phase 3B/3C evidence should be packaged for reuse by future
projects.

The project needed to distinguish several reuse forms that had been discussed
together:

- project template
- public skill
- playbook
- standard
- pattern

## Methodology

We used the Phase 3C evidence map as the input.

The main agent also delegated a bounded review task to a specialist reviewer to
challenge the classification before finalizing the decision. The reviewer was
asked to look for over-extraction, missing evidence, and classification risks.

The reviewer recommended a more conservative rule: promote evidence to the
weakest reusable form future agents can reliably apply. The main agent accepted
that recommendation and adjusted the decision from "public skill / packaged
template" language toward "future skill candidate / template skeleton" language.

## Decision

Record the reuse strategy in
`decisions/0003-template-skill-playbook-reuse-strategy.md`.

The core rule is:

```text
structure -> template
judgment loop -> skill
step sequence -> playbook
mandatory constraint -> standard
shareable concept -> pattern
```

The first reusable package should be a project-template skeleton. Public skills
remain future candidates, especially `standard-capture-loop` and
`user-feedback-to-executable-contract`, but they should be evaluated separately
before publication.

## Artifacts

- `decisions/0003-template-skill-playbook-reuse-strategy.md`
- `decisions/index.md`
- `docs/evolution/0023-template-skill-playbook-reuse-decision.md`

## Shareable Takeaway

Reuse is not one bucket.

A mature harness project should decide whether a lesson is structure,
behavior, procedure, rule, or explanation before packaging it. Otherwise every
good idea becomes either "a template" or "a skill", and both forms become
blurry.

## Open Questions

- What is the minimum project-template package?
- Which skill candidate should get the first evaluation?
- Should the template include mobile checklists by default or as optional
  domain packs?
