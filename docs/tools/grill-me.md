# Matt Pocock Skills

Source: https://github.com/mattpocock/skills

This skill collection is useful when the project needs structured challenge,
terminology sharpening, and documentation-aware review.

## Install

```bash
npx skills@latest add mattpocock/skills
```

## Relevant Skills

- `grill-me`: stress-test a plan through direct questioning.
- `grill-with-docs`: stress-test a plan against existing project language and
  documentation, then update the relevant docs as decisions crystallise.

## Project Usage

Use `grill-with-docs` when a proposed standard, directory rule, or methodology
change crosses documentation surfaces or contains fuzzy terms.

Expected uses:

- challenge whether a lesson is a one-off mistake or a reusable standard
- sharpen terms such as `standard`, `pattern`, `harness rule`, and `runtime rule`
- check whether `CONTEXT.md`, ADRs, `docs/standards/`, `harness/`, or `evals/`
  should own the update
- avoid putting every process lesson into `AGENTS.md`

## Availability Rule

These skills are optional user-environment capabilities. Before relying on
them, an agent should check whether the skill is available in the current
session.

If unavailable:

1. tell the user the skill is not currently installed or exposed
2. point them to the install command above
3. continue with a lightweight fallback review instead of blocking the task

## Cross-Review Pattern

For important standards work:

1. use `grill-with-docs` to challenge terminology and ownership
2. use one or more subagents for parallel placement or consistency review when
   the change touches multiple documentation surfaces
3. integrate the feedback in the lead agent session
4. verify indexes, artifact maps, and placeholder scans
5. commit the final documentation update
