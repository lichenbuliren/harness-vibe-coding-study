# Remove Session Handoff Design

## Decision

Remove `session-handoff.md` as a repository artifact and remove the
`session-handoff` capability from the Harness Engineering product. Do not keep
a deprecated CLI flag, manifest field, schema branch, generated template, or
compatibility adapter.

The existing State architecture already owns every required responsibility:

- `feature_list.json` owns scoped work, dependencies, status, branch, verification,
  and evidence.
- `progress.md` owns current continuity, next actions, blockers, and restart
  guidance.
- Branch Lease owns one-branch/one-writer coordination across Codex threads.
- Git owns the working tree and delivery history.
- Stage Snapshot and Stage Baseline own completed-stage history.
- `docs/evolution/` owns durable stage conclusions.

`session-handoff.md` has no remaining unique responsibility.

## Product Boundary

The canonical State surface becomes:

```text
feature_list.json = what is in scope
progress.md       = where work stands and what happens next
branch lease      = who may write
snapshot          = completed state history
baseline          = latest archived stage
```

Cross-session and cross-agent continuation use `progress.md`. An interrupted
session updates its current state, next action, and blockers there. Writer
transfer remains a Branch Lease operation; it is not represented by a second
Markdown state file.

## Removal Scope

### Repository contract

- Delete root `session-handoff.md`.
- Remove it from startup, State Artifacts, and end-of-session instructions in
  `AGENTS.md`.
- Remove it from `README.md`, `CONTEXT.md`, documentation indexes, workflow
  references, and the user guide.
- Remove it from the repository `init.sh` required path list.
- Remove the `handoff` artifact declaration from `.harness/manifest.json`.

Historical evolution records and superseded implementation plans remain
unchanged because they are immutable evidence of earlier stages.

### Harness Creator

- Remove `--with-handoff` from the CLI grammar and option parsing.
- Remove `withHandoff` from planner and applier inputs and plan identity.
- Remove `renderHandoff`, `handoffPath`, and `includeHandoff`.
- Stop creating `session-handoff.md`.
- Stop emitting `artifacts.handoff`.
- Replace handoff-specific tests with assertions that Creator exposes only the
  single `progress.md` continuity surface.

### Shared Harness Core

- Remove `handoff` from `ARTIFACT_KEYS`.
- Remove `handoff` from the manifest schema.
- Remove the discovery mapping for `handoff`.
- Do not accept old manifests containing `artifacts.handoff`.
- Keep schema versions unchanged: the product is pre-1.0 and this change removes
  an unused optional field rather than introducing a migration protocol.

### Product integration

- Remove `--with-handoff` from isolated plugin verification.
- Assert packaged Creator does not generate `session-handoff.md`.
- Keep Doctor State Readiness based on valid feature state and resumable
  progress; its capability rules already do not use handoff.
- Keep Archiver unchanged: it already snapshots and compacts
  `feature_list.json` and `progress.md`.

## Data Flow

### Active work

1. Creator creates or discovers `feature_list.json` and `progress.md`.
2. The selected feature records its branch.
3. A thread claims the Branch Lease before mutation.
4. The agent updates feature evidence and current continuity in the two State
   artifacts.

### Interrupted work

1. The agent records current state, next action, and blockers in `progress.md`.
2. The agent releases or explicitly transfers Branch Lease ownership.
3. The next session reads `feature_list.json` and `progress.md`, then runs
   `./init.sh`.

### Completed work

1. Archiver verifies that all features are complete.
2. Archiver snapshots `feature_list.json` and `progress.md`.
3. Archiver compacts both current State artifacts and advances Stage Baseline.

No separate handoff archive or compatibility path exists.

## Failure And Safety Behavior

- A Creator invocation containing `--with-handoff` fails as an unknown argument
  before writing files.
- A manifest containing `artifacts.handoff` fails schema validation.
- Removing the root file must not reduce Doctor State Readiness because handoff
  is not a State capability signal.
- Archiver rollback behavior remains unchanged because no new archive input is
  introduced.
- Existing Git history remains the recovery source for deleted historical
  `session-handoff.md` content.

## Verification

The change is complete when:

1. Repository search finds no active product or root-contract reference to
   `session-handoff`, `withHandoff`, `includeHandoff`, or `handoffPath`.
2. Creator rejects `--with-handoff` without changing the target.
3. Creator generates `feature_list.json`, `progress.md`, `init.sh`, and a
   manifest without `handoff`.
4. Shared Core rejects manifests declaring `artifacts.handoff`.
5. Doctor reports the same State Readiness without `session-handoff.md`.
6. Product packaging and isolated fresh-process discovery pass.
7. `./init.sh` passes after the root file is deleted.
8. The full repository test suite passes.

## Non-goals

- Do not introduce a replacement handoff file.
- Do not add a handoff section that duplicates feature fields.
- Do not add schema migration logic.
- Do not rewrite immutable historical evolution records or superseded plans.
- Do not change Branch Lease or Archiver stage identity semantics.
