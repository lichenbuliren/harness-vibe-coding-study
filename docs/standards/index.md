# Standards / 标准

`docs/standards/` 存储可能适用于 harness、文档、目录结构、lab 项目、agent 行为和未来模板的项目标准。

`docs/standards/` stores project standards that may apply across harness,
documentation, directory structure, lab projects, agent behavior, and future
templates.

标准的约束力强于观察记录。只有当未来 agent 应将其视为可复用规则而非仅仅是历史教训时，才应将内容放入此处。

Standards are stronger than observations. A note belongs here only when future
agents should treat it as a reusable rule, not merely as a historical lesson.

## Placement / 放置

使用本目录存放跨领域标准，例如：

Use this directory for cross-cutting standards such as:

- 仓库和目录标准 / repository and directory standards
- 文档放置标准 / documentation placement standards
- 命名和索引标准 / naming and indexing standards
- 适用于不止一次 lab 运行的交付和验证标准 / delivery and verification standards that apply beyond one lab run
- 可复用的 agent 操作标准 / reusable agent operating standards

当规则范围更窄时，优先使用更具体的界面：

Prefer more specific surfaces when the rule is narrower:

- `harness/`：harness 方法论、交付合约、适配器、运行记录 / harness methodology, delivery contracts, adapters, run records
- `evals/`：评分标准、检查清单和质量关卡 / rubrics, checklists, and quality gates
- `docs/principles/`：稳定信念和指导性约束 / stable beliefs and guiding constraints
- `docs/patterns/`：可复用但强制性较低的模式 / reusable but less mandatory patterns
- `docs/evolution/`：阶段级叙事和可分享的经验 / stage-level narratives and shareable lessons
- `AGENTS.md`：每个未来 agent 都必须遵守的运行时规则 / runtime rules every future agent must obey

## Standard Capture Rule / 标准捕获规则

当用户纠正、评审发现、失败运行或反复摩擦揭示出可复用规则时，agent 应对经验进行分类，并提议或应用正确的文档更新。

When a user correction, review finding, failed run, or repeated friction reveals
a reusable rule, the agent should classify the lesson and propose or apply the
right documentation update.

使用 `../../harness/agent-learning-loop.md` 作为此分类和捕获工作的规范流程。

Use `../../harness/agent-learning-loop.md` as the canonical process for this
classification and capture work.

Agent 应自问：

The agent should ask:

- 这是一次性问题，还是可复用标准？ / Is this a one-off issue, or a reusable standard?
- 该标准是关于 harness 交付、目录结构、文档、评估、lab 实现还是 agent 行为的？ / Is the standard about harness delivery, directory structure, documentation, evaluation, lab implementation, or agent behavior?
- 哪位未来的读者需要在重复犯错之前看到它？ / Which future reader needs to see it before repeating the mistake?
- 它需要在 `AGENTS.md` 中添加运行时规则、在此处添加持久标准，还是两者都需要？ / Does it need a runtime rule in `AGENTS.md`, a durable standard here, or both?

默认流程：

Default flow:

```text
观察纠正 -> 分类标准类型 -> 选择规范界面 ->
更新标准 -> 验证可发现性 -> 提交 -> 在演进中引用
```

```text
observe correction -> classify standard type -> choose canonical surface ->
update standard -> verify discoverability -> commit -> cite in evolution
```

Agent 可使用如 `grill-with-docs` 等技能来明确术语、挑战放置位置并更新上下文或决策文档。如果该技能未安装或在当前环境中不可用，agent 应引用 `docs/tools/grill-me.md` 并使用最接近的轻量级替代方案继续。对于较大或跨领域的标准变更，agent 可使用子 agent 审查放置、措辞或一致性，而主 agent 负责最终整合。由于子 agent 会消耗自己的 token 预算和协调上下文，主 agent 应在结果被整合或拒绝后及时关闭已完成的子 agent。

The agent may use skills such as `grill-with-docs` to sharpen terminology,
challenge placement, and update context or decision documents. If the skill is
not installed or exposed in the current environment, the agent should point to
`docs/tools/grill-me.md` and continue with a lightweight fallback. For larger or
cross-cutting standard changes, the agent may use subagents to review placement,
wording, or consistency, while the lead agent owns the final integration.
Because subagents consume their own token budget and coordination context, the
lead agent should close completed subagents after their results have been
integrated or rejected.

## Standards Registry / 标准注册表

一些标准存于本目录，其他则存于更具体的、掌管该行为的规范界面中。

Some standards live in this directory. Others live in the more specific
canonical surface that owns the behavior.

- `docs/standards/mainline-continuity.md`：在分支任务、纠正和阶段级子任务之后返回项目主线的标准。
  Standard for returning to the project mainline after side quests, corrections,
  and stage-level subtasks.
- `docs/patterns/standard-capture-loop.md`：判断何时以及何处将可复用教训转化为标准的高优先级方法。
  High-priority method for deciding when and where reusable lessons become
  standards.
- `harness/agent-learning-loop.md`：将纠正、失败、评审发现和反复摩擦转化为持久项目行为的规范流程。
  Canonical process for turning corrections, failures, review findings, and
  repeated friction into durable project behavior.
- `harness/agent-delivery-contract.md`：lab 和 harness 工作的交付、验证、提交和证据期望，包括子 agent 生命周期和成本控制。
  Delivery, verification, commit, and evidence expectations for lab and harness
  work, including subagent lifecycle and cost control.
