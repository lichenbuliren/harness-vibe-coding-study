# 0007 - Benchmarks and Runtimes Study

## Stage

Harness engineering best-practice exploration.

## Goal

Finish the remaining core modules from
`walkinglabs/awesome-harness-engineering`: Benchmarks and Runtimes, Harnesses &
Reference Implementations.

## Method

We grouped the remaining sources by the question they answer:

- Benchmarks: what external task surfaces expose harness quality?
- Runtimes and reference implementations: what implementation shapes already
  exist, and when should this project adopt them?

Because subagent quota was unavailable, synthesis was done in the main session.
The method emphasized taxonomy and local decision rules over exhaustive
description of every link.

## Decision

Treat benchmark results as measurements of a model-harness-environment bundle,
not pure model capability.

Treat frameworks, runtimes, and harnesses as separate but overlapping layers:

- framework: development abstractions
- runtime: durable execution infrastructure
- harness: operating system around agent behavior

## Outcome

The project now has:

- a benchmark taxonomy organized by task surface
- rules for reporting and interpreting benchmark results
- a staged adoption ladder for runtimes and reference implementations
- selection criteria before adopting external runtime infrastructure

## Artifacts

- `harness/benchmarks.md`
- `harness/runtimes-reference-implementations.md`
- `harness/index.md`
- `docs/evolution/0007-benchmarks-runtimes-study.md`

## Shareable Takeaway

Benchmarks are useful when they expose harness behavior. A leaderboard score is
not enough; useful reporting needs model, harness revision, runtime setup,
resource limits, trace evidence, cost, and evaluator limitations.

Reference implementations should be mined for patterns before being adopted as
dependencies. A project should not add a runtime until its state, recovery, and
verification needs exceed what files, git, and small scripts can provide.

## Open Questions

- Which local mini-eval should become the first executable benchmark?
- What run-record schema should precede any observability backend?
- Which runtime reference should be explored first when this project moves from
  documentation to executable harness automation?
