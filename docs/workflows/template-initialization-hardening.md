# Template Initialization Hardening

This workflow hardens `templates/agent-first-living-lab/` initialization without
turning the skeleton into a full generator.

## Priority

Template initialization comes before optional packs and skill evals.

Reason:

- the skeleton is already checked in
- throwaway validation proved it can be copied
- the remaining risk is repeatability: placeholder replacement, leak checks,
  first-record creation, and next-step clarity
- optional packs need a stable core
- public skills need separate evals

## Scope

This workflow should produce:

- an initialization guide inside the template
- a thin helper script for core placeholder replacement
- a verification checklist
- a throwaway or fresh-repo validation result

This workflow should not produce:

- a published generator
- optional pack content
- application code
- mobile/runtime defaults in the core
- public skill claims

## Required Inputs

Every initialization needs:

- project name
- project intent
- current phase
- date
- first working assumption
- first non-goal
- first alternative considered for the initial ADR

## Placeholder Map

Core placeholders replaced during initialization:

- `{{PROJECT_NAME}}`
- `{{PROJECT_INTENT}}`
- `{{CURRENT_PHASE}}`
- `{{DATE}}`
- `{{WORKING_ASSUMPTION_1}}`
- `{{NON_GOAL_1}}`
- `{{ALTERNATIVE}}`

Allowed placeholders after initialization:

- run-record template placeholders
- evolution-entry template placeholders
- experiment-report template placeholders
- decision-record template placeholders

These remain because they create future records.

## Initialization Steps

1. Copy `templates/agent-first-living-lab/` into a new project.
2. Run `bash init-template.sh ...` from the new project root.
3. Inspect `README.md`, `CONTEXT.md`, and the initial ADR.
4. Decide whether any optional packs are needed. Default to none.
5. Run placeholder and leak checks.
6. Create first records only after real work happens.
7. Commit the initialized skeleton.

## Verification Checklist

Run these checks after initialization:

```sh
rg "{{" README.md CONTEXT.md decisions/0001-adopt-agent-first-living-lab.md
rg -n "Dinner Picker|dinner-picker|Phase 3C|/Users/|harness-vibe-coding-study|React|Vite|Tailwind" .
find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort
git status --short
```

Expected result:

- no core placeholders remain
- leak scan has no project-history or local-path hits
- required skeleton files exist
- no app/framework/runtime directories were created by default
- blank record templates still contain placeholders

## Fresh-Repo Acceptance Criteria

Initialization is strong enough for the next milestone when:

- a fresh repository can be initialized from the skeleton
- a reader can inspect only `README.md`, `CONTEXT.md`, `AGENTS.md`, and
  `TEMPLATE.md` and identify the next work location
- the initial ADR is project-specific
- the new project has no inherited evolution history
- first run/evolution/decision records can be created from blank templates
- optional packs remain excluded unless explicitly selected

## Current Helper Status

`templates/agent-first-living-lab/init-template.sh` is a thin helper.

It is not a full generator. It has no external dependencies, does not create app
code, and does not replace placeholders in blank record templates.

Treat it as an initialization hardening step. A real generator would need a
separate design and validation task.
