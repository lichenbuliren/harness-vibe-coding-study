# Template Skeleton Throwaway Validation

## Stage

Phase 3C - Pattern Extraction.

## Goal

Validate that the checked-in Agent-First Living Lab template skeleton can be
copied into a clean temporary project and used to create first evidence records.

## Methodology

We performed a file-level throwaway initialization:

```text
copy template -> check required files -> scan for leaks ->
create first records from blank templates -> check placeholders
```

## Outcome

The validation passed with notes.

The template skeleton can be copied to a temporary project, all required files
exist, and blank templates can produce:

- a first run record
- a first evolution entry
- a first decision record

The skeleton is therefore ready as a checked-in reusable skeleton, but not yet
as a released package or generator.

## Artifacts

- `docs/workflows/template-skeleton-throwaway-validation.md`
- `docs/workflows/index.md`
- `docs/evolution/0027-template-skeleton-throwaway-validation.md`

## Shareable Takeaway

Template validation should not stop at "the files exist".

A useful harness template should prove that a new project can begin producing
its own evidence without inheriting old project history.

## Open Questions

- Should the next reusable asset be an optional pack or a generator?
- Should a fresh-repo agent run be required before calling this template
  publishable?
- Which future skill candidate should receive the first eval?
