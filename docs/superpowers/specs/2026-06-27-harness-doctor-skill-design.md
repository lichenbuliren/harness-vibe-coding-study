# Harness Doctor Skill Design

## Goal

Build a read-only `harness-doctor` skill and command that diagnose repository
Readiness through the shared core, explain candidate gaps, and render one
canonical assessment without changing its conclusions.

## Success Criteria

`feat-009` is complete when:

- `skills/harness-doctor` is a valid Codex skill with matching UI metadata;
- its command supports JSON, terminal text, Markdown, and HTML views;
- every view is rendered from one shared-core assessment;
- renderers cannot inspect the target or recalculate maturity;
- the command never writes the target or executes target commands;
- candidate bottlenecks, Unknowns, limitations, and Effectiveness status are
  visible in every human-readable view;
- fixture and skill-contract tests pass;
- this repository runs Doctor verification through `./init.sh`.

## Baseline Failure

The existing machine-local `harness-creator` validator is the RED baseline.
Against this repository it reports:

```json
{
  "overall": 96,
  "bottleneck": "state",
  "subsystems": [
    "instructions",
    "state",
    "verification",
    "scope",
    "lifecycle"
  ]
}
```

This violates the accepted product contract because it:

- emits a single total score;
- uses the obsolete subsystem taxonomy;
- identifies one bottleneck without preserving ties;
- contains no Unknown or Effectiveness boundary;
- couples audit behavior to the creator skill.

The new Doctor tests must fail until those behaviors are replaced.

## Chosen Approach

Implement a thin skill and command over `packages/harness-core`.

```text
target repository
      |
      v
inspectHarness()       shared core owns evidence and conclusions
      |
      v
canonical Assessment
      |
      +---- JSON        identity serialization
      +---- Text        terminal view
      +---- Markdown    review/share view
      +---- HTML        standalone share view
```

Rejected alternatives:

- putting diagnostic rules in `SKILL.md` would let agent interpretation drift
  from the core;
- copying the core into the skill would create two sources of truth;
- extending the old creator validator would retain total-score and taxonomy
  debt.

The source skill imports the repository package. Product integration in
`feat-011` will define the final distribution bundle for both skills and the
shared core.

## Skill Shape

```text
skills/harness-doctor/
  SKILL.md
  agents/
    openai.yaml
  scripts/
    doctor.mjs
    renderers.mjs

tests/harness-doctor/
  doctor.test.mjs
  renderers.test.mjs
  skill-contract.test.mjs
```

The skill folder contains no README, changelog, duplicated theory reference, or
project-specific facts.

`SKILL.md` stays concise and imperative. Its frontmatter contains only:

```yaml
name: harness-doctor
description: Use when a coding-agent repository is hard to start, resume, verify, or diagnose, or when harness readiness and missing project capabilities need inspection.
```

The body instructs the agent to:

1. run the bundled Doctor command;
2. report the five-dimensional profile and unknowns;
3. call low dimensions candidate bottlenecks, never proven causes;
4. present at most three prioritized recommendations;
5. preserve the Readiness/Effectiveness distinction;
6. remain read-only and hand requested repairs to `harness-creator`.

## Command Contract

```text
node skills/harness-doctor/scripts/doctor.mjs \
  --target <directory> \
  [--manifest <relative-path>] \
  [--format text|json|markdown|html] \
  [--pretty]
```

Defaults:

- `--format text`;
- compact JSON unless `--pretty` is supplied;
- stdout output only.

`--pretty` is valid only with JSON. `--help` does not require a target.

Capability gaps are successful diagnoses and exit `0`. Invalid arguments,
unreadable target roots, or internal contract failures exit `2`.

The command does not expose `--output`, `--fix`, `--run`, or setup flags.
Callers may redirect stdout explicitly, but Doctor itself performs no writes.

## Renderer Contract

`renderers.mjs` exports:

```js
renderText(assessment)
renderMarkdown(assessment)
renderHtml(assessment)
```

Renderers accept only an assessment object. They do not receive a target path,
filesystem adapter, rules, or inspector. This makes rescoring and target
mutation structurally unavailable.

Every renderer shows:

- mode and schema version;
- Instructions, Tools, Environment, State, and Feedback in canonical order;
- maturity level and label, including `Unknown`;
- all candidate bottlenecks, or an explicit no-gap result;
- prioritized recommendations;
- unknown evidence;
- Effectiveness status and reason;
- limitations.

Text is optimized for terminal scanning. Markdown uses a table and stable
headings. HTML is standalone UTF-8, uses semantic markup, escapes all dynamic
content, and contains no scripts or external assets.

JSON mode serializes the shared-core assessment directly. It does not create a
Doctor-specific schema or add presentation fields.

## Interpretation Rules

Doctor may say:

- “Environment and State are candidate bottlenecks because they share the
  lowest known Readiness level.”
- “No Readiness gap was detected.”
- “Instructions are Unknown because declared evidence could not be inspected.”

Doctor must not say:

- “The harness is 80% complete.”
- “State caused the task failure” without representative failure evidence.
- “Operational means effective.”
- “Unknown means missing.”

Recommendations preserve core order and rule IDs. Views may truncate the
display only when explicitly requested by the caller; the canonical JSON
remains complete.

## Safety

Doctor:

- reads only through `inspectHarness()`;
- never invokes target initialization, test, setup, or package commands;
- never writes reports, caches, manifests, or state files;
- never follows paths outside the inspected root;
- never converts Unknown to Missing;
- never delegates repair to itself.

If a user requests changes after diagnosis, the skill explains the intended
repair and invokes or recommends `harness-creator` after that product exists.

## Testing Strategy

Because this workspace does not permit unrequested subagents, skill testing
uses deterministic executable scenarios rather than simulated agent
forward-tests.

### RED

- capture the old validator output and assert it contains `overall` plus the
  obsolete taxonomy;
- write command, renderer, and skill-contract tests before new skill files.

### GREEN

Tests cover:

- default Text and all four formats;
- identical JSON to direct shared-core output;
- unchanged levels, labels, bottleneck order, rule IDs, and Effectiveness;
- all-Operational, deficient, non-standard, and Unknown fixtures;
- HTML escaping and absence of scripts/external assets;
- exit `0` for gaps and exit `2` for command errors;
- byte-stable output;
- unchanged target-tree digest;
- frontmatter, description, word count, and `agents/openai.yaml` consistency;
- `skill-creator` `quick_validate.py`.

### REFACTOR

Use synthetic assessments to ensure renderers display supplied conclusions even
when values are unusual. This catches accidental rescoring or omission without
requiring another agent to infer the expected answer.

Forward-testing with fresh agents remains part of `feat-011` when explicit
multi-agent authorization is available.

## Repository Integration

`./init.sh` will run:

```text
node --test tests/harness-doctor/*.test.mjs
uv run --offline --with pyyaml python \
  .../skill-creator/scripts/quick_validate.py skills/harness-doctor
node skills/harness-doctor/scripts/doctor.mjs --target . --format json
```

The repository manifest will declare the Doctor command as a tool, not as a
verification command for target projects.

## Out Of Scope

This feature does not:

- generate or modify harness files;
- execute target verification;
- implement creator planning or write policies;
- package a standalone duplicated core;
- collect representative field outcomes;
- promote any subsystem to level 3.

Those responsibilities remain in `feat-010` through `feat-012`.
