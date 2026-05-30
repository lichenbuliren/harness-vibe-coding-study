# 0003 Context Memory Working State Study

## Stage

Harness engineering foundations.

## Goal

Study the Context, Memory & Working State module from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
and define this repository's policy for context, durable memory, compaction,
working state, and output backpressure.

## Methodology Used

- Source inventory from the upstream module
- Parallel sub-agent research across three source groups
- Cross-source synthesis by the orchestrating agent
- Project-local extraction into `harness/context-memory.md`

## Source Groups

- Anthropic and Manus: context budget, filesystem memory, cache locality,
  just-in-time retrieval, and failure retention
- Thoughtworks and HumanLayer: context interfaces, drift, intentional
  compaction, high-leverage review, and context-efficient backpressure
- OpenHands and HumanLayer: bounded condensation and repo-local instruction
  design for `CLAUDE.md` / `AGENTS.md`

## Outcome

The project adopted a working memory model:

```text
prompt = active working set
filesystem = durable memory
git = versioned memory and recovery path
```

This model will guide future handoffs, run records, compaction behavior,
instruction design, and noisy command handling.

## Artifacts Produced

- `harness/context-memory.md`
- Updated `harness/index.md`
- Updated `docs/evolution/index.md`

## Shareable Takeaway

Context engineering is not about filling the largest possible window. It is
about keeping the live context small and high-signal while storing durable state
outside the prompt. The best harnesses use progressive disclosure, compact
handoff artifacts, deterministic output backpressure, and repo-local memory so a
fresh agent can resume without replaying the whole conversation.

## Open Questions

- Where should active task working state live: `agents/handoffs/`,
  `harness/runs/`, `experiments/reports/`, or a new convention?
- What is the smallest useful run record for long-running coding-agent work?
- Which commands need output backpressure wrappers once the lab project exists?
- How should this repository test that compaction preserves enough state to
  resume correctly?
