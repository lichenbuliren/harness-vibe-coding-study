# Subagent Delegation Playbook

Use this playbook when the main agent delegates bounded work without losing the
project mainline.

## Workflow

1. Re-anchor the mainline.
2. Decide whether delegation is worth the context and token cost.
3. Create a task packet using `agents/handoffs/subagent-task-handoff.md`.
4. Keep the task bounded.
5. Integrate, reject, or defer the result explicitly.
6. Close the subagent lifecycle.
7. Run a mainline continuity check.

## Final Check

```text
larger goal -> subtask result -> integration decision ->
current project position -> next mainline step
```
