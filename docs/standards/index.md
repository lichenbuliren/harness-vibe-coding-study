# Standards

`docs/standards/` stores project standards that may apply across harness,
documentation, directory structure, lab projects, agent behavior, and future
templates.

Standards are stronger than observations. A note belongs here only when future
agents should treat it as a reusable rule, not merely as a historical lesson.

## Placement

Use this directory for cross-cutting standards such as:

- repository and directory standards
- documentation placement standards
- naming and indexing standards
- delivery and verification standards that apply beyond one lab run
- reusable agent operating standards

Prefer more specific surfaces when the rule is narrower:

- `harness/`: harness methodology, delivery contracts, adapters, run records
- `evals/`: rubrics, checklists, and quality gates
- `docs/principles/`: stable beliefs and guiding constraints
- `docs/patterns/`: reusable but less mandatory patterns
- `docs/evolution/`: stage-level narratives and shareable lessons
- `AGENTS.md`: runtime rules every future agent must obey

## Standard Capture Rule

When a user correction, review finding, failed run, or repeated friction reveals
a reusable rule, the agent should classify the lesson and propose or apply the
right documentation update.

The agent should ask:

- Is this a one-off issue, or a reusable standard?
- Is the standard about harness delivery, directory structure, documentation,
  evaluation, lab implementation, or agent behavior?
- Which future reader needs to see it before repeating the mistake?
- Does it need a runtime rule in `AGENTS.md`, a durable standard here, or both?

Default flow:

```text
observe correction -> classify standard type -> choose canonical surface ->
update docs -> verify links/status -> commit
```

The agent may use skills such as `grill-with-docs` to sharpen terminology,
challenge placement, and update context or decision documents. If the skill is
not installed or exposed in the current environment, the agent should point to
`docs/tools/grill-me.md` and continue with a lightweight fallback. For larger or
cross-cutting standard changes, the agent may use subagents to review placement,
wording, or consistency, while the lead agent owns the final integration.
Because subagents consume their own token budget and coordination context, the
lead agent should close completed subagents after their results have been
integrated or rejected.

## Standards Registry

Some standards live in this directory. Others live in the more specific
canonical surface that owns the behavior.

- `docs/standards/mainline-continuity.md`: standard for returning to the
  project mainline after side quests, corrections, and stage-level subtasks.
- `docs/patterns/standard-capture-loop.md`: high-priority method for deciding
  when and where reusable lessons become standards.
- `harness/agent-delivery-contract.md`: delivery, verification, commit, and
  evidence expectations for lab and harness work, including subagent lifecycle
  and cost control.
