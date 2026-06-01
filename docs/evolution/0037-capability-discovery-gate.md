# Capability Discovery Gate

## Stage

Post-Phase 3C follow-up - Harness capability selection.

## Goal

Add a reusable harness rule for deciding when an agent should actively look for
existing skills, tools, plugins, playbooks, scripts, or runtime capabilities
before doing work directly.

## What Triggered This

The repository already encouraged optional skills such as `grill-with-docs` for
documentation sharpening and had `docs/tools/` for install notes. But it did not
define a general discovery gate.

That left an avoidable gap: when a task has an established skill or tool, a
future agent might hand-roll a weaker path. The opposite failure was also
possible: an agent could search or install tools for every small task and turn
capability discovery into process noise.

## Method

We classified this as a capability-selection rule, not a skill-specific rule.

The implementation followed:

```text
identify capability gap -> define trigger and skip conditions ->
set trust and install boundaries -> add harness module ->
wire runtime and template surfaces -> verify discoverability
```

## Decision

`harness/capability-discovery.md` is now the canonical owner for the conditional
capability discovery gate:

```text
task intake -> classify capability need -> inspect available capabilities ->
search installable capabilities when useful -> evaluate trust and fit ->
use / recommend / fallback -> record reusable gap if needed
```

The gate is conditional. It should run for specialized, repeated, tool-shaped,
or capability-uncertain work. It should be skipped for simple lookups, clear
repo-local paths, or cases where search and installation would add more risk
than value.

## Artifacts

- `harness/capability-discovery.md`
- `AGENTS.md`
- `CONTEXT.md`
- `harness/index.md`
- `harness/agent-delivery-contract.md`
- `docs/tools/index.md`
- `docs/workflows/minimum-project-template-skeleton.md`
- `templates/agent-first-living-lab/harness/capability-discovery.md`
- `templates/agent-first-living-lab/AGENTS.md`
- `templates/agent-first-living-lab/docs/tools/index.md`
- `templates/agent-first-living-lab/init-template.sh`

## Shareable Takeaway

Skill discovery is useful only when it is treated as a gate with triggers,
skip conditions, trust review, and installation boundaries.

An agent should look for existing capabilities when that can improve quality,
but it should not silently install tools or search the ecosystem for every tiny
task.

## Open Questions

- Should future run records include a `Capabilities considered` field?
- Should repeated capability gaps automatically become skill-candidate issues?
- Should the template eventually include a no-skill baseline note for evaluating
  discovered skills?
