# Adapter: Codex Desktop

This adapter note describes how the harness methodology in this repository
maps to the Codex desktop app runtime.

## System Overview

Codex Desktop is a code-first AI coding assistant that runs as a local
application. It provides:

- A persistent chat session with context compaction and resumption.
- File system access (read/write within workspace boundaries).
- Shell execution via `exec_command`.
- MCP server integration for domain-specific tools.
- In-app browser (Browser MCP) for local web UI verification.
- Chrome integration for authenticated browser sessions.
- Skills and plugins as packaged capability bundles.
- Image viewing.

## Context Model

Codex Desktop uses a progressive-disclosure-friendly context model:

| Feature | How It Maps To Harness |
|---------|----------------------|
| Entry point | Reads `AGENTS.md` and `CONTEXT.md` from the workspace root on session start. |
| Progressive disclosure | Agent reads entry files first, then reads deeper docs per task. |
| Compaction | Tool auto-compacts long conversations; an agent should maintain durable state in files. |
| Session resumption | Can resume from a compacted state; handoff packets are essential for continuity. |
| Context budget | Finite but variable. Agent should apply backpressure and checkpoint proactively. |

### Bootstrap Sequence

```
session start
  → read AGENTS.md (project map and operating contract)
  → read CONTEXT.md (phase, intent, non-goals)
  → read CONTEXT-MAP.md or docs/index (knowledge routing)
  → read active plan or handoff if one exists
  → start work
```

The agent does not need to re-read every file. Progressive disclosure is the
default.

## Tool Surface

| Harness Primitive | Codex Desktop Tool | Notes |
|-------------------|-------------------|-------|
| File read | `cat`, `exec_command`, codegraph tools | Prefer codegraph for structural questions |
| File edit | `apply_patch`, `exec_command` (sed, etc.) | `apply_patch` for manual edits |
| Shell execution | `exec_command` | Main execution surface |
| Code search | `rg`, `rg --files`, `grep`, codegraph_search | `rg` is faster than `grep` |
| Browser verification | Browser MCP, Chrome MCP | Browser for localhost; Chrome for authenticated pages |
| JavaScript execution | Node REPL MCP (`js` tool) | For one-off analysis |
| Image capture | Headless screenshots via Browser MCP | For verification evidence |
| Git operations | `exec_command` | Full git access within workspace |
| MCP servers | Configured per project or globally | Domain-specific capabilities |

### Tool Boundaries

- Codex Desktop has no persistent background runtime. Each `exec_command` is a
  new process unless a PTY session is maintained.
- The in-app Browser MCP can only access `localhost`, `127.0.0.1`, `::1`, and
  `file://` URLs without additional configuration.
- Chrome MCP requires Chrome to be installed and configured.
- Node REPL state persists across calls within a session but resets on
  session close.
- The agent cannot directly access the host clipboard, notifications, or GUI
  windows.

## State Management

Codex Desktop sessions are ephemeral. Durable state must live in the
filesystem.

| State Mechanism | How To Use |
|----------------|------------|
| Git | Commit verified work; use git log for continuity |
| Run records | `harness/runs/` for task-level evidence |
| Handoff packets | `agents/handoffs/` for cross-session continuity |
| Progress notes | Durable file for multi-step tasks |
| Plans and specs | `docs/superpowers/plans/`, `docs/superpowers/specs/` |
| Evolution entries | `docs/evolution/` for stage-level learning |

### Session Recovery

When resuming after compaction or a new session:

1. Read `AGENTS.md` and `CONTEXT.md`.
2. Check `git log --oneline -5` for recent activity.
3. Read the active handoff or progress note if one exists.
4. Check `git status` for uncommitted changes.
5. Re-establish the task goal from the plan or spec.
6. Continue from the last verified state.

## Verification Surface

| Check Type | How To Run In Codex Desktop |
|------------|---------------------------|
| File existence | `ls`, `find`, `test -f` via exec_command |
| Lint | `pnpm lint`, `eslint` via exec_command |
| Tests | `pnpm test`, `jest` via exec_command |
| Build | `pnpm build`, `tsc` via exec_command |
| Browser verification | Browser MCP: navigate to localhost, screenshot, inspect |
| Mobile viewport | Browser MCP emulation or Chrome MCP emulation |
| Structural checks | `find | sort`, compared to expected shape |
| Git status | `git status --short`, `git diff --stat` |

## Evidence Capture

Codex Desktop can capture these evidence types:

- Screenshots (via Browser MCP `take_screenshot`)
- Console logs (via Browser MCP `list_console_messages`)
- Network requests (via Browser MCP `list_network_requests`)
- Command output (via `exec_command`)
- Heap snapshots (via Chrome MCP `take_memory_snapshot`)
- File contents (via `cat`, codegraph tools)

## Key Limitations

- No persistent agent memory outside the filesystem.
- No built-in run-record or checkpoint mechanism — the agent must create them.
- No built-in eval framework — evals are manual or script-based.
- Context compaction can lose intermediate reasoning — checkpoint before long
  tasks.
- Cannot run servers in the background long-term without a separate process
  manager.
