# Tools And Context

This module defines how this project manages tool access and context loading.

It answers: what tools are available, when should each be used, how does
context get loaded, and how does the agent decide what to include or exclude.

## Core Claim

Tools and context are not separable categories. Every tool call changes the
agent's context by adding new information. Every context decision is a tool
selection decision.

The guiding principle is **progressive disclosure**: give the agent the minimum
context it needs to choose the next action, then reveal details on demand.

## Progressive Disclosure

### Context Hierarchy

Information should be organized in layers:

```text
Layer 0: Entry (AGENTS.md + CONTEXT.md)
  Small enough to fit in every session. Navigation only.
  
Layer 1: Index (harness/index.md, docs/index.md, evals/index.md)
  Directory-level maps. Read when entering a new functional area.
  
Layer 2: Module (harness/primitives.md, evals-observability.md, etc.)
  Full methodology documents. Read when the task requires that specific
  knowledge.
  
Layer 3: Detail (run records, checklists, rubrics, templates, references)
  Reference material. Read only when executing a task that needs it.
```

### Loading Rules

```
entry → task intake → identify needed layers → load layer 0 → load layer 1
for relevant areas → load layer 2 for the specific task → load layer 3 only
during execution
```

Do not load everything at the start. A request to "read the repo" should
start with Layer 0 and Layer 1 indexes, not every document in every directory.

### When To Skip Loading

- The task is small and well-understood (e.g., rename a file, fix a typo).
- The agent already has the relevant context from a recent read.
- The file is known to be stale or superseded.

### Context Budget Heuristics

| Task Size | Reasonable Read Budget |
|-----------|----------------------|
| One-step fix | 1-3 files, skim only |
| Known-pattern implementation | 3-8 files, targeted reads |
| Exploratory or cross-domain work | 8-20 files, progressive reads |
| Full domain discovery | 20-50 files over multiple sessions |

These are heuristics, not limits. The key signal is context pressure: if the
agent cannot hold the main goal, bootstrapping, evidence, and next step
simultaneously, it has read too much without committing or checkpointing.

## Tool Policy

### Tool Categories

| Category | Examples | Default Availability |
|----------|----------|---------------------|
| **Read-only** | `cat`, `rg`, `ls`, `git log`, code graph tools | Always available |
| **Search** | `rg --files`, `grep`, codegraph_search, codegraph_context | Always available |
| **Write-safe** | `sed -i`, `apply_patch`, `git add`, `git commit` | Available for planned changes |
| **Write-risky** | `exec_command` with write flags, branch push, npm/pnpm publish | Requires verification before use |
| **Destructive** | `git reset --hard`, `rm -rf`, force push | Requires user approval |
| **External** | MCP tools that call external APIs, browser, Chrome | Available but results may change agent state |

### Tool Selection Rules

1. **Prefer fast tools for exploration**: `rg`, `codegraph_search`, `ls`
   before `cat`, `codegraph_node`, or full-read operations.
2. **Prefer targeted reads over broad scans**: use `nl` and line-range reads
   instead of `cat` for large files.
3. **Prefer structural tools for architecture questions**: codegraph tools
   (search, context, trace) over grep-and-read loops.
4. **Parallelize independently**: use `multi_tool_use.parallel` for independent
   read operations.
5. **Backpressure on output**: for commands that produce long output, use
   `max_output_tokens` or pipe to a file and reference the path.

### When To Use Browser Tools

Browser and Chrome tools should be used when:

- The task changes UI behavior that needs visual verification.
- The task depends on browser APIs, mobile viewports, or origin security.
- The user reports a UI bug that cannot be confirmed purely from code.
- The task involves a web-based workflow (e.g., admin portal, test page).

Do not use browser tools for:

- Tasks that can be verified purely from code (API contracts, data logic).
- Tasks where the browser result adds no signal (text-only changes).
- Every single edit — batch browser verification after a meaningful change set.

### MCP And Tool Boundaries

Each MCP server or external tool has a defined boundary:

| Surface | What It Provides | What It Does Not Provide |
|---------|-----------------|--------------------------|
| File system | Read/write project files | Runtime environment, network access |
| Shell | Command execution | Persistent state across commands |
| Code graph (codegraph_*) | Symbol-oriented code intelligence | Runtime behavior, production data |
| Browser tool | UI verification, screenshot | Auth state, non-localhost targets |
| Chrome tool | Authenticated browser sessions | Non-localhost targets without VPN |
| MCP servers | Domain-specific capabilities | Universal truth — results may be stale or rate-limited |

### Unknown Or Ambiguous Tools

When encountering an unfamiliar tool or MCP server:

1. Check if the tool is an installed skill or plugin (read `SKILL.md` if so).
2. Check `docs/tools/` for project-local setup notes.
3. Check AGENTS.md for any tool-specific rules.
4. If still unfamiliar, test with a safe read-only call before using it for
   production work.
5. If the tool has an `--help` or `--version` flag, use it to understand scope.

## Context Hygiene

### What To Include In Context

- The main goal and current subtask.
- The active constraints (from AGENTS.md, CONTEXT.md, or the task spec).
- The current phase in the session lifecycle.
- Recent verification results.
- The next action.

### What To Exclude From Context

- Full command output of successful runs (summarize instead).
- Full file contents when a line-range or summary suffices.
- Stale evidence from earlier in the same session.
- Files that were read but determined not to be relevant.
- Logs, traces, or screenshots that have been summarized already.

### Output Backpressure

When a tool returns more output than the agent needs:

1. Summarize the result in 1-3 lines.
2. Preserve only the decision-relevant parts.
3. For long test output, reference the exit code and failure count instead of
   the full log.
4. For browser screenshots, describe what was visible and any errors found.
5. For command output with multiple errors, group by type rather than listing
   every instance.

The agent should apply backpressure to its own thinking, not just to tool
output. If the agent finds itself holding 5+ files, 3+ decisions, and the
main goal simultaneously, it is time to checkpoint or commit.

### File-Level Disclosure

| File Size | Recommended Read Strategy |
|-----------|--------------------------|
| < 50 lines | Full read |
| 50-200 lines | Full read or targeted read depending on task relevance |
| 200-500 lines | Targeted read with line ranges |
| 500+ lines | Index first (grep headings), then read relevant sections |

Do not read 500-line files in full unless every line is directly relevant to
the current task.

## Relationship To Other Harness Docs

| Doc | Connection |
|-----|-----------|
| `foundations.md` | Defines substrate as a harness layer — this doc fills in the tool and context details. |
| `context-memory.md` | Defines the memory model that determines what context is durable vs transient. |
| `primitives.md` | Progressive Disclosure is a defined substrate primitive. |
| `verification.md` | Deterministic checks are a tool category with defined boundaries. |
| `capability-discovery.md` | Defines when to search for tools vs when to use known ones. |
| `agent-delivery-contract.md` | Prescribes when browser verification is needed. |

## Anti-Patterns

- **Everything-in-context**: loading every document, tool, and MCP server into
  a single session. Progressive disclosure exists for a reason.
- **Tool sprawl**: making every tool available by default. Only expose tools
  the current task needs.
- **Context hoarding**: reading files "just in case" the task might need them.
  Read on demand, not on suspicion.
- **Zero context discipline**: ignoring context budget and reading every file
  in full. This produces noisier reasoning and earlier compaction.
- **Backpressure avoidance**: forwarding tool output without summarizing.
  Every passing output line is a token stolen from reasoning.
