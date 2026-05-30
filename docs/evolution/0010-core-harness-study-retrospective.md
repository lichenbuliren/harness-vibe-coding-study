# 0010 - Core Harness Study Retrospective

## Stage

Core harness engineering study retrospective.

This record summarizes the stage covered by:

- `0002-harness-foundations-study.md`
- `0003-context-memory-working-state-study.md`
- `0004-guardrails-safe-autonomy-study.md`
- `0005-specs-agent-workflows-study.md`
- `0006-evals-observability-study.md`
- `0007-benchmarks-runtimes-study.md`

## Goal

Create a stage-level summary of what we learned from the core modules of
`walkinglabs/awesome-harness-engineering`, what methodology we used, what local
models we adopted, and how this learning changes the next phase of the project.

This retrospective exists because individual module notes are useful for detail,
but future sharing needs a single narrative entry that explains the whole
learning arc.

## Method

We used a repeated synthesis loop:

```text
Source inventory -> source-group research -> cross-source synthesis ->
project-local document -> evolution record -> commit
```

For early modules, sources were split across parallel subagents. When subagent
quota became unavailable, the process degraded to single-agent source review
while preserving the same grouping questions:

- What is the source's core claim?
- What harness primitives does it imply?
- What should become local project policy?
- What risks or anti-patterns should be recorded?
- What should future lab work validate?

The key methodological choice was to turn external reading into local operating
concepts instead of creating article summaries. Each module had to produce a
project-local artifact under `harness/` and a stage-level narrative record under
`docs/evolution/`.

## Learning Arc

### 1. Foundations

We started by defining harness engineering as the system around the model:
instructions, tools, context, state, runtime, verification, governance, and
repository shape.

Local model adopted:

```text
Control + Agency + Runtime + Substrate
```

This gave the project a way to discuss harness work without collapsing it into
prompt engineering.

### 2. Context, Memory, and Working State

We then clarified that context is a limited active working set, not a place to
store everything.

Local model adopted:

```text
prompt = active working set
filesystem = durable memory
git = versioned memory and recovery path
```

This shaped the project's preference for progressive disclosure, compact
handoffs, durable docs, git history, and output backpressure.

### 3. Guardrails and Safe Autonomy

The guardrails module shifted the safety framing away from constant approvals
and toward explicit boundaries.

Local principle adopted:

```text
more autonomy requires stronger boundaries
```

Safe autonomy means clear filesystem, network, credential, tool, prompt, and
verifier boundaries. Humans should approve meaningful risk and improve the
harness, not micromanage every low-risk command.

### 4. Specs, Agent Files, and Workflows

The workflow module connected repo-local instructions, specs, plans, validation,
and learning capture.

Local model adopted:

```text
Context -> Work -> Validation -> Learning
```

This made `AGENTS.md` the root operating contract while specs, plans, handoffs,
evals, and evolution entries became the durable workflow system around agent
work.

### 5. Evals and Observability

The evals module turned evaluation from a final-answer check into a feedback
loop.

Local model adopted:

```text
Task -> Run -> Trace -> Grade -> Diagnose -> Change -> Regression Gate
```

The main lesson is that a useful agent evaluation must preserve task, run,
trace, artifacts, grade, environment, and learning. Observability explains why a
score changed; evals decide whether the change is acceptable.

### 6. Benchmarks and Runtimes

The final core module clarified that benchmark scores are not pure model
measurements.

Local interpretation adopted:

```text
benchmark score = model + harness + environment
```

It also separated three implementation layers:

- framework: development abstractions
- runtime: durable execution infrastructure
- harness: operating system around agent behavior

The project decided to mine reference implementations for patterns before
adopting runtime dependencies.

## Consolidated Outcome

The core study produced a coherent harness engineering model:

```text
Harness engineering is the discipline of shaping the system around an AI agent
so its work becomes context-aware, bounded, observable, recoverable, verifiable,
and improvable over time.
```

The project now treats harness work as a stack:

1. **Repository substrate**
   - readable directory structure
   - durable docs
   - git history

2. **Operating contract**
   - `AGENTS.md`
   - `CONTEXT.md`
   - local rules and precedence

3. **Workflow system**
   - specs
   - plans
   - handoffs
   - validation
   - evolution logs

4. **Safety system**
   - tool boundaries
   - sandbox assumptions
   - prompt-injection controls
   - verifier gates

5. **Feedback system**
   - run records
   - traces
   - eval rubrics
   - benchmark interpretation
   - regression gates

6. **Future runtime layer**
   - adapters
   - executable checks
   - durable runtime only when needed

## Artifacts Produced

Harness methodology:

- `harness/foundations.md`
- `harness/context-memory.md`
- `harness/guardrails-safe-autonomy.md`
- `harness/specs-agent-workflows.md`
- `harness/evals-observability.md`
- `harness/benchmarks.md`
- `harness/runtimes-reference-implementations.md`

Shareable summary:

- `docs/harness-engineering-summary-zh.md`

Evolution records:

- `docs/evolution/0002-harness-foundations-study.md`
- `docs/evolution/0003-context-memory-working-state-study.md`
- `docs/evolution/0004-guardrails-safe-autonomy-study.md`
- `docs/evolution/0005-specs-agent-workflows-study.md`
- `docs/evolution/0006-evals-observability-study.md`
- `docs/evolution/0007-benchmarks-runtimes-study.md`

Validation preparation that followed the study:

- `docs/workflows/validation-phase-learning-plan.md`
- `harness/runs/run-record-schema.md`
- `evals/rubrics/harness-validation-rubric.md`
- `experiments/task-samples/agent-first-project-tasks.md`

## Shareable Takeaways

1. **Harness is bigger than prompt engineering.**
   Prompt is one control surface. Harness also includes context, tools, state,
   runtime, evals, guardrails, and repository shape.

2. **Context should be managed as a working set.**
   Durable memory belongs in files and git, not only in the live prompt.

3. **Autonomy needs boundaries, not constant interruption.**
   Approval prompts are a weak substitute for least-privilege tools, sandboxing,
   and verifier gates.

4. **Specs and workflows turn intent into recoverable work.**
   Agent work becomes more stable when instructions, plans, validation, and
   learning are durable project artifacts.

5. **Evals need traces.**
   Pass/fail tells us whether something worked. Trace evidence tells us why and
   what to improve.

6. **Benchmarks measure systems.**
   For agentic coding and tool use, benchmark results reflect the model, the
   harness, and the environment together.

7. **Reusable methodology should wait for lab evidence.**
   The likely reusable package is Template + Skill + Playbook, but extraction
   should happen after the lab validates which parts actually help.

## What Changed In The Project

Before this study, the project mainly had a proposed agent-first directory
structure.

After this study, the project has:

- a vocabulary for harness engineering
- a set of local methodology documents
- a shareable Chinese summary
- stage-level evolution records
- a validation plan
- a run-record schema
- a first rubric for evaluating harness quality
- local task samples for mini-evals

This shifts the project from learning by reading to learning by validation.

## Next Phase

The next phase is lab validation:

```text
Run Record -> Local Evals -> Lab Project -> Pattern Extraction
```

The first lab work should not try to prove everything. It should test a small
number of concrete claims:

- Can a fresh agent read the project and understand the current phase?
- Does the run-record schema make work recoverable?
- Do local mini-evals catch missed obligations?
- Does the evolution log capture meaningful learning without becoming a
  changelog?
- Which parts of the methodology are useful enough to later become a reusable
  template, skill, or playbook?

## Open Questions

- Which concrete lab project should be used for first validation?
- Should the first executable local eval target directory contracts, evolution
  logging, or verification-before-completion?
- What should the first manual run record look like in practice?
- Which parts of the current methodology are likely too heavy for small
  projects?
- When should this project start extracting a reusable Template + Skill +
  Playbook package?
