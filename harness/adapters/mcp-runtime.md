# Adapter: MCP-Compatible Runtimes

This adapter note describes how the harness methodology in this repository
maps to any MCP-compatible agent runtime (Codex CLI, Claude Code, Cursor, or
custom MCP hosts).

## System Overview

MCP (Model Context Protocol) runtimes provide a standardized interface for
tools, resources, and prompts. Any runtime that implements the MCP transport
specification can use the same harness patterns with minor adapter adjustments.

Common MCP runtimes:

- **Codex CLI**: terminal-first agent with tool execution and file system
  access via MCP.
- **Claude Code**: Anthropic's terminal agent with MCP tool integration.
- **Cursor**: IDE-integrated agent with MCP server support.
- **Custom MCP hosts**: any application implementing the MCP host spec.

## Context Model

MCP runtimes vary in context management, but share common patterns:

| Feature | MCP Runtime Characteristics |
|---------|---------------------------|
| Entry point | Most read `CLAUDE.md` or `AGENTS.md` from workspace root. Some support `CURSOR.md` or `CODE.md`. |
| Progressive disclosure | Varies by runtime. CLI runtimes tend to have tighter context budgets than IDE-integrated ones. |
| Compaction | CLI runtimes often have session-level context limits. IDEs may maintain longer sessions. |
| Session resumption | Most support fresh-session resumption. Handoff packets are essential for all. |
| Tool availability | Defined by MCP server configuration, not by the runtime itself. |

### Bootstrap Sequence (CLI variant)

```
session start
  → runtime reads CLAUDE.md or AGENTS.md automatically
  → agent reads CONTEXT.md
  → agent reads active plan or handoff
  → start work
```

Some CLI runtimes auto-inject the root instruction. Check whether the runtime
reads `CLAUDE.md`, `AGENTS.md`, or both. If the runtime auto-loads one,
mirror the key navigation content in both.

## Tool Surface

MCP runtimes expose tools through MCP servers. This project's harness
methodology expects at least these tool categories:

| Harness Primitive | MCP Tool Equivalent | Notes |
|-------------------|--------------------|-------|
| File read | `read_file`, `read_multiple_files`, codegraph tools | MCP resource or custom tool |
| File edit | `edit_file`, `write_file`, `apply_patch` | MCP custom tool |
| Shell execution | `execute_command`, `run_command` | MCP custom tool |
| Code search | `search_code`, `grep`, `rg` | MCP custom tool |
| Browser verification | `puppeteer`, `playwright` tools | Optional MCP server |
| Image capture | Screenshot tool or file attachment | Varies by runtime |
| Git operations | `git` tools or shell fallback | MCP custom tool |

### Tool Boundaries

- MCP tools are stateless by default. State must be managed by the agent
  through files.
- MCP server registration is runtime-specific. Some runtimes require a
  `mcp.json` config; others use `claude.json` or custom format.
- Not all MCP runtimes support subagent spawning or concurrent tool execution.
  Check the runtime's execution model before designing multi-agent work.
- MCP resource URIs are stable across runtimes implementing the same server.

## State Management

Same principles apply across all MCP runtimes:

| State Mechanism | Portability |
|----------------|-------------|
| Git | Universal |
| Run records | Universal (markdown) |
| Handoff packets | Universal (markdown) |
| Progress notes | Universal (markdown) |
| Plans and specs | Universal (markdown) |
| Evolution entries | Universal (markdown) |

The markdown-based artifact format makes harness state portable across any
MCP runtime.

### Runtime-Specific State Caveats

- **Terminal-based runtimes** (Codex CLI, Claude Code): may have tighter
  context budgets. Progress notes and handoffs are more critical.
- **IDE-integrated runtimes** (Cursor): may have persistent context across
  file edits. Less urgent to checkpoint, but still essential for cross-session
  continuity.
- **Custom MCP hosts**: state persistence depends on the host's session model.
  Default to filesystem-based state.

## Verification Surface

| Check Type | MCP Runtime Approach |
|------------|---------------------|
| File existence | Shell or read tool |
| Lint | Shell execution |
| Tests | Shell execution |
| Build | Shell execution |
| Browser verification | Browser MCP server (optional) |
| Mobile viewport | Browser MCP with device emulation |
| Structural checks | Shell find/sort |
| Git status | Shell git commands |

The key MCP advantage: verification tools are consistent across runtimes if
they use the same MCP server implementations.

## Evidence Capture

MCP runtimes can capture:

- Command output (via shell tool)
- Screenshots (via browser MCP server)
- File snapshots (via read tool or resource)
- Git diffs (via shell or git tool)
- Tool call traces (varies by runtime — some record in logs)

Limitation: most MCP runtimes do not persist tool traces by default. The
agent must actively capture evidence into run records or evolution entries.

## Migration Between Runtimes

Moving harness methodology from one MCP runtime to another requires changing:

1. **Root instruction file name**: `AGENTS.md` → `CLAUDE.md` → `CURSOR.md`
   depending on the runtime.
2. **MCP server configuration format**: the server registration format varies.
3. **Tool naming**: tool names differ, but capabilities map one-to-one.

The markdown artifacts (run records, handoffs, plans, evolution entries) and
directory structure (`harness/`, `agents/`, `evals/`, `experiments/`) are
runtime-agnostic and transfer without changes.

## Key Limitations

- MCP is a protocol, not a runtime. Each runtime implements the protocol
  slightly differently.
- Subagent support is runtime-dependent. Not all MCP runtimes support
  multi-agent work.
- MCP tool execution speed varies by runtime and server.
- Some MCP runtimes restrict file system access to the workspace root.
- MCP resource caching behavior is runtime-specific and may serve stale data.
