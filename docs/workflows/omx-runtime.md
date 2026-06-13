# OMX Runtime Reference

This is workflow reference material for agents that need OMX-specific routing,
runtime, or generated-model context. It is intentionally outside the root
`AGENTS.md` contract so the startup path stays short and project-owned.

## Default Boundary

- Use Codex-native repository inspection, editing, review, and verification for
  ordinary work.
- Use OMX when orchestration value is real: long-running persisted-state work,
  multi-stage plan/execute/verify loops, coordinated multi-agent work, or
  explicit user requests.
- In Codex App outside tmux, runtime surfaces such as `omx team`, `omx hud`, and
  `omx question` need an attached tmux OMX CLI shell or a preserved bridge.
  Continue with the nearest App-safe surface when those runtime surfaces are not
  available.

## Mode Selection

- `$deep-interview`: unclear intent, missing boundaries, or explicit "don't
  assume" requests. It clarifies and hands off; it does not implement.
- `$ralplan`: requirements are clear enough, but architecture, tradeoffs, plan,
  or test shape still need consensus.
- `$team`: an approved plan needs coordinated parallel execution.
- `$ralph`: an approved plan needs a persistent single-owner completion and
  verification loop.
- Solo execution: the task is scoped and one agent can finish and verify it
  directly.

Outside active team or swarm mode, use `executor` for bounded implementation or
review slices. Do not invoke `worker` as a general-purpose role; reserve it for
team-runtime sessions where the runtime assigns a worker lane.

## Specialist Routing

- `explore`: repo-local file, symbol, pattern, relationship lookup, current
  implementation discovery, or mapping how this repo uses a dependency.
- `researcher`: official docs, external API behavior, version-aware framework
  guidance, release-note history, or citation-backed references for a chosen
  technology.
- `dependency-expert`: package, SDK, framework, upgrade, replacement, migration,
  maintenance, license, security, or comparative dependency decisions.
- `executor`: bounded implementation.
- `debugger`: root-cause analysis, regression isolation, and failure diagnosis.
- `architect` or `critic`: high-complexity design and review.
- `verifier`: completion evidence and claim validation.

Use mixed routing deliberately when the problem crosses boundaries, for example
`explore -> researcher` for current local usage plus official-doc confirmation.
Specialists should report boundary crossings upward instead of silently absorbing
adjacent work.

## Command Routing

`omx explore` is deprecated and must not be recommended as the default surface
for simple read-only repository lookup tasks.

Use normal Codex repository inspection tools or Codex-native subagents for
repository lookup and implementation context. Use `omx sparkshell --tmux-pane`
only as an explicit opt-in operator aid for shell-native tmux evidence or
bounded verification. `USE_OMX_EXPLORE_CMD` is compatibility-only and does not
make `omx explore` preferred.

## Generated Model Table

This project has used an OMX-generated role table. Treat the exact model names
as generated reference material, not as the root operating contract. When model
routing matters, prefer the installed role catalog and current runtime config
over stale copied tables.

Historical generated defaults included:

| Role | Intended Use |
| --- | --- |
| Frontier leader | Primary planning, coordination, and frontier-class reasoning |
| Spark explorer | Fast codebase search, triage, and lightweight synthesis |
| Standard subagent | Default specialist and worker lanes |
| `explore` | Fast repo-local file and symbol mapping |
| `researcher` | External documentation and references |
| `dependency-expert` | SDK/package decisions |
| `executor` | Implementation and refactoring |
| `test-engineer` | Test strategy and coverage |
| `verifier` | Claim validation and completion evidence |
| `critic` | Plan/design challenge and review |

## Deep Interview Runtime Note

When deep-interview is active in attached-tmux OMX CLI/runtime, ask each
interview round via `omx question`; after launching `omx question` in a
background terminal, wait for that terminal to finish and read the JSON answer
before continuing. Preserve the leader pane with
`OMX_QUESTION_RETURN_PANE=$TMUX_PANE` when invoking it through Bash/tool paths.

Outside tmux, or on native surfaces that cannot render `omx question`, use the
native structured question path when available; otherwise ask exactly one
concise plain-text question and wait for the answer.

## Runtime Markers

If generated overlays are reintroduced, keep marker contracts stable and
non-destructive:

- `<!-- OMX:RUNTIME:START --> ... <!-- OMX:RUNTIME:END -->`
- `<!-- OMX:TEAM:WORKER:START --> ... <!-- OMX:TEAM:WORKER:END -->`

Do not let generated reference material silently retake ownership of
`AGENTS.md`; see `docs/adr/0001-keep-agents-md-as-root-operating-contract.md`.
