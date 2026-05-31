# Standard Capture Loop Methodology

## Stage

Phase 3B - Harness engineering validation through live collaboration.

## Goal

Mark the standard-capture loop as a high-priority project methodology for future
sharing.

The lesson is broader than a single Dinner Picker feature and broader than a
single harness document. It describes how the project learns when the user,
reviewer, test suite, or browser verification exposes a reusable gap.

## Methodology

The reusable loop is:

```text
observe correction -> classify lesson -> choose canonical surface ->
update standard -> verify discoverability -> commit -> cite in evolution
```

This loop is important because it turns live collaboration into durable project
memory. It prevents the same class of agent mistake from being rediscovered by
future agents.

## Decision

Record the method as a reusable pattern and mark it high priority.

The method now has three surfaces:

- `docs/patterns/standard-capture-loop.md` for the reusable method
- `docs/standards/index.md` for standard routing and discoverability
- `AGENTS.md` / `harness/agent-delivery-contract.md` for runtime enforcement
  and delivery-specific behavior

## Artifacts

- `docs/patterns/standard-capture-loop.md`
- `docs/patterns/index.md`
- `docs/standards/index.md`
- `docs/evolution/0015-project-standards-capture.md`
- `docs/harness-engineering-summary-zh.md`

## Shareable Takeaway

The most important harness learning may come from the moments where the user has
to correct the agent.

The mature response is not only "fix the issue." It is:

```text
fix the issue + teach the project how not to repeat it
```

This is one of the core mechanisms by which an AI-first repository improves
over time.

## Open Questions

- Should this pattern eventually become a reusable skill?
- Should every stage-level run record include an explicit "standard capture"
  check?
