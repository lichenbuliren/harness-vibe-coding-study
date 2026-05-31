# Independent Small Airplane Validation Project

## Stage

Post-Phase 3C follow-up - Independent fresh-project validation.

## Goal

Create a separate Codex project for validating the Agent-First Living Lab
harness without continuing inside the source methodology repository's current
conversation context.

## Methodology

The validation setup used the checked-in template helper rather than manually
copying files:

```text
source template -> safe target-dir initialization -> git init -> Codex trusted project registration -> structure checks
```

The target project is intentionally separate from
`harness-vibe-coding-study`, so future agent conversations can start from the
new project's own `AGENTS.md` and `CONTEXT.md`.

## Decision

Use `/Users/heaven/Projects/small-airplane-lab` as the independent validation
project.

The project starts as an initialized Agent-First Living Lab skeleton only. It
does not contain application code, dependencies, framework directories, or a
chosen product stack. The first real validation task should be defined from
inside the new project.

## Artifacts

- `/Users/heaven/Projects/small-airplane-lab`
- `/Users/heaven/Projects/small-airplane-lab/AGENTS.md`
- `/Users/heaven/Projects/small-airplane-lab/CONTEXT.md`
- `/Users/heaven/Projects/small-airplane-lab/decisions/0001-adopt-agent-first-living-lab.md`
- `/Users/heaven/.codex/config.toml`

## Evidence

- Template initialization completed successfully for `Small Airplane Lab`.
- The new project was initialized as a git repository on branch `main`.
- Initial skeleton commit: `ee6ef4d`.
- Core placeholder scan passed for `README.md`, `CONTEXT.md`, and the initial
  ADR.
- Forbidden first-stage directory scan found no `apps/`, `packages/`, `src/`,
  `scripts/`, `infra/`, or `benchmarks/` directories.
- Codex config now includes the new trusted project path.

## Shareable Takeaway

Harness accuracy is stronger when the harness is tested from a fresh project
context instead of from the conversation that designed it.

The validation target should inherit the reusable project operating system, but
not the source repo's accumulated chat state, historical assumptions, or local
implementation momentum.

## Open Questions

- What should the first small-airplane validation task be?
- Should the next run create a first project-specific run record and experiment
  report before any app code exists?
- After the first fresh-project task, which template assumptions should be
  promoted, revised, or removed?
