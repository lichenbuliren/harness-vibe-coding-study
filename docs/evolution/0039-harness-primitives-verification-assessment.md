# Harness Primitives, Verification, and Maturity Assessment

## Stage

Post-Phase 3C follow-up — filling planned-but-not-created harness docs.

## Goal

Close three gaps identified during a project-level harness self-review:

1. `harness/primitives.md` was explicitly listed as a planned document in
   `harness/foundations.md` section "Immediate Documentation Shape" but was
   never created during Phase 3C.
2. `harness/verification.md` was listed as the next harness doc alongside
   primitives but was deferred when Phase 3C shifted to pattern extraction.
3. A `docs/workflows/harness-maturity-assessment.md` was needed to provide a
   structured method for assessing real projects (starting with
   `shopee/spp-user-plugin` as a pilot).

## Method

The three documents were designed together because they share a dependency:

```
primitives.md: "here are the building blocks"
verification.md: "here is how to check correctness using those blocks"
maturity-assessment.md: "here is how to score a project on how many blocks
                         it uses and how well they are wired"
```

Each document was written to align with the existing harness methodology:

- `primitives.md` uses the Control + Agency + Runtime + Substrate model from
  `foundations.md` and defines a 5-stage primitive lifecycle
  (absent → ad hoc → documented → wired → verified) that doubles as the
  scoring scale for maturity assessment.
- `verification.md` splits verification into deterministic checks (mechanical,
  automated) and inferential checks (judgment, review), adds approval gates by
  risk level, and maps each artifact type to a default verification level.
- `harness-maturity-assessment.md` defines a survey → score → diagnose →
  recommend workflow with seven maturity layers that mirror the primitive
  categories, a 0-3 scoring scale, and example output referencing the
  spp-user-plugin pilot repo.

## Artifacts

- `harness/primitives.md`
- `harness/verification.md`
- `docs/workflows/harness-maturity-assessment.md`
- Updated `harness/index.md` to reference the two new harness docs.
- Updated `templates/agent-first-living-lab/harness/` with both new files and
  updated index.
- Updated `CONTEXT.md` Current Artifacts section.

## Comparison With What The Study Repo Had Before

Before this task, the study repo had 11 harness module docs but was missing the
primitives taxonomy that binds them together. An agent arriving at
`harness/index.md` could see "we have a learning loop, an orchestration loop, a
delivery contract" but had no quick way to answer "what primitives do those
loops use and which ones should I pick for my task?"

The maturity assessment was also absent. The Chinese summary had a "最小可行
Harness Checklist" (14 yes/no questions) but no structured scoring system or
repeatable assessment procedure.

## Open Questions

- Should `harness/session-lifecycle.md`, `harness/tools-and-context.md`, and
  `harness/multi-agent.md` (the remaining three docs from the foundations.md
  plan) also be created before applying this methodology to a real project?
- Should the maturity assessment framework eventually include an automated
  scoring script that checks file existence and content structure?

## Shareable Takeaway

Planned harness docs that are deferred during a phase transition do not
automatically become obsolete. The project's foundations.md correctly
anticipated these documents; Phase 3C correctly prioritized pattern extraction
over document completeness. The gap was not a planning error — it was a
scheduling decision.

The three documents created here also serve a practical purpose beyond
completeness: they are the bridge between the study repo's methodology and a
real project's adoption path. Without primitives, a new project has no "what to
pick" guide. Without verification, it has no "how to check" guide. Without
maturity assessment, it has no "where are we now" baseline.
