# Runtimes, Harnesses, and Reference Implementations

This note synthesizes the Runtimes, Harnesses & Reference Implementations
module from `walkinglabs/awesome-harness-engineering`.

## Core Claim

Harness engineering needs a clear distinction between:

- **Framework**: abstractions for building agent applications.
- **Runtime**: infrastructure for durable execution, persistence, streaming,
  human-in-the-loop, scheduling, and recovery.
- **Harness**: the opinionated operating system around an agent: prompts,
  tools, skills, filesystem, memory, verification, observability, safety, and
  evaluation.

The boundaries blur in real tools, but the distinction prevents a common
mistake: adopting a framework and assuming the runtime and harness problems are
solved.

## Reference Categories

### Safety and Constraint Languages

- HEAAL / AIL

Use these references when exploring explicit constraint grammars, policy
enforcement, and action-shape validation.

Local question:

- Should this project eventually express guardrails as machine-checkable
  contracts rather than prose-only rules?

### General Agent Frameworks and SDKs

- Claude Agent SDK
- OpenAI Agents-style SDKs referenced through the ecosystem
- LangChain / DeepAgents

Use these references to understand tool loops, sessions, skills, memory,
plugins, MCP integration, and how CLI workflows can translate into production
automation.

Local question:

- Which parts of our document-first harness should remain runtime-agnostic, and
  which should be implemented against a concrete SDK later?

### Durable Runtimes

- LangGraph
- Inngest AgentKit
- Temporal-like durable execution patterns

Use these references when a task must survive retries, restarts, asynchronous
events, human approvals, or long-running state transitions.

Local question:

- When does a workflow become too long or stateful for chat + git + files and
  need a durable runtime?

### Multi-Agent Coordination

- Anthropic multi-agent research system
- Citadel
- Ralph-style loops
- Harness Evolver

Use these references for role separation, parallel research, orchestration,
bounded subagents, worktree isolation, and meta-harness improvement.

Local question:

- Which tasks in this project truly benefit from subagents, and which are better
  handled by one focused agent?

### Coding-Agent Harnesses

- SWE-agent
- SWE-ReX
- Harbor
- Claude Code / Codex-style harness patterns
- Bring Your AI MCP

Use these references for sandboxed execution, repository patching, terminal
workflows, benchmark harnesses, worktree isolation, and migration between agent
clients.

Local question:

- What minimum run record and sandbox assumptions are required before this
  project starts executable harness automation?

### Browser, Desktop, and Tool Harnesses

- browser-use/browser-harness
- Uni-CLI
- MCP-oriented tools and adapters

Use these references for browser control, helper-function extension,
declarative app pipelines, adapter boundaries, cost ledgers, and sensitive-path
deny lists.

Local question:

- Should browser/desktop/MCP adapters live under `harness/adapters/` before
  being promoted into reusable runtime code?

### Skills and Capability Portability

- skills.sh
- runtime-specific skill systems

Use these references when evaluating how reusable instructions, scripts, and
resources can move across agent clients.

Local question:

- Which project practices should become skills, and which should remain
  repo-local docs?

## Adoption Ladder

This project should adopt runtime/harness implementation in stages:

1. **Documented harness**
   - rules, context, decisions, workflow docs, eval notes

2. **Manual run records**
   - task, trace summary, artifacts, verification, lessons

3. **Scripted checks**
   - deterministic verifiers for project structure and stage outcomes

4. **Adapter experiments**
   - small browser/MCP/shell wrappers under `harness/adapters/`

5. **Durable runtime**
   - only when tasks need scheduled execution, crash recovery, or long-lived
     state beyond git and files

6. **Meta-harness improvement**
   - trace-driven harness changes, benchmark comparison, and eventually
     automated proposal/evaluation loops

## Selection Criteria

Before adopting any runtime or reference implementation, ask:

- What problem does it solve that repo docs, git, and scripts cannot solve?
- Does it preserve traceability and human review?
- Does it support deterministic verification?
- Does it make state explicit and recoverable?
- Can it run locally or be self-hosted if needed?
- How does it handle sandboxing and permissions?
- Does it add a dependency that future agents must understand?
- Can it export traces and run records in a portable format?

## Local Design Implications

- Keep `harness/` runtime-agnostic while the concepts are still stabilizing.
- Use `harness/adapters/` for thin experiments against external tools.
- Use `harness/runs/` for run-record conventions before introducing a database
  or observability backend.
- Do not add application dependencies just to mirror a reference
  implementation.
- Prefer small, inspectable automation before adopting a full framework.
- Treat multi-agent orchestration as a costed design choice, not a default.
- Treat sandbox and resource configuration as part of the runtime contract.

## Anti-Patterns

- Confusing a framework abstraction with a complete production runtime.
- Adding a runtime before the workflow state model is understood.
- Hiding prompts, tools, or verification logic inside opaque platform settings.
- Adopting multi-agent coordination without clear task boundaries.
- Building a meta-harness before having stable evals.
- Making tool adapters so broad that they weaken safety boundaries.

## Sources

- https://github.com/hyun06000/AIL
- https://blog.langchain.com/agent-frameworks-runtimes-and-harnesses-oh-my/
- https://claude.com/blog/building-agents-with-the-claude-agent-sdk
- https://www.anthropic.com/engineering/multi-agent-research-system
- https://github.com/langchain-ai/deepagents
- https://github.com/SWE-agent/SWE-agent
- https://github.com/SWE-agent/SWE-ReX
- https://github.com/inngest/agent-kit
- https://github.com/browser-use/browser-harness
- https://github.com/SethGammon/Citadel
- https://github.com/unitedideas/bringyour-mcp
- https://github.com/harbor-framework/harbor
- https://github.com/raphaelchristi/harness-evolver
- https://ghuntley.com/ralph/
- https://skills.sh
- https://github.com/olo-dot-io/Uni-CLI
