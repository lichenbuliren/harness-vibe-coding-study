# Subagent Lifecycle Cost Control

## Stage

Phase 3B - Harness engineering validation through live collaboration.

## Goal

Clarify how this project should use subagents as the number of delegated agents
increases.

The question was whether many subagents increase token cost, and whether the
lead agent should explicitly close them after completion or rely on Codex to
clean them up.

## Methodology

We applied the standard-capture loop:

```text
observe correction -> classify lesson -> choose canonical surface ->
update standard -> verify discoverability -> commit -> cite in evolution
```

This was classified as a reusable agent operating standard because it affects
future task cost, context hygiene, and coordination discipline.

## Decision

Subagents are useful but not free. They can improve throughput and quality when
the work is bounded, independent, and worth a separate context. They also
consume token budget through prompts, inherited context, exploration, reasoning,
and reports.

The project standard is:

```text
delegate only when the subagent materially improves speed, quality, safety, or
coverage; integrate or reject the result; then close the subagent promptly
```

The project should not rely on implicit platform cleanup as its operating
standard. Explicit closure keeps coordination state small and makes cost visible.

## Artifacts

- `AGENTS.md`
- `harness/agent-delivery-contract.md`
- `docs/standards/index.md`

## Shareable Takeaway

Multi-agent harness work is not "more agents means better work." The useful
unit is a bounded, independently useful delegation with a clear lifecycle:

```text
delegate -> continue non-overlapping work -> integrate -> close
```

This is part of making agent collaboration governable instead of just parallel.

## Open Questions

- Should run records include token or agent-count metadata when the platform
  exposes reliable numbers?
- Should future reusable templates define a default maximum number of concurrent
  subagents for common task types?
