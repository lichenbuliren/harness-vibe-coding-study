# 0005 Specs Agent Workflows Study

## Stage

Harness engineering foundations.

## Goal

Study the Specs, Agent Files & Workflow Design module from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
and define this repository's initial policy for agent instruction files,
spec-driven workflow, state, validation, and learning capture.

## Methodology Used

- Source inventory from the upstream module
- Parallel sub-agent research across two source groups
- Cross-source synthesis by the orchestrating agent
- Project-local extraction into `harness/specs-agent-workflows.md`

## Source Groups

- AGENTS.md, agent.md, GitHub Spec Kit, and Thoughtworks SDD: agent instruction
  surfaces, hierarchy, precedence, spec lifecycle, and review tradeoffs
- 12 Factor Agents and 12-Factor AgentOps: owned prompts, explicit state,
  human gates, validation, pause/resume, and learning loops

## Outcome

The project adopted a workflow model:

```text
Context -> Work -> Validation -> Learning
```

It also clarified that `AGENTS.md` is the canonical root agent instruction file,
while specs, plans, handoffs, evals, and evolution records form the durable
workflow contract around agent work.

## Artifacts Produced

- `harness/specs-agent-workflows.md`
- Updated `harness/index.md`
- Updated `docs/evolution/index.md`

## Shareable Takeaway

Agent workflows should be treated like software systems: own the prompts, own
the context packet, make state inspectable, put human gates at meaningful risk
points, validate externally, and write learning back to the repository. Specs
are useful when they become durable contracts, not when they become unreviewable
Markdown piles.

## Open Questions

- Should this repo create a formal workflow template under `agents/playbooks/`?
- What is the minimum artifact set for future lab milestones?
- How should spec-review and implementation-plan review be evaluated?
- Should nested `AGENTS.md` precedence be documented more explicitly in the
  root operating contract?
