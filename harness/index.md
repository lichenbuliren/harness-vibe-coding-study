# Harness

`harness/` describes how this project frames, runs, observes, and evaluates
AI-agent work.

In the first stage this directory is documentation-first. Add executable harness
code only after the concepts, adapter boundaries, and run-recording conventions
are clear.

## Current Notes

- `foundations.md`: synthesis of the Foundations module from
  `walkinglabs/awesome-harness-engineering`.
- `context-memory.md`: context, memory, compaction, and working-state policy.
- `guardrails-safe-autonomy.md`: constraints, sandbox boundaries, tool policy,
  prompt-injection controls, and verifier gates for safe autonomy.
- `specs-agent-workflows.md`: agent instruction files, spec lifecycle,
  workflow state, validation, and learning capture.
- `evals-observability.md`: eval primitives, trace/observability practices,
  baseline comparison, environment control, and regression gates.
- `benchmarks.md`: benchmark taxonomy and rules for interpreting benchmark
  results as model-harness-environment measurements.
- `runtimes-reference-implementations.md`: framework/runtime/harness
  distinctions and adoption criteria for reference implementations.
- `adapters/`: adapter boundaries between this project and external runtimes,
  tools, or evaluation surfaces.
- `runs/`: conventions for recording harness runs and evidence.
