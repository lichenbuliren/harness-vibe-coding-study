# Capability Discovery

This module defines when an agent should look for existing skills, tools,
plugins, playbooks, scripts, or runtime capabilities before doing work directly.

It is a conditional gate, not a mandatory ritual for every task.

## Core Gate

```text
task intake -> classify capability need -> inspect available capabilities ->
search installable capabilities when useful -> evaluate trust and fit ->
use / recommend / fallback -> record reusable gap if needed
```

## Trigger Conditions

Run the gate when:

- the user explicitly mentions skills, plugins, tools, workflows, or automation
- the task is in a specialized domain such as testing, frontend design,
  documents, spreadsheets, presentations, security review, code review,
  deployment, performance, or accessibility
- the task likely has a mature reusable workflow that would improve quality
- the agent is unsure whether the current environment already has a relevant
  skill or tool
- the task has repeated often enough that a skill or playbook may be warranted
- the user asks for a better way to do recurring work

## Skip Conditions

Skip the gate when:

- the task is a simple status check, direct file lookup, or one-command answer
- the repository already has a clear script, playbook, or standard
- capability search would cost more than direct execution
- the user explicitly asks not to use external tools or not to install anything
- using a capability would introduce unnecessary trust, network, or
  supply-chain risk

## Discovery Order

Use the lightest useful path:

1. Check current instructions and exposed tools.
2. Check repo-local docs, scripts, playbooks, and `docs/tools/`.
3. Check installed skills when the task matches a known skill category.
4. Search installable capabilities only when a relevant external capability is
   likely.
5. Fall back to direct work when discovery does not produce a trustworthy fit.

## Installation Boundary

Do not silently install new skills, plugins, packages, or connectors unless the
user explicitly asks for installation or the repository has an approved install
workflow.

If installation is useful but not authorized, report the capability, why it
helps, source/trust signal, install command or documentation link, and fallback
path.

## Relationship To Other Loops

```text
capability discovery gate: choose the right skill/tool/playbook
delivery loop: prove the current task
orchestration loop: coordinate multiple agents into one verified result
learning loop: turn reusable friction into future behavior
```

Use the learning loop when repeated capability gaps should become a new
standard, playbook, template pack, or skill candidate.
