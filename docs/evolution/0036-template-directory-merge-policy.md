# Template Directory Merge Policy

## Stage

Post-Phase 3C follow-up - Template reuse hardening.

## Goal

Refine template initialization so an existing target directory can be used when
the operation is still safe.

The prior policy rejected every non-empty target directory. That was safe, but
too coarse: a target can contain unrelated local files or directories that do
not conflict with the template.

## Methodology

We used the template validation script as the contract:

```text
capture merge expectation -> add regression cases -> update helper ->
refresh initialization docs -> verify structure
```

## Outcome

`templates/agent-first-living-lab/init-template.sh` now uses a path-level
conflict policy:

- nonexistent targets are created
- existing target directories can be merged
- existing file paths that the template would write stop initialization
- existing file paths that the selected app pack would write stop initialization
- existing agent instruction files such as `AGENTS.md` are not auto-merged
- an existing `packs/` path stops initialization because template packs are
  removed after initialization

`templates/agent-first-living-lab/validate-init-template.sh` now covers both the
mergeable case, ordinary file conflicts, agent-contract conflicts, symlink path
conflicts, app-pack conflicts, and pack-cleanup conflicts.

## Artifacts

- `templates/agent-first-living-lab/init-template.sh`
- `templates/agent-first-living-lab/validate-init-template.sh`
- `templates/agent-first-living-lab/INITIALIZE.md`
- `templates/agent-first-living-lab/TEMPLATE.md`
- `docs/workflows/template-initialization-hardening.md`
- `docs/workflows/template-initialization-validation.md`

## Shareable Takeaway

Template safety does not have to mean rejecting all existing directories.

A better default is:

```text
merge directories, never overwrite files, never delete user-owned reserved paths
```

This keeps initialization useful for prepared project folders while preserving a
clear stop condition for real conflicts. Agent instruction files should stop
initialization for review instead of being concatenated or rewritten by default.

## Open Questions

- Should a future `--dry-run` show the planned writes and conflicts before
  copying?
- Should the helper print a summary of preserved local paths after merge
  initialization?
