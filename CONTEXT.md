# Harness Vibe Coding Study

## Mission

本项目是一个持续演进的 living lab，用于实验、学习和验证 AI coding agent
的 harness 工程化方法。

长期目标不是积累更多零散规则，而是形成一套服务于我们自身工作方式的 harness
工程化理论，并将经过验证的结论沉淀为可复用的 skill、诊断工具、模板和规则。

预期产品采用“双入口、单核心”：

- `harness-creator` 负责创建、补齐和改进项目 harness。
- `harness-doctor` 负责只读诊断缺口、解释风险和给出修复顺序。
- 两个入口共享同一套理论模型、schema、validator 和证据规则。

当前仓库已经实现 shared core、`harness-creator`、`harness-doctor`，并可通过
`scripts/package-harness-plugin.mjs` 生成包含两个 skill 与唯一 shared core 的
`harness-engineering` Codex plugin。它们已通过合同、集成和官方 manifest/skill
验证，但真实任务 Effectiveness 仍只有初步观察证据。

## Scope

本项目面向以 Git 仓库为工作载体的 AI coding agent 项目。默认 agent 能读取和
修改文件、执行 shell 命令、运行验证，并在多个会话之间继续开发。

理论层保持 coding-agent 平台无关；第一版实现以 Codex-native 为默认路径。
Claude Code、OMX 和其他运行时通过 adapter 扩展，不进入核心模型。

本项目不覆盖：

- 通用聊天机器人；
- 模型训练或孤立的 prompt 调优；
- 生产级 agent runtime；
- 非代码业务流程自动化；
- 没有仓库状态的纯云端 agent。

## Canonical Model

Harness 是模型权重之外、将模型能力转化为可靠交付的工作系统。

本项目采用五个同层级的核心子系统：

1. **Instructions**：表达项目意图、入口、边界和不变量。
2. **Tools**：提供 agent 可调用的能力及其权限边界。
3. **Environment**：提供依赖、版本、服务和可复现的执行条件。
4. **State**：持久化当前范围、进度、决策、证据和交接信息。
5. **Feedback**：通过执行结果判断正确性，并指导下一次修正。

五个子系统描述 Harness 由什么组成。它们通过一条执行生命周期协同工作：

```text
Initialize -> Orient -> Select -> Execute -> Verify -> Record -> Handoff
```

以下概念是运行机制，不与五个子系统并列：

- **Scope Control**：由 Instructions、State 和 Feedback 共同执行的范围约束。
- **Verification**：Feedback 子系统产生完成证据的主要过程。
- **Lifecycle**：五个子系统协同工作的时间顺序。

现有 `harness-creator` 使用 Instructions、State、Verification、Scope 和
Lifecycle 五维模型。本项目统一映射为：

- Verification 属于 Feedback；
- Scope 由 Instructions、State 和 Feedback 共同实现；
- Lifecycle 是跨子系统流程；
- Tools 和 Environment 补齐原模型未独立表达的能力。

当现有 `harness-creator` 与本项目规范模型冲突时，以本项目经过证据晋级的理论
为准。

## Product Direction

新产品基于现有 `harness-creator` 的脚本、模板和实践经验继续演进，但最终必须
自包含，不能在运行时依赖机器本地的 skill 路径。

当前以 Codex plugin 中的 skill bundle 为交付面：

- `$harness-creator` 是创建和改进入口；
- `$harness-doctor` 是只读诊断入口；
- 共享脚本负责确定性的诊断和安全改进；
- 共享 schema、规则、模板和 fixtures 保证两个入口结论一致。

独立 CLI 后置。当前稳定入口仍是 packaged skills 及其 Node command，不额外维护
第二套产品协议。

Doctor 按能力判断项目是否缺失 harness，而不是迷信固定文件名。约定路径用于
发现能力，非标准项目可以显式声明等价工件。

Doctor 默认不修改项目。安全修复交给 creator 执行；覆盖、删除或改变现有工作流
必须显式确认。修复后应重新诊断并展示前后差异。

## Evidence Model

诊断严格区分两层证据：

- **Readiness Audit**：检查五个子系统是否有可发现、可执行的结构。
- **Effectiveness Audit**：使用真实任务记录判断 harness 是否改善了交付。

只有 Readiness 证据时，不得声称 harness 实际有效。

Doctor 使用五维成熟度画像，不以单一总分作为核心结论：

- `0 Missing`：关键能力不存在。
- `1 Present`：存在工件，但无法证明可用。
- `2 Operational`：命令或流程可以执行。
- `3 Evidenced`：有真实任务证据支持其有效性。

最低等级子系统是候选瓶颈。只有真实失败证据支持时，才能确认它是实际瓶颈。

Doctor 的规范输出是机器可读 JSON。文本或 Markdown 报告是渲染层。结果至少应
包含证据、缺口、风险、成熟度、置信度、候选瓶颈和按优先级排列的下一步。

研究结论按证据晋级：

```text
hypothesis -> observed -> validated -> canonical
                         |
                         -> deprecated
```

只有 `validated` 结论可以成为 doctor 的强诊断规则，并进入 creator 模板或
validator。未经验证的判断只能作为提示或实验建议。

产品验证同时需要：

- fixture 合同测试，证明 creator 和 doctor 的行为稳定；
- 真实任务对照实验，衡量完成时间、验证完成率、返工、会话数量和恢复成本。

首个同 agent 四任务 pilot 的结论状态是 `observed`：

- bare 与 harness 条件都在首次实现后通过验证，纠错和越界次数相同；
- harness 对微小任务增加了固定的读取、验证和状态记录成本；
- harness 条件留下 machine-readable done/evidence，bare 条件没有 durable
  restart state；
- 该 pilot 不足以证明普遍的速度、成功率或恢复成本改善，也不支持 level 3。

结论晋级需要独立 fresh-session agent、更真实代码库、重复与顺序控制。

## Repository Contract

`CONTEXT.md` 是项目长期目的、边界和规范术语的权威来源。它不保存实现细节、
临时进度或长篇方法论。

详细理论和实践解释放在 `docs/learning-harness-summary.md`。阶段证据放在
`docs/evolution/`。当前范围和完成证据放在 `feature_list.json` 与
`progress.md`。跨会话恢复信息放在 `session-handoff.md`。

本仓库优先保留最小但完备的操作面。新规则必须说明它解决的真实失败、适用条件和
删除条件。能由自动化检查表达的规则，不长期依赖文字提醒。

当前阶段已经统一理论语言，实现并打包 creator/doctor/shared core，完成 fixture
集成验证和一次受限 field pilot。未来会话必须区分“产品已实现”和
“Effectiveness 尚未充分验证”，不得把结构可用描述为方法论已被普遍证明。

新会话应当能够只读取仓库回答：

- 项目为什么存在；
- 理论适用于什么范围；
- Harness 的规范模型是什么；
- 当前哪些结论已经验证；
- 下一项工作和验证方式是什么。

### Existing Terms

**Agent Operating Contract**:
A short, root-level agreement that tells an agent how to start, stay in scope,
verify work, and leave the project restartable.
_Avoid_: full manual, generated reference dump, implementation guide

**Workflow Reference**:
A deeper document for runtime details, routing tables, mode-specific behavior,
or operational background that is useful on demand but too large for the root
agent contract.
_Avoid_: root contract, startup checklist

**Generated Reference Material**:
Tool-produced guidance that may be useful as background but should not own the
root operating contract unless the project explicitly chooses that generator as
the source of truth.
_Avoid_: project contract, canonical policy
