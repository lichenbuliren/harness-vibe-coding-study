# 0006 - Evals and Observability Study

## Stage

Harness engineering best-practice exploration.

## Goal

Study the Evals & Observability module from
`walkinglabs/awesome-harness-engineering` and turn it into project-local
guidance for measuring, tracing, and improving AI-agent work.

## Method

We started with the same parallel-subagent learning method used in earlier
modules, splitting sources into:

- OpenAI and OpenHands eval methodology
- observability frameworks, standards, and tools
- Anthropic and LangChain deep-agent eval practice

The subagent runs hit the current usage limit, so the method degraded to a
single-agent source review. The fallback preserved the same source grouping and
synthesis questions:

- What should be measured?
- What trace evidence explains the score?
- What should become a local harness primitive?
- What failure modes and anti-patterns should be avoided?

## Decision

Treat evals and observability as a single feedback loop:

```text
Task -> Run -> Trace -> Grade -> Diagnose -> Change -> Regression Gate
```

Evals answer whether a harness change improved behavior. Observability answers
why the behavior changed and what should be modified next.

## Outcome

The project now has a dedicated Evals and Observability note that defines:

- evaluation primitives
- observability primitives
- baseline comparison rules
- deterministic-first grading
- trace grading guidance
- environment-control requirements
- first local eval candidates for this repository
- anti-patterns for agentic coding evals

## Artifacts

- `harness/evals-observability.md`
- `harness/index.md`
- `docs/evolution/0006-evals-observability-study.md`

## Shareable Takeaway

For harness engineering, "the agent passed" is too weak. A usable evaluation
record needs task, run, trace, artifacts, grade, environment, and learning.

The evaluation system should be small at first, but it must be comparative and
repeatable. A skill, prompt, middleware, or workflow rule is only a hypothesis
until a baseline comparison shows it helps.

## Open Questions

- When should this project introduce executable eval scripts instead of
  documentation-only checks?
- What trace schema should `harness/runs/` use before adopting a full
  observability backend?
- Which first local eval should become the canonical regression gate for future
  agents?
