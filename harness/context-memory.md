# Context, Memory, and Working State

This note distills the Context, Memory & Working State module from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
for this repository.

The goal is to define how agents should manage finite context, durable memory,
working state, compaction, and noisy tool output.

## Source Set

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [Context Engineering for Coding Agents](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [Advanced Context Engineering for Coding Agents](https://www.humanlayer.dev/blog/advanced-context-engineering)
- [Context-Efficient Backpressure for Coding Agents](https://www.humanlayer.dev/blog/context-efficient-backpressure)
- [OpenHands Context Condensensation for More Efficient AI Agents](https://openhands.dev/blog/openhands-context-condensensation-for-more-efficient-ai-agents)
- [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

## Working Definition

Context engineering is the design of what enters the model's active working set.
It includes prompts, instructions, tools, message history, retrieved material,
runtime state, failures, summaries, and external memory references.

For this project:

```text
prompt = active working set
filesystem = durable memory
git = versioned memory and recovery path
```

Good context work is not about maximizing tokens. It is about making the live
context small, relevant, current, recoverable, and cheap enough to keep using.

## Core Claims

### 1. Context Is A Finite Attention Budget

The useful constraint is not just context-window size. It is attention quality.
Too much history, too many tools, and too much low-value output make agents
slower, more expensive, and less reliable.

Sources: [Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
[Thoughtworks](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html),
[HumanLayer](https://www.humanlayer.dev/blog/advanced-context-engineering).

### 2. Context Engineering Is Broader Than Prompt Engineering

Prompt text is only one part of context. Tools, rules, sub-agents, MCP servers,
hooks, message history, retrieved docs, filesystem state, and command output all
compete for the same model attention.

Sources: [Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
[Thoughtworks](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html).

### 3. Durable Memory Should Live Outside The Window

Long tasks should not rely on chat history alone. Plans, decisions, progress
notes, run records, handoffs, failing tests, and important file references should
live in the repository or another durable store.

Sources: [Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus),
[Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
[HumanLayer](https://www.humanlayer.dev/blog/advanced-context-engineering).

### 4. Progressive Disclosure Beats Preloading

Agents should start with a compact map and fetch details when needed. The root
instruction file should point to authoritative docs instead of copying every
rule and exception into the active context.

Sources: [Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
[HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md),
[Thoughtworks](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html).

### 5. Compaction Needs Restore Guarantees

Fresh context windows are useful, but only when they restart from a compact
artifact that preserves goal, progress, next actions, blockers, critical files,
failing tests, and current approach.

Sources: [OpenHands](https://openhands.dev/blog/openhands-context-condensensation-for-more-efficient-ai-agents),
[HumanLayer](https://www.humanlayer.dev/blog/advanced-context-engineering),
[Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

### 6. Command Output Needs Backpressure

Passing logs should collapse to concise success markers. Failures should surface
the smallest useful failure body. Deterministic output shaping is better than
letting the model guess which text to ignore.

Sources: [HumanLayer](https://www.humanlayer.dev/blog/context-efficient-backpressure),
[Thoughtworks](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html).

### 7. Failure Evidence Is Part Of Working State

Failed tests, stack traces, bad assumptions, wrong turns, and rejected
hypotheses are useful state. They should be retained in an appropriate durable
place instead of scrubbed away.

Sources: [Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus),
[HumanLayer](https://www.humanlayer.dev/blog/advanced-context-engineering).

### 8. Root Instructions Should Stay Small

`AGENTS.md` should explain WHAT, WHY, and HOW at the repository level. It should
not become a hotfix bucket for every behavior complaint. Detailed guidance
belongs in focused docs and should be referenced by path.

Sources: [HumanLayer, CLAUDE.md guidance](https://www.humanlayer.dev/blog/writing-a-good-claude-md),
[Thoughtworks](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html).

## Memory Tiers

### Active Working Set

The active prompt/context window.

Keep:

- current goal
- current constraints
- immediate plan
- relevant source snippets
- current failing evidence
- next action

Avoid:

- full transcripts
- passing logs
- whole articles when links and summaries suffice
- stale assumptions
- broad tool inventories unrelated to the task

### Session Working Memory

Short-lived notes for an active task.

Use for:

- current plan
- decisions made during the task
- blockers
- files touched
- commands run
- verification state

This can live in the conversation, local notepad, or a task-specific progress
file when the task is long enough to need recovery.

### Durable Project Memory

Versioned repository files.

Use for:

- `CONTEXT.md`: current project phase and long-term assumptions
- `AGENTS.md`: root operating contract
- `docs/evolution/`: stage-level narrative learning
- `decisions/`: concise decision records
- `harness/`: harness methodology and engineering guidance
- `experiments/`: what was tried and what happened
- `evals/`: how quality is judged
- `agents/handoffs/`: reusable handoff formats

## Context Assembly Rules

1. Start from the smallest authoritative map: `AGENTS.md`, `CONTEXT.md`, and the
   relevant directory index.
2. Load task-specific docs only when the task needs them.
3. Prefer links, file paths, and short summaries over large pasted context.
4. Keep the current objective near the end of the active context during long
   work.
5. Use sub-agents to isolate large research or exploration tasks, then return
   condensed findings.
6. Preserve source links for claims imported from external articles.
7. Do not let copied instructions override local project context without review.

## Working-State Format

For long-running tasks, preserve a compact state block with:

```md
## Current Goal

One-sentence objective and success condition.

## Current Plan

The active approach and next concrete action.

## Verified Facts

Facts confirmed by files, commands, tests, docs, or source links.

## Decisions Made

Choices made during this task and why.

## Open Questions

Unknowns that still matter.

## Blockers / Risks

What could invalidate or delay the current approach.

## Critical Files

Paths that future agents must inspect before continuing.

## Verification State

Commands run, results, and remaining checks.

## Resume Instructions

What the next agent should do first.
```

## Compaction Policy

Compact when:

- the active context has accumulated many tool outputs
- the work crosses a phase boundary
- a fresh agent/thread/session will continue the work
- a long-running task reaches a checkpoint
- the next step requires clean reasoning more than transcript history

Keep:

- goal and success condition
- current plan and next action
- decisions and rationale
- blockers and unresolved questions
- critical files and source links
- current failures and verification evidence

Drop or summarize:

- passing logs
- repeated status messages
- large source dumps already represented by file paths or URLs
- obsolete hypotheses
- tool output that did not affect the decision path

Do not compact away:

- failing tests
- stack traces needed for diagnosis
- file names and line references
- rejected approaches that future agents might otherwise retry
- human constraints or approval boundaries

## Backpressure Rules

Prefer command patterns that keep output useful:

- fail fast when debugging one issue
- collapse passing output to a concise success marker
- show detailed output on failure
- filter stack traces to relevant frames when possible
- keep full logs in files when they are too large for the active context

Avoid:

- rerunning long commands just to recover truncated output
- piping complex failures through `head` or `tail` when the middle may matter
- dumping full passing test logs into the active context
- asking the model to inspect unstructured noise when a parser or command flag
  can produce a better signal

## Repo-Local Instruction Rules

`AGENTS.md` should remain:

- short
- broadly applicable
- stable across tasks
- a map to deeper docs

Put specialized guidance in focused files:

- harness methodology in `harness/`
- agent roles and handoffs in `agents/`
- quality gates in `evals/`
- experiment records in `experiments/`
- decisions in `decisions/`
- stage learning in `docs/evolution/`

Do not use root instructions as a hotfix bucket. If an agent behavior problem
appears, first decide whether it belongs in a reusable harness doc, an eval
checklist, a local directory rule, or a one-off task instruction.

## Context Loading Modes

Use three loading modes:

- **Human-triggered**: user explicitly points to a source or asks to use it.
- **Agent-triggered**: agent decides a doc/tool/source is relevant and loads it
  on demand.
- **Runtime-triggered**: deterministic harness logic injects required state,
  checks, or summaries.

The more automatic a context source is, the shorter and more stable it should
be.

## Anti-Patterns

- Loading all relevant articles before knowing the task.
- Treating context window size as a substitute for curation.
- Letting stale assumptions remain near the active task.
- Copying external instruction templates without local adaptation.
- Condensing away blockers, failing tests, or critical file paths.
- Using root instructions for task-local reminders.
- Relying on new chat as the recovery strategy.
- Letting command output decide the context budget.

## Checklist For Long-Horizon Tasks

Before starting:

- Is the current goal explicit?
- Are authoritative docs identified?
- Are irrelevant docs/tools left unloaded?
- Is there a place to store durable state?

During work:

- Are failures retained somewhere recoverable?
- Is passing output collapsed?
- Are large artifacts referenced by path or URL?
- Are decisions recorded before they become invisible assumptions?

Before handoff or compaction:

- Is the next action clear?
- Are blockers and risks written down?
- Are critical files listed?
- Is verification state recorded?
- Can a fresh agent resume without reading the whole transcript?

## Implications For This Repository

- `CONTEXT.md` should be updated only for durable phase/context changes.
- `docs/evolution/` should capture stage-level learning, not task logs.
- `harness/context-memory.md` should remain a reusable policy, not current task
  state.
- Future long-running task state should likely live under `agents/handoffs/`,
  `harness/runs/`, or an experiment/report file depending on the work type.
- We should eventually define a smallest useful run record that includes context
  sources, compaction events, failures retained, and verification evidence.

## Source Reliability Notes

- These sources are practice-oriented engineering essays and product writeups,
  not formal standards.
- OpenHands reports empirical cost/success data for condensation on a SWE-bench
  subset; treat it as useful evidence, not universal benchmark truth.
- Product-specific examples such as Claude Code or OpenHands should be mapped to
  this repository as patterns, not copied as assumptions about a specific tool.
