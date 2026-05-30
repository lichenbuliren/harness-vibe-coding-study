# Guardrails and Safe Autonomy

This note distills the Constraints, Guardrails & Safe Autonomy module from
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
for this repository.

The goal is to define how agents can act with more autonomy without relying on
constant permission prompts or unsafe trust.

## Source Set

- [Beyond permission prompts: making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Code execution with MCP: building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Mitigating Prompt Injection Attacks in Software Agents](https://openhands.dev/blog/mitigating-prompt-injection-attacks-in-software-agents)
- [Assessing internal quality while coding with an agent](https://martinfowler.com/articles/exploring-gen-ai/ccmenu-quality.html)
- [Anchoring AI to a reference application](https://martinfowler.com/articles/exploring-gen-ai/anchoring-to-reference.html)
- [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)
- [Claude Code: Best practices for agentic coding](https://code.claude.com/docs)
- [Lurkr](https://github.com/agentveil-protocol/lurkr)

## Working Definition

Safe autonomy means an agent can act freely inside explicit, enforced
boundaries.

It does not mean:

- ask the human for every command
- trust the model to self-police
- rely on one confirmation prompt as the safety boundary
- assume sandboxing alone is enough

For this project:

```text
more autonomy requires stronger boundaries
```

The goal is to reduce approval fatigue while increasing actual safety.

## Core Claims

### 1. Permission Prompts Are Not A Security Model

Frequent confirmation prompts can reduce usefulness and train users to approve
without reading. Safer autonomy comes from hard boundaries: filesystem scope,
network scope, credential isolation, command policy, and review gates.

Sources: [Anthropic sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing),
[OpenHands prompt injection](https://openhands.dev/blog/mitigating-prompt-injection-attacks-in-software-agents).

### 2. Sandbox Boundaries Must Cover Filesystem And Network

Filesystem isolation limits unintended local mutation. Network isolation limits
exfiltration, malware fetches, and unreviewed external calls. Either one alone
leaves a major escape path.

Sources: [Anthropic sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing),
[OpenHands prompt injection](https://openhands.dev/blog/mitigating-prompt-injection-attacks-in-software-agents).

### 3. Secrets Must Stay Out Of Model-Visible Context

Credentials, signing keys, API tokens, and sensitive intermediate data should
not be passed into prompts, chat messages, tool outputs, or model arguments.
Keep them outside the sandbox or expose only scoped, task-specific access.

Sources: [Anthropic sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing),
[Lurkr](https://github.com/agentveil-protocol/lurkr).

### 4. Tools Are Part Of The Control Surface

Tool names, schemas, descriptions, output shape, pagination, and error messages
all influence agent behavior. Effective tools are task-shaped, not thin wrappers
around every backend endpoint.

Sources: [Anthropic tools](https://www.anthropic.com/engineering/writing-tools-for-agents),
[Anthropic MCP code execution](https://www.anthropic.com/engineering/code-execution-with-mcp).

### 5. Code Execution Can Be Safer Than Tool Chaining

When an agent needs many tool calls or large intermediate results, controlled
code execution can keep intermediate data inside the execution environment and
return only the useful slice or summary to the model.

Sources: [Anthropic MCP code execution](https://www.anthropic.com/engineering/code-execution-with-mcp).

### 6. Prompt Injection Risk Comes From Trust Boundary Mixing

Prompt injection becomes dangerous when untrusted content can influence an
agent that also has access to secrets, filesystem mutation, shell execution, or
network exfiltration.

Sources: [OpenHands prompt injection](https://openhands.dev/blog/mitigating-prompt-injection-attacks-in-software-agents),
[Lurkr attack model](https://github.com/agentveil-protocol/lurkr).

### 7. Internal Quality Is A Safety Concern

Feature-complete code can still introduce semantic drift, complexity, and hidden
debt. That debt makes future agent work less reliable. Quality checks need to
move into the loop, not wait until late manual review.

Sources: [Thoughtworks quality](https://martinfowler.com/articles/exploring-gen-ai/ccmenu-quality.html),
[Thoughtworks humans and agents](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html).

### 8. Humans Should Be On The Loop

Humans should own intent, constraints, and outcome judgment. Agents can own much
of the implementation loop. When output fails, the durable fix is often to
improve the harness, not manually patch every artifact.

Sources: [Thoughtworks humans and agents](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html),
[Claude Code docs](https://code.claude.com/docs).

## Guardrail Primitives

### Autonomy Boundary

Define what the agent may do without asking:

- read scope
- write scope
- command scope
- network scope
- credential scope
- deployment/publish scope
- human approval triggers

### Filesystem Isolation

The default should be least privilege:

- read only what the task needs
- write only to the assigned workspace or explicit files
- never mutate unrelated user files
- keep generated scratch output out of committed source unless requested

### Network Isolation

Network access should be explicit:

- allowlist domains when possible
- block unknown egress in autonomous runs
- treat external content as untrusted
- review external MCP endpoints before enabling them

### Credential Handling

Secrets should not enter model-visible context.

Avoid:

- printing env vars
- pasting keys into prompts
- returning credentials from tools
- mounting broad secret stores into agent environments

Prefer:

- scoped credentials
- separate signing/deploy steps
- redacted logs
- human approval for privileged actions

### Tool Boundary

Tools should be:

- task-shaped
- narrowly named
- schema-explicit
- output-limited
- failure-informative
- evaluated with realistic tasks

Avoid API-shaped wrappers that force the agent to discover workflow semantics
through trial and error.

### Code Execution Boundary

Use controlled code execution when:

- many tool calls would otherwise flood context
- large intermediate results can stay local
- filtering or aggregation is safer in code than in the prompt

But require:

- resource limits
- sandboxing
- cleanup model
- output redaction
- traceability

### Prompt Injection Boundary

Treat these as high-risk:

- external web pages
- issue comments and PR text from unknown users
- README or docs from untrusted repos
- tool outputs that include instructions
- generated files that ask the agent to ignore prior rules

Untrusted content may be data. It must not become authority.

### Static Capability Scanning

Static scanners such as Lurkr can surface repository-visible capability risks:

- prompt interpolation
- credential-to-context leakage
- shell-capable tools without approval
- external MCP endpoints
- hidden capabilities beyond manifests
- risky GitHub workflow patterns
- eval/subprocess/file/network behavior inside tools

Static scanning is not proof of safety. It is an early warning layer.

### Reference Anchoring

Reference applications, templates, and runnable exemplars can constrain agent
output. Drift reports should be scoped to relevant commits or folders so the
signal stays actionable.

### Human Boundary

Humans should focus on:

- goals
- acceptance criteria
- irreversible decisions
- trust boundaries
- exception approvals
- quality judgment
- improving the harness when failures repeat

Humans should not need to approve every low-risk command inside a well-defined
boundary.

## Verification Contract

An autonomous task is not complete until there is evidence.

Possible evidence:

- tests pass
- build passes
- lint/typecheck pass
- docs link/checklist passes
- screenshot or visual check passes
- static scan passes or known findings are documented
- fresh-context review approves
- human approves the risk boundary

If no verifier exists, the task should report that gap instead of claiming full
completion.

## Repository Practices

### Default Agent Runner Policy

Any future agent runner should start with:

- explicit write scope
- explicit network scope
- no broad secrets in context
- clean workspace or isolated worktree
- deterministic verification command
- escalation path for side effects

### Tool Design Policy

When adding tools:

- design from the task, not the API
- keep parameters obvious
- return concise, structured output
- provide filters and pagination
- return full details only when useful
- include examples if the schema is non-obvious
- evaluate the tool on realistic tasks

### MCP Policy

Treat external MCP servers as third-party dependencies.

Before enabling one:

- identify owner and source
- inspect capabilities
- check network behavior
- check file and shell access
- decide whether it is always-on or on-demand
- record why it is trusted

### Prompt Construction Policy

Do not directly interpolate untrusted input into instruction text.

Prefer:

- templates that separate instruction from data
- quoted data blocks
- explicit labels for untrusted content
- escaping or serialization for structured values
- review for prompt injection paths

### Quality Loop Policy

Use this loop for non-trivial work:

```text
explore -> plan -> implement -> verify -> review
```

Skip heavy planning only for trivial, low-risk tasks.

### Reference Policy

When a desired pattern exists:

- point the agent to the reference
- keep the reference runnable or inspectable
- compare only the relevant scope
- use deterministic codemods before AI when possible
- ask AI to close drift after the drift report is reviewed

## Anti-Patterns

- Approval prompts as the only safety boundary.
- Sandbox without network control.
- Network control without filesystem/secret control.
- Tool overload in active context.
- Thin API wrappers masquerading as agent tools.
- Raw intermediate data returned to the model by default.
- External MCP servers enabled without review.
- Secrets visible in prompts, logs, or tool outputs.
- Scanner clean result treated as safety proof.
- Auto mode without verifier gates.
- Human micromanagement instead of harness improvement.
- Whole-codebase reference comparisons that produce noisy drift reports.

## Adoption Checklist

Before increasing agent autonomy, answer:

- What files may it read?
- What files may it write?
- What commands may it run?
- What network may it access?
- What secrets are excluded from context?
- What external content is untrusted?
- What tool outputs are redacted or summarized?
- What action requires human approval?
- What verifier proves completion?
- What trace or run record will be kept?
- What happens when the verifier fails?
- What static scan or checklist catches capability drift?

## Open Questions For This Repository

- Should this project adopt a static capability scanner such as Lurkr once agent
  tool code exists?
- What is the default network policy for future lab agents?
- Where should external MCP trust decisions be recorded?
- Which commands should become deterministic hooks rather than prompt
  instructions?
- What is the minimum verifier contract for a lab milestone?

## Source Reliability Notes

- Anthropic and Claude Code docs are vendor-specific; use them as practical
  patterns, not universal standards.
- OpenHands and Thoughtworks are field notes; treat them as operational lessons,
  not formal proofs.
- Lurkr is a static scanner with explicit limitations. It can highlight risks,
  but it cannot prove runtime behavior is safe.
