# Evals and Observability

This note synthesizes the Evals & Observability module from
`walkinglabs/awesome-harness-engineering`.

## Core Claim

Harness engineering needs two complementary feedback systems:

- **Evals prove whether agent behavior improved.**
- **Observability explains why a run succeeded, failed, regressed, or became
  expensive.**

For agentic coding work, final-output grading is not enough. The harness should
capture the task, environment, trace, artifacts, verifier result, runtime cost,
and follow-up learning so the team can compare changes over time.

## Local Model

Use this project-local loop:

```text
Task -> Run -> Trace -> Grade -> Diagnose -> Change -> Regression Gate
```

- `Task`: a bounded request with a clear expected artifact or outcome.
- `Run`: one attempt in a controlled environment.
- `Trace`: the structured record of prompts, model calls, tool calls,
  commands, handoffs, guardrails, errors, and artifacts.
- `Grade`: deterministic checks first, rubric/LLM grading only when needed.
- `Diagnose`: trace review that identifies failure modes and cost drivers.
- `Change`: a targeted harness edit, such as prompt, tool, middleware, skill,
  memory, or context-injection change.
- `Regression Gate`: a repeatable suite that prevents the same failure from
  returning.

## Evaluation Primitives

Agent evals should be described with stable primitives:

- `dataset`: a collection of task samples and expected outcomes.
- `task`: one bounded unit the agent can attempt in one run.
- `baseline`: the comparison condition, such as no-skill, old prompt, old
  toolset, or previous harness.
- `trace`: the full execution record, not just the final answer.
- `artifact`: files, patches, reports, screenshots, logs, or other outputs
  created by the run.
- `verifier`: deterministic code or commands that decide whether the artifact
  meets the task.
- `grader`: deterministic, rubric-based, LLM-as-judge, or human review logic.
- `metric`: pass rate, cost, latency, step count, token use, retries, tool
  errors, safety violations, or review survival.
- `run record`: the durable summary linking task, trace, artifacts, grade, and
  lessons.

## Observability Primitives

Observability should make agent behavior replayable and comparable:

- `span`: a timed operation, such as model call, tool call, command, handoff, or
  verifier step.
- `event`: a meaningful instant, such as guardrail hit, retry, approval,
  timeout warning, failure classification, or completion attempt.
- `attribute`: structured metadata attached to spans or events, such as model,
  role, tool name, prompt revision, task id, sandbox id, token count, and cost.
- `metric`: aggregate health signals, such as cost per successful task, latency
  per step, infra error rate, and verifier pass rate.
- `session replay`: a human-readable reconstruction of the run.
- `trace diff`: comparison between two attempts or harness versions.

OpenTelemetry's GenAI semantic conventions are useful as a portability target
because they define common signal types for GenAI events, exceptions, metrics,
model spans, and agent spans.

## Practical Rules

### Start With Bounded Tasks

Each early eval should have:

- one task prompt
- one expected artifact
- one deterministic verifier
- one baseline condition
- one run record

Small task sets are acceptable at the beginning. They are useful when they are
drawn from real work and are easy to rerun.

### Compare Against a Baseline

Never claim that a skill, prompt, workflow, or guardrail helps without a
comparison. The minimum useful comparison is:

- old harness versus new harness
- no-skill versus skill-enabled
- old model/harness pair versus new model/harness pair

Record pass/fail first, then compare runtime, token use, retries, and trace
quality.

### Prefer Deterministic Verifiers

Use deterministic verifiers when the expected outcome can be checked by code:

- files exist in the required path
- JSON matches schema
- tests pass
- report includes required fields
- generated code compiles
- no forbidden dependency or directory was introduced

Use LLM graders for dimensions that are genuinely hard to encode, such as
whether an answer explains tradeoffs clearly. Keep those rubrics narrow and
isolated by dimension.

### Grade the Trace, Not Only the Answer

Trace grading is the right level when the failure is behavioral:

- wrong tool selected
- required handoff skipped
- safety policy violated
- verifier ignored
- repeated retries without new information
- excessive context or token use
- prompt/routing change altered the workflow

This matters because two runs can produce the same final artifact while one is
far more brittle, expensive, or unsafe.

### Treat Environment as Part of the Eval

Agentic coding evals are end-to-end system tests. CPU, memory, timeout,
network, dependency cache, sandbox provider, concurrency, and API latency can
all affect the score.

Each run record should capture:

- model and harness revision
- prompt/tool/skill revisions
- sandbox provider and resource limits
- timeout and retry policy
- dependency/cache state when relevant
- date, runner, and concurrency level

Do not compare benchmark-style numbers unless these conditions are comparable.

### Use Trace Analysis to Improve the Harness

The improvement loop should focus on failure modes found in traces:

- missing context at run start
- weak build-verify loop
- unclear task acceptance criteria
- brittle tool path
- missing time-budget signal
- over-broad or over-constraining skill
- lack of recovery after failed commands

Harness changes should be targeted and then rerun against the same eval set.

## First Local Evals

For this repository, the first useful evals should protect the methodology
itself rather than application behavior:

1. **Directory contract eval**
   - Task: ask an agent to add a stage-level methodology artifact.
   - Verifier: required directory receives the file; forbidden first-stage
     directories are not created.

2. **Evolution log eval**
   - Task: complete a stage-level learning outcome.
   - Verifier: `docs/evolution/` gets a dated/numeric stage record with method,
     outcome, artifacts, and shareable takeaway.

3. **Source synthesis eval**
   - Task: study a module from an external repository and synthesize it locally.
   - Verifier: harness note includes source links, project-local primitives,
     practices, risks, and open questions.

4. **Verification-before-completion eval**
   - Task: make a documentation change.
   - Verifier: structure inspection and `git status --short` are run before the
     completion report.

These evals can later move from documentation-only checks into scripts under a
planned harness automation phase.

## Anti-Patterns

- Judging an agent only by the final answer.
- Reporting a pass rate without baseline, environment, or sample count.
- Using one broad LLM judge for many unrelated grading dimensions.
- Treating benchmark deltas of a few points as meaningful without setup
  control.
- Letting observability capture sensitive prompt/user content by default.
- Adding a skill or prompt rule because it sounds useful, then never measuring
  whether it helps.
- Overfitting a harness to one benchmark task and harming general behavior.
- Keeping traces but not turning repeated failures into regression cases.

## Source Notes

- OpenAI's agent eval guidance frames traces, graders, datasets, and eval runs
  as a continuous improvement system for agent quality.
- OpenAI trace grading emphasizes workflow-level grading for tool choice,
  handoffs, instruction compliance, safety policy, and prompt/routing changes.
- OpenHands' skill eval playbook uses bounded tasks, deterministic verifiers,
  no-skill baselines, pass/fail comparison, runtime comparison, and trace
  review.
- Inspect AI provides a concrete eval framework with datasets, solvers,
  scorers, logs, tools, agents, sandboxing, and log viewing.
- OpenTelemetry GenAI semantic conventions provide shared names and structures
  for GenAI events, exceptions, metrics, model spans, and agent spans.
- AgentOps and agenttrace illustrate the operational need for session replay,
  cost tracking, trace inspection, latency/tool-failure detection, and
  attempt-to-attempt comparison.
- OpenHands' verification work points toward trajectory-level critics trained
  on production traces and sparse real-world outcomes such as merge/survival.
- Anthropic's eval guidance highlights trajectories, thoughtful grader design,
  deterministic-first grading, and the danger of grader bugs or ambiguous task
  specs.
- Anthropic's infrastructure-noise analysis shows that resource limits,
  timeouts, sandbox enforcement, and runtime setup can move agentic coding eval
  scores enough to distort conclusions.
- LangChain's deep-agent eval practice groups evals by what they test, runs
  targeted subsets, traces every run, and measures both correctness and
  efficiency.
- LangChain's harness-engineering case shows that prompt, tool, middleware,
  context-injection, self-verification, and trace-analysis changes can improve
  benchmark performance while keeping the model fixed.

## Sources

- https://developers.openai.com/blog/eval-skills/
- https://platform.openai.com/docs/guides/agent-evals
- https://platform.openai.com/docs/guides/evaluation-best-practices
- https://platform.openai.com/docs/guides/trace-grading
- https://openhands.dev/blog/evaluating-agent-skills
- https://openhands.dev/blog/20260305-learning-to-verify-ai-generated-code
- https://inspect.aisi.org.uk/
- https://opentelemetry.io/docs/specs/semconv/gen-ai/
- https://github.com/AgentOps-AI/agentops
- https://github.com/luoyuctl/agenttrace
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- https://www.anthropic.com/engineering/infrastructure-noise
- https://blog.langchain.com/evaluating-deep-agents-our-learnings/
- https://blog.langchain.com/improving-deep-agents-with-harness-engineering/
