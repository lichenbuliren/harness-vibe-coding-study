# Agent Learning Loop Module

## Stage

Post-Phase 3C follow-up - Learning loop modularization.

## Goal

Extract the repository's self-improvement behavior into a canonical harness
module before turning it into a future skill candidate.

## What Triggered This

The project already had a working standard-capture behavior, but it was spread
across `AGENTS.md`, `harness/agent-delivery-contract.md`,
`docs/patterns/standard-capture-loop.md`, `docs/standards/`, and template
files.

That was enough for this repository, but not enough for clean reuse. A future
project or skill needs one authoritative loop that explains how an agent learns
from corrections, failed checks, review findings, and repeated friction.

The external harness articles reinforced the same shape: a reliable agent is
driven by loops around the model. Tool loops help the agent act; verification
hooks prevent false completion; context management keeps the right evidence in
view. This project needed the analogous loop for learning.

## Method

We classified the existing behavior as an agent learning rule rather than only a
standard-capture pattern.

The implementation followed:

```text
identify scattered rule -> choose canonical surface -> add harness module ->
link runtime and pattern surfaces -> sync template -> verify discoverability
```

## Decision

`harness/agent-learning-loop.md` is now the canonical owner for the learning
loop:

```text
trigger -> observe -> classify -> choose surface -> update contract ->
verify discoverability -> record evolution -> return to mainline
```

`docs/patterns/standard-capture-loop.md` remains the shareable explanation.
`AGENTS.md` remains the runtime enforcement surface. Template projects now carry
their own minimal `harness/agent-learning-loop.md` so the behavior can travel
without copying this entire study repository.

## Artifacts

- `harness/agent-learning-loop.md`
- `harness/index.md`
- `AGENTS.md`
- `CONTEXT.md`
- `docs/patterns/standard-capture-loop.md`
- `docs/standards/index.md`
- `docs/workflows/minimum-project-template-skeleton.md`
- `templates/agent-first-living-lab/harness/agent-learning-loop.md`
- `templates/agent-first-living-lab/AGENTS.md`
- `templates/agent-first-living-lab/CONTEXT.md`
- `templates/agent-first-living-lab/TEMPLATE.md`
- `templates/agent-first-living-lab/INITIALIZE.md`
- `templates/agent-first-living-lab/init-template.sh`

## Shareable Takeaway

An agent-first project should not only verify task completion. It should verify
that useful failures become durable project behavior.

The learning loop is the bridge from harness documentation to a future portable
skill: package the judgment loop, not the whole repository.

## Open Questions

- Should `agent-learning-loop` become the first formal skill candidate, or
  should it remain paired with `standard-capture-loop`?
- What no-skill baseline should be used to evaluate whether the skill improves
  future agents?
- Should initialized templates automatically create a first decision record when
  they adopt the learning loop?
