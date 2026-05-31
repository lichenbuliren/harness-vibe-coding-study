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
