# 0002 Harness Foundations Study

## Stage

Harness engineering foundations.

## Goal

Study the Foundations module from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
and turn it into a project-local foundation for future harness design.

## Methodology Used

- Source inventory from the upstream Foundations module
- Parallel sub-agent research across three source groups
- Cross-source synthesis by the orchestrating agent
- Project-local extraction into `harness/foundations.md`

## Source Groups

- OpenAI and Anthropic: long-running agents, Codex harness practice, workflows,
  agents, evaluators, and handoff artifacts
- LangChain and Thoughtworks: harness component model, control systems,
  feedforward guides, feedback sensors, and harnessability
- HumanLayer, Inngest, codebase taxonomy, CAR preprint, and Many Hands:
  runtime, progressive disclosure, sub-agent isolation, governance, and
  codebase shape

## Outcome

The project adopted a working foundation model:

```text
Control + Agency + Runtime + Substrate
```

This model will guide later harness docs, experiments, evals, and lab work.

## Artifacts Produced

- `harness/foundations.md`
- Updated `harness/index.md`
- Updated `docs/evolution/index.md`

## Shareable Takeaway

Harness engineering is the discipline of designing the layer around the model:
instructions, tools, state, runtime, verification, governance, and repository
shape. Better models help, but many coding-agent failures are harness failures:
bad context, weak state, unclear tools, missing checks, or ungoverned
multi-agent coordination.

## Open Questions

- What is the smallest useful run record for this project?
- Which harness primitives should be documented next?
- What deterministic checks can enforce harness quality before real app code
  exists?
- How should future experiments report the harness setup, not just the model or
  final output?
