# Harness Adoption Playbook

This playbook describes how to introduce harness engineering into a real
project, team, or organization.

It answers: where do I start, what do I do first, what traps should I avoid,
and what does success look like at each stage?

## Core Principle

Do not try to adopt the entire harness methodology at once.

The harness methodology in this repository represents a mature, comprehensive
system. Adopting it piece by piece — each piece when the project is ready for
it — is more effective than attempting a big-bang implementation.

The adoption sequence follows the maturity layers:

```text
entry surface → knowledge structure → harness model → task recovery →
verification → eval & trace → learning capture
```

Each layer creates the foundation the next layer depends on. Skipping layers
produces fragile harness infrastructure.

## Stage 0: Pre-Harness

Before introducing any harness methodology, the project has:

- A `README.md` that developers read.
- Maybe a `CLAUDE.md` or `AGENTS.md` with scattered instructions.
- Agent work depends entirely on chat continuity and human guidance.
- No durable state, no verification beyond CI, no post-task analysis.

### What To Do First

1. **Write a two-file entry surface**: a short `AGENTS.md` (under 100 lines)
   and a one-page `CONTEXT.md`. The `AGENTS.md` should answer "what is this
   project" and "where should I start reading." The `CONTEXT.md` should answer
   "what phase are we in" and "what are the non-goals."

2. **Define one knowledge context**: pick the domain the team works on most
   frequently and write a single `CONTEXT.md` in a `docs/context/` directory.
   Include glossary, boundary, source-of-truth, and at least one
   "cannot assume" rule.

3. **Add a delivery rule to AGENTS.md**: one sentence: "Do not report
   completion until the change has been tested and verified." That is the
   seed of the agent delivery contract.

### Success Criterion

An agent can start a fresh session, read `AGENTS.md` and `CONTEXT.md`, and
correctly describe what the project is and what it is working on.

### Typical Resistance

- "We don't have time to write docs for the AI."
- "The agent should just read the code."
- "Our README is good enough."

Counter-argument: a 20-line `AGENTS.md` and a 30-line `CONTEXT.md` take 30
minutes to write and save hours of agent confusion. The code cannot answer
"what phase are we in" or "what are our non-goals."

### Minimum Time Investment

1-2 hours for initial setup.

## Stage 1: Growing

The project has entry surface and some knowledge structure. Agent work is more
consistent but still fragile for long tasks.

### What To Do

1. **Expand to 3-5 knowledge contexts**: the most frequently modified domains
   each get a `docs/context/<domain>/CONTEXT.md`.

2. **Add a `CONTEXT-MAP.md`**: a one-page map showing which contexts exist,
   their boundaries, and their relationships. This helps agents route to the
   right knowledge surface.

3. **Introduce a simple `harness/` directory**: start with one file —
   `harness/agent-delivery-contract.md` from the template. This establishes
   the expectation that meaningful work should be tested, verified, and
   recorded.

4. **Add run records for important tasks**: create `harness/runs/` with one
   or two run records for tasks that produced useful learning. Use the
   template's `run-record-schema.md`.

### Success Criterion

Agents consistently find domain knowledge through the context map. Meaningful
work is routinely accompanied by a run record.

### Typical Resistance

- "Why do we need a separate directory for harness? Just put it in AGENTS.md."
- "Run records take too long to write."

Counter-argument: AGENTS.md becomes unmanageable past 100 lines. Run records
are evidence for future agents and for evaluations — they reduce, not increase,
total time spent debugging the same class of problem.

### Minimum Time Investment

4-8 hours over 1-2 weeks.

## Stage 2: Established

The project has documented rules for harness primitives and some are wired into
agent behavior.

### What To Do

1. **Adopt the full `harness/` module set**: import the template's harness
   docs (primitives, verification, session-lifecycle, tools-and-context,
   multi-agent) and tailor them to the project's runtime.

2. **Wire verification into delivery**: update `AGENTS.md` to reference the
   delivery contract. Agents should run relevant deterministic checks before
   reporting completion.

3. **Introduce session lifecycle discipline**: for multi-session work, agents
   should write handoff packets and progress notes. The project should have an
   example handoff in `agents/handoffs/`.

4. **Add at least one eval checklist**: pick the most common failure mode and
   write a `evals/checklists/` entry that gates it. This could be as simple as
   "run `git status` and verify no untracked files before claiming completion."

5. **Write the first decision record**: identify one tradeoff that was settled
   and record it in `decisions/`. This sets the precedent for ADR use.

### Success Criterion

Agents follow a delivery loop consistently. Run records exist for most
meaningful tasks. At least one eval checklist is used as a quality gate.

### Typical Resistance

- "This is too much process for a small team."
- "The templates are designed for a research project, not our production code."

Counter-argument: the process scales with risk. Not every task needs a run
record, handoff, and eval checklist. The harness methodology explicitly says:
"use the minimum needed for this task." The template is a reference, not a
requirement.

### Minimum Time Investment

Ongoing — approximately 1-2 hours per week for documentation maintenance.

## Stage 3: Verified

The project has all harness layers active and at least some are verified by
checklists or eval tasks.

### What To Do

1. **Wire the learning loop**: when the user corrects an agent or a review
  reveals a process gap, the agent should invoke the standard capture loop
  or success pattern capture. At least one evolution entry should exist.

2. **Add experiment capability**: create `experiments/task-samples/` with a
   few reproducible task samples. Run at least one experiment comparing
   "before" and "after" a harness change.

3. **Regular maturity assessments**: run the maturity assessment framework
   quarterly. Track how scores change over time.

### Success Criterion

The project improves measurably over time. Agent failures that were common 3
months ago are now prevented by harness rules. Success patterns are actively
captured and shared.

### Typical Resistance

- "We don't have a baseline to compare against."
- "Evals are too expensive to run regularly."

Counter-argument: start with qualitative baselines. One evolution entry per
month, one run record per meaningful task, one checklist gate — that is enough
to show trend. Evals can be as cheap as a grep command.

### Minimum Time Investment

3-5 hours per month for maintenance and improvement.

## Stage-Skipping Risks

| Skip | Risk |
|------|------|
| Skip Stage 0 (no entry surface) | Agent misreads the project scope, wastes context on wrong files. |
| Skip Stage 1 (no knowledge structure) | Agents repeat the same domain discovery in every session. |
| Skip Stage 2 (no verification) | The project has rules but cannot enforce them. Quality depends on the model's self-checking. |
| Skip Stage 3 (no evals or learning) | Improvement is anecdotal. The project cannot tell whether harness changes actually help. |

## Adoption In Different Contexts

### Single Project (Individual Developer)

Start: Stage 0, stay at Stage 1 for most tasks.
Escalate to Stage 2 only for long-running or high-risk tasks.
Stage 3 is optional — learning capture helps if you share the project with
other developers or agents.

### Single Project (Team)

Start: Stage 0-1, aim for Stage 2 within 1-2 months.
Stage 3 is valuable for cross-team onboarding and reducing repeated failures.
Assign one team member as harness steward to own the iteration loop.

### Multi-Repo Organization

Start: Stage 0 for each repo, with a shared harness template across repos.
Stage 1-2 per repo as needed, with a central harness team providing templates
and guidance.
Stage 3 for the highest-traffic repos first; lower-traffic repos can stay at
Stage 2.

The key difference from single-project adoption: the harness template must be
maintained centrally. Each repo customizes, but the shared methodology evolves
in one place.

## Measuring Adoption Progress

| Metric | Stage 0 | Stage 1 | Stage 2 | Stage 3 |
|--------|---------|---------|---------|---------|
| AGENTS.md lines | < 30 | < 60 | < 100 | < 100, with references |
| Knowledge contexts | 0 | 3-5 | All critical domains | All domains, periodically reviewed |
| Run records | 0 | 1-2 | Per meaningful task | Per meaningful task, reviewed |
| Eval checklists | 0 | 0 | 1 | 3+ |
| Evolution entries | 0 | 0 | 1 | Per quarter |
| Handoff packets | 0 | Optional | Cross-session standard | Cross-session standard |

## Relationship To Other Harness Docs

| Doc | Connection |
|-----|-----------|
| `primitives.md` | Defines the building blocks this playbook installs stage by stage. |
| `maturity-assessment.md` | The assessment framework this playbook's stages map to. |
| `agent-delivery-contract.md` | The first harness module to import in Stage 1. |
| `agent-learning-loop.md` | The key practice to wire in Stage 2. |
| `success-patterns.md` | The key practice to wire in Stage 3. |
| Template (`templates/agent-first-living-lab/`) | The reference implementation this playbook tailors to real projects. |

## Anti-Patterns

- **Big-bang adoption**: trying to implement all harness layers in one week.
  The methodology is designed to be adopted incrementally.
- **Copy-paste templates without customization**: importing the full template's
  harness docs without removing the layers the project is not ready for.
- **Process over value**: writing rules that are never verified or followed.
  A written rule is not an implemented harness.
- **Blame-the-harness**: attributing every agent failure to a harness gap.
  Some tasks are genuinely hard and will fail regardless of the harness.
- **Chasing Stage 3 prematurely**: investing in evals and experiments before
  the entry surface and knowledge structure are solid.
