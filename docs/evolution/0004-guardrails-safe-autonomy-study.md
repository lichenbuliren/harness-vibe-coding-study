# 0004 Guardrails Safe Autonomy Study

## Stage

Harness engineering foundations.

## Goal

Study the Constraints, Guardrails & Safe Autonomy module from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
and define this repository's initial policy for safe agent autonomy.

## Methodology Used

- Source inventory from the upstream module
- Parallel sub-agent research across three source groups
- Cross-source synthesis by the orchestrating agent
- Project-local extraction into `harness/guardrails-safe-autonomy.md`

## Source Groups

- Anthropic: sandboxing, MCP code execution, and task-shaped tool design
- OpenHands and Lurkr: prompt injection, hard policies, capability-risk
  scanning, and scanner limitations
- Thoughtworks and Claude Code docs: internal quality, reference anchoring,
  humans on the loop, verification, sub-agents, and context hygiene

## Outcome

The project adopted an initial safe-autonomy principle:

```text
more autonomy requires stronger boundaries
```

Safe autonomy should reduce approval fatigue by enforcing filesystem, network,
credential, tool, prompt, and verifier boundaries rather than relying on
frequent confirmation prompts.

## Artifacts Produced

- `harness/guardrails-safe-autonomy.md`
- Updated `harness/index.md`
- Updated `docs/evolution/index.md`

## Shareable Takeaway

The opposite of unsafe autonomy is not constant human approval. The better path
is explicit boundaries: least-privilege workspaces, network controls, secret
hygiene, task-shaped tools, prompt-injection defenses, static capability scans,
and verifier gates. Humans should improve the harness and approve meaningful
risk, not micromanage every low-risk command.

## Open Questions

- What should the default filesystem and network policy be for future lab
  agents?
- Should this project adopt a static capability scanner once agent tool code
  exists?
- Where should MCP trust decisions and exceptions be recorded?
- Which verifier gates are mandatory for lab milestones?
