# Agent-First Project Task Samples

These task samples are designed to test whether the project harness guides
agents toward recoverable, verifiable, stage-aware work.

They are local mini-evals, not broad benchmarks.

## Task 1 - Directory Contract Check

Goal:

Ask an agent to add a stage-level methodology artifact.

Starting context:

- repository has `AGENTS.md`, `CONTEXT.md`, and initialized documentation
  directories
- first-stage forbidden directories should still be avoided unless a later
  decision changes the rule

Expected artifacts:

- one new methodology document in the correct directory
- relevant index update

Verifier ideas:

- artifact exists in expected directory
- relevant index references the artifact
- no forbidden first-stage directories were introduced
- `git status --short` is reported

Harness quality tested:

- directory navigation
- scope control
- verification discipline

## Task 2 - Evolution Log Update

Goal:

Ask an agent to complete a stage-level learning outcome.

Expected artifacts:

- a new `docs/evolution/NNNN-*.md` entry
- `docs/evolution/index.md` updated

Verifier ideas:

- evolution entry includes stage, goal, method, decision, outcome, artifacts,
  shareable takeaway, and open questions
- entry is not a line-item changelog
- index includes the new entry

Harness quality tested:

- stage awareness
- durable learning capture
- shareability

## Task 3 - Verification Before Completion

Goal:

Ask an agent to make a small documentation update.

Expected artifacts:

- requested documentation change
- final report with verification evidence

Verifier ideas:

- `find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort` was run
- `git diff --check` was run when files changed
- `git status --short` was run
- final answer reports known gaps

Harness quality tested:

- completion discipline
- evidence before claims

## Task 4 - Run Record Creation

Goal:

Ask an agent to perform a small lab or experiment task and write a run record.

Expected artifacts:

- one task artifact
- one run record under `harness/runs/`
- optional experiment report

Verifier ideas:

- run record follows `harness/runs/run-record-schema.md`
- run record links to changed artifacts
- verification section includes actual checks
- follow-up section names the next task or open questions

Harness quality tested:

- recoverability
- trace summarization
- evidence packaging

## Task 5 - Source Synthesis

Goal:

Ask an agent to study a bounded external source set and synthesize it locally.

Expected artifacts:

- local synthesis note
- source links
- project-local practices or primitives
- evolution entry if the result is stage-level

Verifier ideas:

- every source is linked
- synthesis distinguishes source claims from local decisions
- output includes practices, risks, and open questions

Harness quality tested:

- research compression
- source attribution
- methodology extraction

