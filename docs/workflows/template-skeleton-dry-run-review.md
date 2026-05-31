# Template Skeleton Dry-Run Review

This review tests whether the minimum project-template skeleton is ready to
become a real template.

It is a dry run only. No `templates/` directory or generator should be created
until the blocking issues are resolved.

## Review Question

```text
Could a clean new project initialize from this skeleton without inheriting this
study project's local history, Dinner Picker specifics, runtime assumptions, or
hidden context?
```

## Inputs

- `docs/workflows/minimum-project-template-skeleton.md`
- `decisions/0003-template-skill-playbook-reuse-strategy.md`
- current repository structure
- required-file existence check

## Method

1. List every required skeleton file from the skeleton design.
2. Check whether the current project has each required file.
3. Review whether those files are portable as-is or need parameterization.
4. Classify blockers before creating a real template.

## Required File Check

All required skeleton files currently exist in this repository:

- root files: `README.md`, `CONTEXT.md`, `AGENTS.md`, `.gitignore`
- docs indexes: `docs/index.md`, `docs/evolution/index.md`,
  `docs/standards/index.md`, `docs/patterns/index.md`,
  `docs/workflows/index.md`, `docs/tools/index.md`,
  `docs/principles/index.md`
- required docs: `docs/standards/mainline-continuity.md`,
  `docs/patterns/standard-capture-loop.md`
- agent files: `agents/index.md`, `agents/roles/index.md`,
  `agents/roles/default-agent-roles.md`, `agents/handoffs/index.md`,
  `agents/handoffs/subagent-task-handoff.md`, `agents/playbooks/index.md`,
  `agents/playbooks/subagent-delegation.md`
- harness files: `harness/index.md`, `harness/agent-delivery-contract.md`,
  `harness/runs/index.md`, `harness/runs/run-record-schema.md`
- eval files: `evals/index.md`, `evals/rubrics/index.md`,
  `evals/rubrics/harness-validation-rubric.md`,
  `evals/checklists/index.md`
- experiment files: `experiments/index.md`,
  `experiments/reports/index.md`, `experiments/task-samples/index.md`
- lab files: `lab/README.md`, `lab/AGENTS.md`
- decision files: `decisions/index.md`,
  `decisions/0001-adopt-agent-first-living-lab.md`

Result: pass for "listed means present" inside this repository.

## Portability Review

The skeleton is not yet ready to become a real template.

The current files exist, but several are still project-specific:

- `README.md` and `CONTEXT.md` describe this study project and Phase 3C.
- `AGENTS.md` contains initialization-phase restrictions and verification
  instructions specific to this repository.
- `docs/evolution/index.md` lists historical entries that should not appear as
  completed work in a new project.
- `decisions/0001-adopt-agent-first-living-lab.md` is useful as an example, but
  needs template fields for project-specific context and date.
- `harness/agent-delivery-contract.md` includes useful rules, but some commit
  and workflow expectations may need to be configurable.
- `lab/AGENTS.md` contains lab verification rules influenced by the Dinner
  Picker mobile experience.

## Blocking Issues

Before creating a real template, produce template-safe versions of required
files.

Required changes:

- replace project-specific content with placeholders or short instructions
- remove completed historical evolution entries from the default skeleton
- separate example history from starter blank state
- remove Dinner Picker, React/Vite, LAN/mobile specifics from the core
- keep mobile, Superpowers, runtime integration, and example lab materials as
  optional packs
- define what a new project should customize, keep, or delete
- add blank templates for first run record, first evolution entry, first
  experiment report, and first decision record

## Readiness Verdict

Status: not ready to package.

The skeleton design is ready. The actual template package is not.

Next required step:

```text
create template-safe source files -> run file-existence check ->
run portability review -> initialize a throwaway project from the skeleton
```

## Mainline Impact

This review confirms the next Phase 3C task should create a real
`templates/agent-first-living-lab/` skeleton only after defining template-safe
files and blank examples.
