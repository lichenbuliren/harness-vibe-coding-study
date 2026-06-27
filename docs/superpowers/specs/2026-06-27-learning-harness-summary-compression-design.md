# Learning Harness Summary Compression Design

## Goal

Rewrite `docs/learning-harness-summary.md` from a 1063-line research note into
a 250-350 line methodology document that is easier to review and apply.

The result should preserve the useful reasoning, examples, and operational
checklists while removing repetition, unsupported precision, and accidental
heading hierarchy.

## Audience

The primary reader is the future maintainer of this repository who needs to:

- understand harness engineering quickly;
- connect the method to repository artifacts;
- identify the smallest useful next improvement;
- distinguish durable principles from illustrative examples.

## Information Architecture

The document will use a hybrid structure:

1. **Definition and diagnosis**: explain the capability-reliability gap and
   establish the harness-first diagnosis loop.
2. **Five subsystems**: define Instructions, Tools, Environment, State, and
   Feedback as the stable conceptual model.
3. **Repository as system of record**: explain knowledge visibility,
   progressive disclosure, and the fresh-session test.
4. **Single-feature execution**: combine WIP limits, feature lists, task
   boundaries, and state transitions.
5. **Verification and completion**: combine completion evidence, layered
   verification, end-to-end checks, and actionable feedback.
6. **Cross-session continuity**: combine initialization, progress records,
   decisions, handoff, and clean exit state.
7. **Minimal adoption path**: provide a compact checklist and map the method to
   the artifacts already present in this repository.

This order follows the dependency chain from concept, to project structure, to
task execution, to verification, to lifecycle continuity.

## Editing Rules

- Keep the final document between 250 and 350 lines.
- Keep paragraphs under 240 Chinese characters where practical.
- Use one main Mermaid diagram for the lifecycle; remove diagrams that repeat
  prose without adding information.
- Keep only examples that demonstrate a reusable artifact or decision.
- Replace precise empirical claims without citations with qualified language.
- Avoid naming an external organization as evidence unless a source is linked.
- Treat `AGENTS.md` as a short router, not a complete manual.
- Prefer executable completion evidence over subjective completion language.
- Preserve Chinese as the primary language and English for established terms,
  file names, and commands.

## Retained Artifacts

The rewritten document should retain compact examples of:

- a short `AGENTS.md` entrypoint;
- a feature item with behavior, verification, state, and evidence;
- layered verification commands;
- a session startup and exit checklist.

Examples for `PROGRESS.md`, design decisions, sprint contracts, quality grades,
and observability should be merged into the lifecycle explanation rather than
kept as independent long sections.

## Removed Or Consolidated Material

- Merge the original twelve chapters into seven sections.
- Remove repeated explanations of unit-test blind spots.
- Remove repeated claims that agents are overconfident.
- Merge initialization, state persistence, and handoff into one lifecycle.
- Merge task boundaries and feature-list state machines.
- Remove illustrative statistics that lack a source in the document.
- Remove examples that introduce unrelated product domains without clarifying
  the harness principle.
- Correct code-block headings that currently appear in the document outline.

## Repository Mapping

The final section will distinguish what this repository already has from what
remains incomplete.

Existing:

- `AGENTS.md`
- `feature_list.json`
- `progress.md`
- `session-handoff.md`
- `init.sh`
- `docs/evolution/`

Remaining improvements:

- complete the durable context in `CONTEXT.md`;
- add explicit verification commands to feature entries where behavior exists;
- distinguish structural validation from behavior-level validation;
- keep state and handoff evidence current after substantive work.

## Verification

The rewrite is complete when:

- the document is between 250 and 350 lines;
- its top-level outline contains exactly seven numbered sections;
- Markdown headings do not leak from fenced examples;
- repeated key phrases and duplicated examples have been removed;
- repository artifact paths mentioned in the document exist;
- `./init.sh` passes;
- `git diff --check` passes.

