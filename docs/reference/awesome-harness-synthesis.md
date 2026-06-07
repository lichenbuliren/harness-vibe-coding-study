# Harness Engineering Foundations

This note distills the Foundations section from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
for this repository.

The goal is not to copy every source. The goal is to extract the concepts this
project will use when designing, evaluating, and evolving harness practices.

## Source Set

- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [Your Agent Needs a Harness, Not a Framework](https://www.inngest.com/blog/your-agent-needs-a-harness-not-a-framework)
- [Greenfield AI, Brownfield AI, and the Vibecode You Just Inherited](https://sawinyh.com/blog/greenfield-vs-brownfield-ai-codebases)
- [Harness Engineering for Language Agents: The Harness Layer as Control, Agency, and Runtime](https://www.preprints.org/manuscript/202603.1756)
- [Many Hands Engineering](https://github.com/mseeks/many-hands-engineering/blob/main/many-hands-engineering.pdf)

## Working Definition

Harness engineering is the design of the layer around the model that makes
agent work controllable, observable, recoverable, and evaluable.

For this project, the harness includes:

- instructions and repository-local context
- tools, skills, CLIs, MCP servers, browser access, and execution environments
- task decomposition, routing, sub-agent use, and handoff artifacts
- state, memory, traces, run records, retries, and cancellation
- deterministic checks, inferential reviews, evals, and human approval points
- codebase shape, documentation topology, and architecture constraints that make
  agent work easier or harder

The useful shorthand is:

```text
agent = model + harness
```

The model supplies capability. The harness shapes how that capability is aimed,
bounded, remembered, checked, and recovered.

## Core Claims

### 1. Harness Is A Systems Layer

Harness work is not prompt polish. It is the extra-model system that governs
what context is authoritative, which tools are available, how state persists,
what happens after failure, and how quality is judged.

Sources: [LangChain](https://blog.langchain.com/the-anatomy-of-an-agent-harness/),
[Thoughtworks](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html),
[HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents),
[Inngest](https://www.inngest.com/blog/your-agent-needs-a-harness-not-a-framework),
[CAR preprint](https://www.preprints.org/manuscript/202603.1756).

### 2. Start Simple, Add Agency Only When Needed

Predictable tasks should use direct calls or workflows. Open-ended work may need
agents that choose their own next step. This distinction matters because
unnecessary frameworks and autonomy hide prompts, tool calls, and failure modes.

Sources: [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
[Anthropic, Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

### 3. Durable State Beats Chat Continuity

Long-running work needs explicit state artifacts. Compaction helps, but it is
not enough on its own. Agents need repo-local plans, progress notes, handoffs,
git history, run records, and clean bootstrap paths.

Sources: [Anthropic, Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents),
[Anthropic, Long-running app design](https://www.anthropic.com/engineering/harness-design-long-running-apps),
[LangChain](https://blog.langchain.com/the-anatomy-of-an-agent-harness/).

### 4. Repositories Are Harness Surfaces

The repository itself is part of the harness. `AGENTS.md`, `CONTEXT.md`,
directory shape, local instructions, docs, tests, and decisions all affect how
well agents can act. Repo shape can become either an accelerator or a bottleneck.

Sources: [OpenAI](https://openai.com/index/harness-engineering/),
[Greenfield vs Brownfield AI Codebases](https://sawinyh.com/blog/greenfield-vs-brownfield-ai-codebases),
[HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents).

### 5. Controls Need Both Guides And Sensors

Feedforward guides shape behavior before work starts: instructions, specs,
architecture rules, task contracts, examples. Feedback sensors observe after or
during work: tests, linters, type checks, reviews, traces, screenshots, evals.

Good harnesses combine both. Guides without sensors rot. Sensors without guides
make agents repeat preventable mistakes.

Sources: [Thoughtworks](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html),
[OpenAI](https://openai.com/index/harness-engineering/).

### 6. Evaluation Should Be Separate From Generation

For hard or subjective work, a single agent generating and judging its own work
is weak. Better harnesses separate planner, generator, evaluator, verifier, and
human approval responsibilities when the task justifies it.

Sources: [Anthropic, Long-running app design](https://www.anthropic.com/engineering/harness-design-long-running-apps),
[Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).

### 7. Runtime Is Part Of The Harness

Retries, traces, state persistence, cancellation, restart, concurrency, and
step-level recovery are not afterthoughts. They are what turn fragile agent
loops into reliable workflows.

Sources: [Inngest](https://www.inngest.com/blog/your-agent-needs-a-harness-not-a-framework),
[CAR preprint](https://www.preprints.org/manuscript/202603.1756).

### 8. Multi-Agent Work Needs Governance, Not Just More Agents

Sub-agents are useful primarily for context isolation and bounded work. Many
agents sharing a repo create coordination cost, drift, trust questions, and
commons problems. A steward or orchestrator must define boundaries, approval
points, shared artifacts, and escalation paths.

Sources: [HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents),
[Many Hands Engineering](https://github.com/mseeks/many-hands-engineering/blob/main/many-hands-engineering.pdf),
[Inngest](https://www.inngest.com/blog/your-agent-needs-a-harness-not-a-framework).

## Foundation Model

This project will use a compact model with four layers:

```text
Control + Agency + Runtime + Substrate
```

### Control

Control defines what should happen and how correctness is checked.

Examples:

- `AGENTS.md`, `CONTEXT.md`, specs, plans, ADRs
- architecture constraints and directory rules
- deterministic checks: lint, typecheck, tests, structural checks
- inferential checks: code review, spec review, visual review, quality review
- human approval gates for irreversible or high-risk choices

### Agency

Agency defines how much freedom the system gives the model.

Examples:

- direct LLM calls for simple tasks
- workflows for predictable multi-step work
- agents for open-ended work
- planner / implementer / evaluator separation
- sub-agents for isolated research or bounded implementation

### Runtime

Runtime defines how work proceeds over time.

Examples:

- step lifecycle and status
- retries, cancellation, restart, and timeout behavior
- trace and run records
- handoff artifacts across context windows
- concurrency limits and conflict handling

### Substrate

Substrate is the repo and tool environment that makes the harness usable.

Examples:

- filesystem and git
- browser, shell, test runners, screenshots, logs
- local docs and progressive disclosure
- MCP servers, CLIs, skills, and external APIs
- repo topology, small files, feature boundaries, and local instructions

## Practices We Should Adopt

### Keep Root Instructions Short

`AGENTS.md` should be a map and operating contract, not an encyclopedia.
Durable details should live in focused docs under `docs/`, `agents/`,
`harness/`, `experiments/`, and `evals/`.

### Prefer Progressive Disclosure

Do not load every tool, article, MCP server, or rule into the active context.
Give agents enough context to choose the next source, then reveal details on
demand.

### Treat Filesystem And Git As Memory

Plans, specs, evolution logs, ADRs, run records, and handoffs should be
versioned. This lets future agents recover without trusting chat history alone.

### Add Mechanical Checks Before Social Checks

Use deterministic checks where possible: lint, typecheck, tests, docs link
checks, structural rules, and forbidden-directory checks. Use inferential review
for semantics, architecture judgment, and ambiguous quality.

### Separate Doing From Judging

For important work, use at least two roles:

- implementer or researcher
- evaluator, verifier, reviewer, or human steward

This does not mean every small task needs heavy process. It means high-risk or
stage-level work should not rely only on self-evaluation.

### Make Long Work Recoverable

Long-running work should have:

- a clear task contract
- current status
- progress notes or run records
- known blockers
- verification evidence
- next-step handoff

### Use Sub-Agents For Context Isolation

Sub-agents should receive bounded questions and return condensed findings with
source links or file references. They should not be used as theater or as a way
to avoid orchestration judgment.

### Design For Harnessability

Codebases become more harnessable when they have:

- small files
- explicit interfaces
- feature-oriented structure
- local instructions
- fast tests
- clear ownership boundaries
- low hidden coupling

Messy inherited code needs behavior locks and boundary repair before broad
autonomous refactoring.

## Anti-Patterns

- **Model-only thinking**: assuming a better model fixes a bad harness.
- **Tool sprawl**: exposing too many tools or MCP surfaces by default.
- **Monolithic instructions**: one giant rule file that rots and cannot be
  checked.
- **Feedback-only harnesses**: relying on tests and reviews while giving weak
  guidance up front.
- **Guide-only harnesses**: writing rules that are never verified.
- **Self-eval only**: letting the generating agent be the only judge of complex
  work.
- **Governance theater**: rules that exist in docs but never affect runtime.
- **Role theater**: naming sub-agents by role without giving them bounded,
  isolated work.
- **Fragile chat loops**: long tasks whose only state is conversation history.
- **Model-only benchmarks**: comparing outputs without reporting harness setup,
  tools, state, retries, and evaluation method.

## Implications For This Repository

### Immediate Documentation Shape

The next harness docs should likely be:

- `harness/foundations.md`: this synthesis
- `harness/primitives.md`: reusable harness primitives and when to use them
- `harness/session-lifecycle.md`: bootstrap, progress, handoff, and recovery
- `harness/verification.md`: deterministic checks, inferential checks, and
  approval gates
- `harness/tools-and-context.md`: progressive disclosure, tool policy, MCP/CLI
  boundaries
- `harness/multi-agent.md`: sub-agent use, orchestration, and shared-state rules

### Immediate Evaluation Questions

Before building harness tooling, this project should answer:

- What is the smallest useful run record?
- What must every long-running agent task preserve across context windows?
- Which checks are deterministic enough to run automatically?
- Which quality judgments require reviewer or human approval?
- What harness details must be reported when comparing agent results?

### Immediate Lab Questions

The first `lab/` project should be chosen to test:

- whether repo-local instructions help agents recover context
- whether sub-agent research improves synthesis quality
- whether deterministic docs checks catch drift
- whether evolution logs preserve shareable learning
- whether the harness model helps choose between workflow, agent, and
  multi-agent execution

## Source Reliability Notes

- The OpenAI, Anthropic, LangChain, Thoughtworks, HumanLayer, Inngest, and
  codebase taxonomy sources are practice-oriented engineering articles.
- The CAR/HarnessCard source is a 2026 preprint and should be treated as useful
  framing, not settled standard.
- The Many Hands source is a conceptual handbook for multi-agent engineering and
  governance, not an implementation specification.
