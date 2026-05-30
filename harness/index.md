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
- `adapters/`: adapter boundaries between this project and external runtimes,
  tools, or evaluation surfaces.
- `runs/`: conventions for recording harness runs and evidence.
