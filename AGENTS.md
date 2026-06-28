<!-- AUTONOMY DIRECTIVE — DO NOT REMOVE -->
YOU ARE AN AUTONOMOUS CODING AGENT. EXECUTE TASKS TO COMPLETION WITHOUT ASKING FOR PERMISSION.
DO NOT STOP TO ASK "SHOULD I PROCEED?" — PROCEED. DO NOT WAIT FOR CONFIRMATION ON OBVIOUS NEXT STEPS.
IF BLOCKED, TRY AN ALTERNATIVE APPROACH. ONLY ASK WHEN TRULY AMBIGUOUS OR DESTRUCTIVE.
USE CODEX NATIVE SUBAGENTS FOR INDEPENDENT PARALLEL SUBTASKS WHEN THAT IMPROVES THROUGHPUT. THIS IS COMPLEMENTARY TO OMX TEAM MODE.
<!-- END AUTONOMY DIRECTIVE -->

# Agent Operating Contract

This file is the short root contract for agents working in this repository. Keep
long runtime notes, generated material, model tables, and mode-specific details
in workflow references under `docs/`.

## Startup Workflow

1. Confirm the working directory with `pwd`.
2. Read `README.md`, `CONTEXT.md`, and this file.
3. Read `feature_list.json` for the current scoped work, dependencies, status,
   and evidence.
4. Read `progress.md` when resuming prior work.
5. Run `./init.sh` before claiming the project is restartable.
6. Review recent commits with `git log --oneline -5` when history matters.

## Project Shape

- This repository is a living lab for agent-first work, harness engineering,
  and restartable project memory.
- `README.md` is the future-review map.
- `CONTEXT.md` owns durable purpose, boundaries, and canonical language; do not
  put implementation detail, temporary state, or long method explanations there.
- `docs/evolution/` records stage narratives and durable evidence.
- `docs/adr/` records short decisions only when the decision is hard to
  reverse, surprising without context, and the result of a real trade-off.
- `docs/workflows/` stores workflow references that are useful on demand but
  too large for this root contract.
- `templates/` stores conservative reusable skeletons extracted from validated
  project evidence.

## Working Rules

- One feature at a time: work from exactly one `next` or `in-progress` item in
  `feature_list.json` unless the user explicitly asks for parallel lanes.
- Solve scoped tasks directly when they are safe and reversible.
- Ask only for destructive, irreversible, credential-gated,
  external-production, or materially scope-changing actions.
- Prefer existing patterns and deletion over new abstractions.
- Keep diffs small, reviewable, and reversible.
- When using a named skill, load its `SKILL.md` before following the workflow.
- For repo lookup, use normal Codex inspection tools or bounded subagents; do
  not use deprecated `omx explore` as the default path.

## State Artifacts

- `feature_list.json` is the scoped feature tracker and source of truth for
  current status.
- `progress.md` records session continuity, evidence, blockers, and next steps.
- `docs/evolution/` records durable stage outcomes, not ordinary changelog
  entries.

## Verification

Verify before claiming completion.

Verification Commands:

- Run `./init.sh` for the repository startup and structure check.
- This repository currently has no package test/lint/build/typecheck surface;
  `./init.sh` is the required static structure check until one exists.
- Add feature-specific checks when the active feature needs them.
- If verification fails, fix or record the blocker before final response.
- If verification cannot run, explain why and use the next-best check.

## Definition of Done

A task is done only when:

- The target behavior or documentation outcome is complete.
- Required verification ran.
- Evidence is recorded in `feature_list.json`, `progress.md`, or
  `docs/evolution/`.
- Scope remains bounded to the active feature or documented related cleanup.
- The repository is restartable from the startup workflow above.

## Codex And OMX

Default to Codex-native execution for ordinary repo lookup, editing, review, and
verification.

Use OMX only when it adds real orchestration value: long-running persisted-state
workflows, multi-stage plan/execute/verify loops, coordinated multi-agent work,
or explicit user requests.

In Codex App outside tmux, OMX runtime surfaces such as `omx team`, `omx hud`,
and `omx question` require an attached tmux OMX CLI shell or a preserved bridge.
If they are unavailable, continue with the nearest App-safe surface.

For detailed OMX routing, runtime notes, generated model tables, and deprecated
command boundaries, read `docs/workflows/omx-runtime.md`.

## End Of Session

Before ending a substantive session:

1. Update `progress.md` with current state, evidence, and unresolved risks.
2. Update `feature_list.json` when feature status or evidence changes.
3. Add or update `docs/evolution/` when a stage outcome lands.
4. Leave verification evidence or an explicit validation gap in the final
   response.
