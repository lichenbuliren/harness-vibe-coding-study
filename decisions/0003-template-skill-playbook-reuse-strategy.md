# 0003 Template Skill Playbook Reuse Strategy

Date: 2026-05-31
Status: Accepted

## Context

Phase 3C exists to extract reusable methodology from validated lab evidence.
The project has evidence from `lab/dinner-picker`, run records, experiment
reports, standards, agent handoffs, and evolution entries.

The main question is not "is this useful?" Most of the practices are useful.
The question is where each practice should live so future projects can reuse it
without carrying unnecessary process weight.

This decision uses `docs/workflows/phase-3c-evidence-map.md` as the evidence
input.

## Decision

Use five reuse forms:

- **Template**: files and directory structure a new project can copy or
  initialize.
- **Skill**: portable agent behavior for judgment, transformation, or workflow
  execution across projects.
- **Playbook**: project-local or template-local step-by-step workflow an agent
  can follow.
- **Standard**: mandatory project rule future agents should obey.
- **Pattern**: shareable method or concept that explains why the practice
  works, without forcing one execution path.

Default rule:

```text
structure -> template
judgment loop -> skill
step sequence -> playbook
mandatory constraint -> standard
shareable concept -> pattern
```

Conservative extraction rule:

```text
promote evidence to the weakest reusable form that future agents can reliably
apply
```

Use a checklist for repeated checks, a standard for mandatory repository
behavior, a playbook for judgment-heavy procedures, a pattern for shareable
explanation, a template skeleton for reusable starting structure, and a skill
only when the workflow has clear triggers, portable steps, verification, and
enough repeated evidence to justify packaging.

Do not publish a skill or packaged template until there is enough evidence to
explain why the behavior should travel across projects.

## Classification

| Candidate | Primary Form | Secondary Forms | Decision |
| --- | --- | --- | --- |
| Agent-First Living Lab | Template skeleton | Pattern | Use as the core starting structure, but do not claim a packaged template yet. |
| Evidence-Based Lab Validation | Checklist | Playbook, template skeleton | Keep as gates and skeleton files before broader packaging. |
| User Feedback To Executable Contract | Playbook | Pattern, future skill candidate | Current evidence supports procedure and explanation; skill packaging needs separate eval. |
| Validation Path Matching | Standard | Checklist | Keep as delivery behavior and checklist before making it a skill. |
| Mobile UI State Contract | Checklist | Playbook | Keep as UI checklist; too domain-specific for a core template. |
| Mobile Interaction Performance Gate | Checklist | Playbook | Keep as checklist; useful but not core to every harness project. |
| Standard Capture Loop | Standard | Pattern, future skill candidate | Strongly validated locally; public skill needs packaging and evaluation. |
| Mainline Continuity | Standard | Template default | Include in template instructions and root agent rules. |
| Subagent Delegation Handoff | Playbook | Template skeleton, future skill helper | Include handoff/playbook in template skeleton; skill helper is future work. |
| Default Specialist Agent Roles | Template skeleton | Playbook | Include as default `agents/roles/` docs; use selectively, not always. |

## Minimum Reusable Package

The first reusable package should be a project-template skeleton, not a public
skill.

The template skeleton should include:

- root agent contract: `AGENTS.md`
- durable context: `CONTEXT.md`
- docs map: `docs/index.md`
- evolution log: `docs/evolution/index.md`
- standards surface: `docs/standards/index.md`
- mainline continuity standard
- standard capture pattern
- agent roles, handoffs, and subagent delegation playbook
- harness run-record schema
- eval rubric and starter checklists
- lab container with README
- decisions index and initial ADR

The first future public skill candidate should be `standard-capture-loop`,
followed by `user-feedback-to-executable-contract`. These are more portable
than the full repository structure because they describe judgment loops an agent
can apply in many projects, but both need separate skill evaluation before
publication.

## Alternatives Considered

### Publish A Skill First

Rejected for now.

Skills are powerful when the behavior is portable and measurable. The project
has future candidates, but the first reuse need is still structural: future
projects need the directory surfaces, contracts, and records that make skill
behavior useful and observable.

### Publish Only A Template

Rejected as insufficient.

Some reusable behavior is not just files. Standard capture, feedback
conversion, and mainline continuity are active agent behaviors. A template can
carry their docs, but future work should still consider skills for repeatable
agent execution.

### Keep Everything As Local Docs

Rejected.

Phase 3B produced enough evidence to extract a reusable package. Keeping all
knowledge local would make future projects rediscover the same structure,
handoff, and evidence practices.

### Turn Every Pattern Into A Skill

Rejected.

This would overfit the current project. Some practices are simply standards or
checklists. A skill should be reserved for behavior that requires judgment,
iteration, cross-project portability, and separate evaluation.

## Consequences

- The next 3C artifact should design the minimum project-template skeleton.
- Skill work is intentionally deferred until the template surface is clear and
  skill candidates have explicit eval plans.
- Review and PRD/coding roles become template defaults, but the main agent must
  still choose the smallest useful role set per task.
- Mobile-specific checklists remain reusable, but not part of the core harness
  template unless the target project is mobile-first.
- Future agents should not relitigate whether structure, skills, playbooks,
  standards, and patterns are the same kind of artifact; they now have distinct
  roles.

## Open Risks

- Evidence comes from one real lab project, so template extraction should stay
  minimal.
- Some verification remains semi-manual; executable evals are still a future
  improvement.
- Public skills need separate evaluation before claiming they improve outcomes.
- Some incidents have run records and checklists but no dedicated experiment
  reports.
- Historical rubric scores are time-local and not directly comparable after the
  rubric evolved.
- Template packaging may expose which docs are too project-local and need
  parameterization.
