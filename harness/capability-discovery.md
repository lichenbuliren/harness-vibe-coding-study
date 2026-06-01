# Capability Discovery

This module defines when an agent should look for existing skills, tools,
plugins, playbooks, scripts, or runtime capabilities before doing work directly.

It is a conditional harness gate, not a mandatory ritual for every task.

## Purpose

Agent quality improves when the agent uses the right capability for the task
instead of hand-rolling a weaker workflow. Agent quality also degrades when the
agent searches, installs, or escalates tools for simple work.

Capability discovery exists to make that tradeoff explicit.

## Core Gate

```text
task intake -> classify capability need -> inspect available capabilities ->
search installable capabilities when useful -> evaluate trust and fit ->
use / recommend / fallback -> record reusable gap if needed
```

## Capability Types

Look beyond public skills. Relevant capabilities may include:

- installed skills
- installable skills
- repo-local playbooks
- `docs/tools/` notes
- existing scripts and validation commands
- MCP tools and plugins exposed in the current session
- browser, document, spreadsheet, presentation, or image-generation tools
- runtime-specific workflows such as OMX, Superpowers, or Codex native
  subagents
- external official documentation when SDKs, APIs, rules, or pricing may have
  changed

## Trigger Conditions

Run the gate when one or more are true:

- the user explicitly mentions skills, plugins, tools, workflows, or automation
- the user asks whether a capability exists
- the task is in a specialized domain such as testing, frontend design,
  documents, spreadsheets, presentations, security review, code review,
  deployment, performance, or accessibility
- the task likely has a mature reusable workflow that would improve quality
- the agent is unsure whether the current environment already has a relevant
  skill or tool
- the task has repeated often enough that a skill or playbook may be warranted
- a current harness loop depends on optional tooling, such as documentation
  sharpening, browser verification, or multi-agent orchestration
- the user asks for a better way to do recurring work

## Skip Conditions

Skip the gate when:

- the task is a simple status check, direct file lookup, or one-command answer
- the repository already has a clear script, playbook, or standard for the task
- capability search would cost more than direct execution
- the task must be completed offline and no relevant local capability is known
- the user explicitly asks not to use external tools or not to install anything
- using a capability would introduce unnecessary trust, network, or supply-chain
  risk

## Discovery Order

Use the lightest useful discovery path:

1. Check current instructions and exposed tools.
2. Check repo-local docs, scripts, playbooks, and `docs/tools/`.
3. Check installed skills when the task matches a known skill category.
4. Use a skill discovery helper, package index, or web source only when a
   relevant external capability is likely.
5. Fall back to direct work when discovery does not produce a trustworthy fit.

Do not keep searching after a sufficient local capability is found.

## Trust And Fit Review

Do not recommend or install a capability just because it appears in search
results.

Evaluate:

- source reputation
- install count or adoption signal when available
- maintenance activity
- whether the capability matches the actual task
- permission and network implications
- whether the repository already solves the problem
- whether the task needs official documentation instead of a community skill
- whether the capability would be easy for future agents to discover

Prefer official or repo-local capabilities for high-stakes, security-sensitive,
financial, legal, medical, account, dependency, or infrastructure tasks.

## Installation Boundary

An agent may inspect available capabilities and recommend install commands.

Do not silently install new skills, plugins, packages, or connectors unless the
user explicitly asks for installation or the repository has an existing
approved workflow for that install.

If installation is useful but not authorized, report:

- capability name
- why it helps
- source and trust signal
- install command or documentation link
- direct fallback path

Then continue with the best fallback unless the user asks to install.

## Output Expectations

For small tasks, no visible capability-discovery report is required.

For meaningful tasks where capability choice affects the result, record:

- capability considered
- capability used or rejected
- reason for the decision
- fallback used, if any
- installation or trust gap, if relevant

Use the final response, run record, evolution entry, or `docs/tools/` depending
on the task size.

## Relationship To Other Loops

```text
capability discovery gate: choose the right skill/tool/playbook
delivery loop: prove the current task
orchestration loop: coordinate multiple agents into one verified result
learning loop: turn reusable friction into future behavior
```

Run capability discovery before deep delivery or orchestration work when the
trigger conditions apply. Use the learning loop when repeated capability gaps
should become a new repo standard, playbook, template pack, or skill candidate.

## Anti-Patterns

- searching for skills before understanding the task
- searching for every tiny task
- silently installing tools
- trusting installable skills without source review
- using community skills where official docs are required
- ignoring repo-local scripts or playbooks
- blocking progress because no perfect skill exists
- forgetting to record a repeated capability gap
