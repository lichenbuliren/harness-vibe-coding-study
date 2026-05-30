# Lab

`lab/` contains the real validation project for this repository.

The first lab project is `dinner-picker`, a mobile-first React + TypeScript app
for answering "what should I eat today?"

The lab starts intentionally small. Its purpose is to test whether the
agent-first methodology, harness notes, experiments, and evals help real project
work.

## Current Project

- `dinner-picker/`: a Vite React app where users maintain a dish pool and draw a
  random dinner recommendation with local persistence.

## Validation Goals

This lab project validates:

- whether a concrete app can live inside the documented agent-first structure
- whether run records help preserve implementation evidence
- whether local evals catch project obligations
- whether mobile-first UI work can be verified within this harness

Lessons learned in `lab/` should feed back into `docs/`, `agents/`, `harness/`,
`experiments/`, `evals/`, `decisions/`, and `docs/evolution/` when they become
stage-level outcomes.
