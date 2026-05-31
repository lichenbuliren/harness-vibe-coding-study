# Subagent Delegation Playbook

Use this playbook when the main agent wants a subagent to perform bounded work
without losing the conversation's larger direction.

## When To Use

Use a subagent when the work benefits from:

- independent review
- parallel source reading
- bounded implementation in a separate context
- cross-surface documentation consistency checks
- risk analysis before the main agent edits canonical files

Do not use a subagent for trivial lookups or work the main agent must fully redo
to trust.

## Workflow

1. Re-anchor the mainline.
2. Decide whether delegation is worth the context and token cost.
3. Create a task packet using `agents/handoffs/subagent-task-handoff.md`.
4. Keep the subtask bounded with explicit out-of-scope items.
5. Continue only non-conflicting main-agent work while the subagent runs.
6. Read the return report and classify the result.
7. Verify important claims with the smallest useful checks.
8. Integrate, reject, or defer the result.
9. Close the subagent lifecycle.
10. Run a mainline continuity check before final response or next task.

## Mainline Re-Anchor

Before delegation, the main agent should write or mentally hold:

```text
Current phase:
Mainline goal:
Why delegation helps:
Expected integration point:
```

If the subtask cannot be connected to the mainline, do not delegate it.

## Integration Decisions

The main agent can choose:

- `accept`: integrate the result as reported
- `partial`: use some findings and reject others
- `defer`: keep the finding for later without changing current scope
- `reject`: explain why the result is not used

The decision should be visible in the final response, run record, evolution
entry, or changed artifact when the work is meaningful.

## Evidence Requirements

A subagent report is not evidence by itself. It should point to evidence the
main agent can inspect:

- file paths and line references
- command results
- source links or citations
- screenshots or browser observations
- explicit uncertainty and gaps

For code or UI changes, the main agent still owns final verification.

## Final Mainline Check

Close with:

```text
larger goal -> subtask result -> integration decision ->
current project position -> next mainline step
```

This keeps subagent work from becoming an untracked branch of the conversation.
