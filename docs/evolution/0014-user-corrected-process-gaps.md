# User-Corrected Process Gaps As Harness Evidence

## Stage

Phase 3B - Harness engineering validation through the Dinner Picker lab.

## Goal

Turn a recurring collaboration issue into an explicit harness rule: when the
user catches an agent process gap, the agent should decide whether the lesson is
reusable and update the canonical project contract without waiting for another
reminder.

## Methodology

The issue came from live collaboration:

1. The user pointed out that verification and commit discipline should not need
   repeated reminders.
2. We checked where the lesson had already been recorded.
3. We found that evidence existed in run records and evolution notes, but the
   broader self-correction rule was not yet a runtime contract.
4. We split the rule into two surfaces:
   - `AGENTS.md` for immediate agent behavior
   - `harness/agent-delivery-contract.md` for reusable methodology

## Decision

User-corrected agent mistakes are not automatically just chat feedback. They are
potential harness evidence.

Future agents must classify them:

- one-off execution mistake
- reusable process rule
- quality gate or eval gap
- stage-level learning

If reusable, the agent should update the relevant durable project surface before
closing the task.

## Artifacts

- `AGENTS.md`
- `harness/agent-delivery-contract.md`
- `CONTEXT.md`
- `docs/evolution/0014-user-corrected-process-gaps.md`

## Shareable Takeaway

Harness engineering is not only about pre-written rules. It is also about how a
project learns when the agent fails in front of the user.

A mature harness should turn repeated user correction into better future agent
behavior.

## Open Questions

- Should this become a rubric item under `evals/rubrics/`?
- Should future run records include a dedicated "User Correction" section when
  the user changes the process direction?
