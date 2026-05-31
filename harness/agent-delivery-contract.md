# Agent Delivery Contract

This contract defines the minimum delivery behavior for lab and harness work.
It exists because a feature that is only implemented, but not independently
verified and recorded, is not a harness-quality outcome.

## Core Rule

The user must not be the first QA surface.

For any meaningful code, UI, lab, or methodology change, the agent should close
the loop before reporting completion:

```text
implement -> test -> inspect output -> browser/tool verify when relevant -> commit -> record evidence
```

Do not say a task is complete because the edit looks plausible. Completion
requires evidence.

## Required Delivery Loop

### 1. Define The Claim

Before verification, state internally what must be true.

Examples:

- the feature works through the expected user path
- the bug no longer reproduces on the same access path the user used
- tests cover the changed rule
- the UI fits the expected mobile viewport
- the docs explain the reusable method

### 2. Run The Smallest Useful Automated Checks

For code changes, run the relevant targeted checks first, then the broader gate.

Typical lab app gates:

- targeted unit or interaction test
- full test suite
- build or typecheck
- lint

If a check is unavailable, record why. If output is noisy, summarize the parts
that prove the claim.

### 3. Verify The User-Facing Path

When behavior depends on UI, browser APIs, mobile layout, network origin, or
runtime environment, automated tests are not enough.

Use the relevant tool surface to verify the path the user will experience:

- Browser or Chrome MCP for local web UI flows
- mobile viewport checks for mobile-first work
- LAN URL checks when phone testing is expected
- secure-context checks when browser APIs depend on origin security

Record concrete observations such as:

- URL tested
- viewport size
- action sequence
- visible result
- overflow or layout result
- browser/runtime errors

### 4. Commit Durable Work

Meaningful completed work should be committed with a Lore-style message.

The commit must say why the change exists and include useful verification
trailers when available:

- `Tested:`
- `Not-tested:`
- `Constraint:`
- `Rejected:`
- `Confidence:`
- `Scope-risk:`

Do not leave completed implementation only in an uncommitted working tree unless
the user explicitly asks for that.

### 5. Record Harness Evidence

For lab validation, experiments, methodology changes, or meaningful failures,
write durable evidence:

- run record under `harness/runs/`
- experiment report under `experiments/reports/` when an experiment occurred
- evolution entry under `docs/evolution/` when a stage-level learning emerged

The record should explain:

- method used
- checks run
- exact evidence
- gaps or risks
- reusable lesson

### 6. Return To The Mainline

After a meaningful subtask, correction loop, side exploration, or generated
artifact, re-anchor the project before moving on.

Use the continuity check:

```text
larger goal -> local work completed -> current project position ->
next mainline step
```

This prevents useful detours from silently becoming the project direction.

For small tasks, the final response can carry the check. For phase transitions
or stage-level learning, update `CONTEXT.md`, `README.md`, `docs/evolution/`,
or the relevant workflow/standard.

## Self-Correction Capture

When the user points out an agent mistake, missed verification step, weak
handoff, poor assumption, or process gap, the agent must treat that feedback as
potential project-standard evidence. It may become a harness rule, but it may
also become a directory standard, documentation standard, eval standard, lab
standard, or agent operating rule.

The agent should ask itself:

- Is this only a one-off execution mistake?
- Or does this reveal a reusable standard future agents should follow?
- Which contract should future agents read before repeating this mistake?

If the feedback reveals a reusable rule, update the right durable surface:

- `AGENTS.md` for runtime behavior every future agent must follow
- `docs/standards/` for cross-cutting project standards
- `harness/` for project-local methodology or delivery contracts
- `evals/` for checklists, rubrics, or quality gates
- `docs/evolution/` for stage-level narrative learning
- `harness/runs/` for task-specific evidence and traceability

The default response to user-corrected process failures should be:

```text
acknowledge -> classify reusable lesson -> update canonical contract -> verify -> commit
```

Do not wait for the user to explicitly say "update the docs" or "update the
harness docs" when the lesson is clearly reusable.

## Subagent Lifecycle And Cost Control

Subagents are useful for independent review, parallel exploration, and bounded
work that benefits from a separate context. They also consume additional token
budget through task prompts, inherited context, file reading, reasoning, and
final reports.

Use subagents when they materially improve one of these:

- speed through true parallelism
- quality through independent review
- safety through separation of concerns
- coverage across multiple documentation or code surfaces

Do not use subagents for trivial lookups, work that blocks the immediate next
step, or tasks the lead agent must redo to trust.

The lead agent owns the lifecycle:

1. Give each subagent a bounded task and clear expected output.
2. Continue useful non-overlapping work while the subagent runs.
3. Integrate, reject, or summarize the result explicitly.
4. Close the subagent once its output is no longer needed.
5. Return to the mainline after integration.

Do not rely on implicit platform cleanup as the project standard. Explicit
closure keeps coordination state small and makes token and context cost visible.

Use `agents/handoffs/subagent-task-handoff.md` for delegation packets and
`agents/playbooks/subagent-delegation.md` for the full workflow when the
delegated work is meaningful.

## Minimum Evidence By Change Type

| Change Type | Minimum Evidence |
| --- | --- |
| Pure docs edit | link/path check, status check, and review for placeholders |
| Domain/helper logic | targeted tests plus full relevant suite |
| UI behavior | interaction tests plus browser smoke check |
| Mobile-first UI | interaction tests, browser smoke check, mobile viewport check |
| Phone/LAN path | LAN URL check and origin/security-context note |
| Performance feedback | user-facing path check plus explicit performance criterion |
| Harness methodology | updated `harness/` doc plus evolution note when stage-level |
| Template or initialization script | executable validation covering happy path and known negative paths |
| User-corrected agent process gap | classify reusable standard, update canonical contract, commit |
| Subagent usage standard | document delegation reason, integrate result, close completed subagent |
| Long conversation or side exploration | mainline continuity check and entry-doc update if phase changed |

## Final Report Requirements

The final response should include:

- what changed
- what verification ran and passed
- what was recorded
- remaining risks or not-tested gaps
- current git/worktree status when code changed

If verification was not run, say that plainly and do not imply completion.

## Anti-Patterns

- implementing the feature and waiting for the user to discover the first bug
- running tests but not reading the result
- testing only `localhost` when the user will use a LAN phone URL
- doing browser verification but not recording the URL or viewport
- updating run records but not the reusable harness rule
- leaving stage-level learning only in chat
- completing a side task without returning to the larger project direction
- waiting for the user to repeatedly remind the agent to codify the same class
  of process failure
- leaving completed subagents open after their result has already been
  integrated
