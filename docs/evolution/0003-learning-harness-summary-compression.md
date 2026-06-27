# 0003 - Learning Harness Summary Compression

## Goal

Turn `docs/learning-harness-summary.md` from a long research compilation into a
reviewable methodology that preserves the useful model, execution flow, and
repository application.

## Starting State

The source document contained 1063 lines and twelve main chapters. Several
ideas appeared repeatedly under different headings:

- task boundaries and feature-list control;
- unit-test limitations and end-to-end verification;
- state persistence, initialization, and session handoff;
- agent overconfidence and external completion evidence.

The document also included exact empirical claims without a local bibliography,
examples from unrelated product domains, and headings inside examples that
polluted the visible outline.

## Method

The rewrite used a hybrid information architecture:

1. five stable harness subsystems: Instructions, Tools, Environment, State, and
   Feedback;
2. one lifecycle from initialization through single-feature execution,
   verification, evidence, and clean handoff;
3. one final mapping from the method to this repository.

The work preserved compact examples for the root operating contract, a feature
item, layered verification, and session startup and exit checks.

## Outcome

The document now contains 318 lines and seven numbered sections:

1. the problem harness solves;
2. the five subsystems;
3. the repository as system of record;
4. single-feature execution;
5. feedback and completion;
6. cross-session continuity;
7. the minimal adoption path.

Repeated explanations and unsupported precision were removed. External
organizations are no longer used as evidence without an accompanying source.

## Evidence

- `wc -l docs/learning-harness-summary.md` returned 318.
- `rg '^## [1-7]\.' docs/learning-harness-summary.md` returned seven sections in
  numeric order.
- Markdown fence validation returned an even count of 22.
- All repository artifact paths named in the adoption map exist.
- `git diff --check` passed.
- `./init.sh` passed.

## Reusable Conclusion

A harness methodology is easier to apply when the conceptual model and the
operating lifecycle are separated:

- the five subsystems explain what must exist;
- the lifecycle explains when each subsystem participates;
- the repository mapping explains what to change next.

Adding more chapters is not the default response to a new insight. First decide
whether the insight belongs to an existing subsystem, lifecycle step, or
verification rule.

## Next Step

Continue `feat-003 - Project Context Restoration`. Complete `CONTEXT.md` with
the durable project purpose, boundaries, terminology, and restart assumptions,
then revisit feature-specific behavior verification.

