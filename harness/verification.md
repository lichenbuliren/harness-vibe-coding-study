# Verification

This module defines how this project verifies agent work.

It answers: what kinds of checks exist, when to use each, and how to combine
them into a trustworthy completion gate.

## Core Claim

Verification is not one activity. It spans two fundamentally different families:

- **Deterministic checks** produce the same answer every time. They are
  mechanical, automated, and cheap to run.
- **Inferential checks** depend on judgment, context, and expertise. They are
  semantic, require a reviewer, and can disagree about borderline cases.

A good harness uses both. Deterministic checks catch what can be caught
cheaply. Inferential checks catch what requires understanding. The boundary
between them shifts as tooling improves: what is inferential today may become
deterministic tomorrow.

## Deterministic Checks

These checks can be automated. They return pass/fail with no ambiguity.

### When To Use

Use a deterministic check when the artifact being verified has:

- a known expected state (file exists, directory absent, line count in range)
- a testable property (compiles, passes lint, matches schema)
- a measurable constraint (no forbidden imports, no stubs, no placeholder text)

### Taxonomy

| Check | What It Catches | Typical Command |
|-------|----------------|-----------------|
| **File Existence** | Missing expected files | `ls`, `find`, `test -f` |
| **Forbidden File/Dir** | Stale or forbidden artifacts | `find` with exclude patterns |
| **Stub Detection** | Placeholder text left in templates | `grep` for TODO/FIXME/Template |
| **Compile/Build** | Syntax, type, or dependency errors | `tsc`, `pnpm build`, `yarn build` |
| **Lint** | Style or rule violations | `eslint`, `prettier --check` |
| **Unit/Integration Test** | Behavioral regression | `pnpm test`, `yarn jest` |
| **Link Check** | Broken internal references | `rg` for file paths, `find` + check |
| **Structural Shape** | Wrong directory layout | `find` + sort, compared to expected |
| **Schema Validation** | Malformed structured output | JSON/YAML parse, `ajv`, custom checker |
| **Git Status** | Uncommitted or dirty state | `git status --short`, `git diff` |

### When To Skip

- The check is too expensive relative to the risk (skip full suite for a prose
  typo fix)
- No test infrastructure exists and adding it is disproportionate
- The artifact is non-deterministic by nature (generated images, LLM output
  without expected structure)

### Check Order

When running multiple deterministic checks, order by speed and dependency:

```
fastest and most likely to fail first:
  file existence → structural shape → lint → compile → test → link check
```

This minimizes feedback time. A structural shape failure should not wait for a
full test suite to finish.

## Inferential Checks

These checks require judgment. They cannot return a single correct answer
because quality is not fully specifiable in code.

### When To Use

Use an inferential check when the question being asked is:

- semantic: "is this architecture appropriate for the domain?"
- contextual: "does this documentation help a new developer?"
- comparative: "is this better than the alternative?"
- ambiguous: "are there hidden risks?"

### Taxonomy

| Check | What It Judges | Typical Form |
|-------|---------------|--------------|
| **Spec Review** | Whether a spec adequately describes the problem and solution | Reviewer reads the spec against requirements |
| **Code Review** | Whether implementation matches intent, avoids hidden bugs, respects architecture | Reviewer reads the diff with context |
| **Documentation Review** | Whether docs are clear, accurate, discoverable, and free of stale assumptions | Reviewer reads the docs against the codebase |
| **Architecture Review** | Whether the design fits long-term maintainability, constraints, and non-goals | Reviewer evaluates against ADRs and constraints |
| **Visual Review** | Whether UI layout, interaction, and responsiveness match intent | Reviewer screenshots and compares to design |
| **Rubric Scoring** | Structured quality evaluation against defined criteria | Reviewer assigns scores per rubric dimension |

### When To Skip

- The decision is reversible and cheap to fix
- A deterministic check already covers the concern
- The reviewer is the same person who did the work (self-review has blind spots)

### Grading Inferential Checks

Every inferential check should reference a rubric or criteria document when
available. Without criteria, inferential checks drift into personal preference.

Prefer:
```
Rubric: is the architecture appropriate for the domain? (1-5)
- 5: fits current and known near-term needs
- 3: works now but will need rework within 3 months
- 1: wrong abstraction for this domain
```

Avoid:
```
Reviewer: "this architecture feels wrong"
```

## Approval Gates

An approval gate is a judgment call that blocks further work.

### When To Require An Approval Gate

Not every task needs one. Approval gates add latency. The default should be
"no gate, verify and move on."

Require a gate when:

- The change is irreversible or expensive to undo (schema change, API contract,
  public interface, publish)
- The change affects production behavior (flag toggle, config push, deploy)
- The change crosses a trust boundary (environment variable, credential,
  permissions)
- The change affects a safety-critical or compliance-relevant component
- A reviewer or human steward explicitly requested a gate

### Gate Levels

| Level | Who Approves | When Appropriate |
|-------|-------------|-----------------|
| **Self-approval** | The same agent that made the change | Low-risk, deterministic checks passed, change is reversible |
| **Automated gate** | Deterministic check suite | The gate can be fully specified in code |
| **Independent agent review** | A different agent (verifier role) | High-risk or complex, but within agent competence |
| **Human approval** | A person with context | Production-impacting, irreversible, safety-critical, or trust-boundary changes |

### Gate Integration With Verification

```
change produced
  → run deterministic checks
    → all pass? proceed to inferential if needed. fail? fix first.
  → run inferential checks if applicable
    → pass threshold? proceed. fail? iterate.
  → check gate level
    → self-approval? done.
    → automated gate? run gate suite.
    → verifier role? delegate and integrate result.
    → human? prepare evidence package and request approval.
```

## Verification Levels By Risk

This project uses three verification levels. The level is determined by
artifact type and change risk.

### Level 1: Self-Verified

Applies to: low-risk docs edits, trivial config changes, one-step fixes.

Minimum:
```
read what you wrote → no obvious errors → done
```

No formal verification needed. The agent checks its own work and moves on.

### Level 2: Mechanically Verified

Applies to: domain/helper logic, build config changes, template updates,
harness methodology edits, experiment reports, run records.

Minimum:
```
deterministic checks relevant to the change → pass → done
```

The agent runs the relevant automated checks and records the result.

### Level 3: Independently Verified

Applies to: lab validation, UI/mobile behavior, phone/LAN paths,
production-impacting changes, cross-repo changes, harness delivery contract
changes.

Minimum:
```
deterministic checks → inferential review or verifier role →
user-facing path verification when UI → human gate when high-risk → done
```

The agent must not be the only judge of quality.

### Level Selection By Artifact

| Artifact | Default Level | Rationale |
|----------|---------------|-----------|
| Prose doc edit | Level 1 | Reversible, cheap to fix |
| Template change | Level 2 | Affects new projects, needs structural check |
| Harness method doc | Level 2 | Methodology, not production code |
| Domain helper logic | Level 2 | Tested by deterministic suite |
| UI component | Level 3 | Needs browser verification |
| Mobile-first UI | Level 3 | Needs mobile viewport check |
| Phone/LAN path | Level 3 | Needs origin security context |
| Run record | Level 2 | Structured format, deterministic sections |
| Experiment report | Level 2 | Narrative, no production risk |
| Production config | Level 3 | Human gate required |

## Relationship To Other Harness Docs

| Doc | Connection |
|-----|-----------|
| `primitives.md` | Defines the Checkpoint and Evidential Checklist primitives used here. |
| `agent-delivery-contract.md` | Prescribes verification as a required delivery step. |
| `agent-learning-loop.md` | Treats failed verification as a learning trigger. |
| `evals-observability.md` | Defines the eval side: what to measure, how to grade. |
| `guardrails-safe-autonomy.md` | Defines trust boundaries that determine gate levels. |

## Anti-Patterns

- **Deterministic-only verification**: assuming a passing test suite means the
  work is correct. Tests can cover everything only in toy projects.
- **Inferential-only verification**: relying on review without any automated
  checks. Reviewers miss what machines catch.
- **Over-verification**: running the full suite for every typo fix. Let risk
  determine the level.
- **Self-verification for high-risk work**: letting the generating agent be the
  only judge of a production change.
- **Gate theater**: requiring human approval for every commit. Gates must be
  calibrated to actual risk.
