# Harness Product Boundaries

## Purpose

本文定义未来 `harness-creator`、`harness-doctor` 和 shared core 的资产边界。

目标是让创建与诊断共享同一套理论、schema 和证据规则，同时避免把本项目的真实
状态、历史和路径复制进目标仓库。

本文是按需阅读的产品边界 reference。规范术语仍由根 `CONTEXT.md` 管理。

## Boundary Principles

1. **Contract first**：先定义能力和数据契约，再生成文件。
2. **Capability over filename**：判断能力，不迷信固定文件名。
3. **Facts stay local**：项目事实永远由目标项目拥有。
4. **Read before write**：creator 先检查和计划，doctor 始终只读。
5. **Evidence before claims**：结构完整不等于实际有效。
6. **Minimal but complete**：只生成当前可靠执行所需的最小工件。

## Asset Classification

| 现有资产 | 边界 | 决策 |
|---|---|---|
| `SKILL.md` workflow | Creator-only | 按 contract-first 流程重写 |
| `templates/agents.md` | Creator-only | 保留不变量片段，项目事实动态渲染 |
| `templates/feature-list.schema.json` | Shared core | 替换为规范 feature contract |
| `templates/feature-list.json` | Excluded | 不生成虚构业务 feature |
| `templates/progress.md` | Creator-only | 生成唯一的当前状态和恢复面 |
| `templates/init.sh` | Creator-only | 改为 check-first、无默认写入副作用 |
| `scripts/create-harness.mjs` | Creator-only | 基于 shared core 重建 |
| `scripts/validate-harness.mjs` | Shared core | 用成熟度画像替代总分 |
| `scripts/run-benchmark.mjs` | Shared core | 分离 fixture 与 field evidence |
| HTML assessment renderer | Doctor-only | 只渲染规范 JSON，不重新评分 |
| Reference documents | Evidence input | 只有 validated 规则进入 shared core |
| 本仓库 `CONTEXT.md` | Project-owned | 复用契约，不复用内容 |
| 本仓库 feature/progress | Project-owned | 作为证据，不作为模板 payload |
| `docs/evolution/` | Project-owned | 不复制历史叙事 |

## Shared Contracts

### Canonical Model

Shared core 只使用五个同层级子系统：

- Instructions
- Tools
- Environment
- State
- Feedback

Scope Control、Verification 和 Lifecycle 是运行机制，不与子系统并列。

### Context Contract

目标项目必须具有等价的长期上下文能力，内容覆盖：

- Mission
- Scope 和 Non-goals
- Canonical language
- 产品或架构边界
- Evidence status
- Restart assumptions

`CONTEXT.md` 是推荐路径，不是唯一合法文件名。

如果能力缺失或不完整，creator 创建真实的
`Project Context Restoration` bootstrap feature，引导用户补齐事实。

Creator 不得编造事实，也不得用 placeholder 让结构检查虚假通过。

### Feature-State Contract

每个 feature 包含：

```text
id
name
behavior
dependencies
status
verification
evidence
```

规范状态：

```text
not-started -> next -> in-progress -> done
                         |
                         -> blocked
```

串行模式只能有一个 `next` 或 `in-progress`。`done` 必须有成功验证证据。

`verification` 保存可执行命令或明确人工步骤；`evidence` 保存结果，不保存主观信心。

### Progress

持续状态能力是必需的：

- `progress.md` 是默认轻量状态和跨会话恢复面；
- 等价的项目工件可以满足能力要求；
- doctor 判断能否恢复工作，而不是判断文件名是否齐全。

### Initialization Contract

生成的 `init.sh` 必须 check-first、幂等并且默认无写入副作用。

它可以识别技术栈、检查必要工件、报告缺失依赖、执行已有验证并输出下一步。

默认禁止：

- 联网；
- 安装依赖；
- 修改 lockfile；
- 启动长期服务；
- 重写项目配置。

Setup 是独立 creator 行为。可能改变仓库或外部环境时必须有明确意图。

### Diagnostic Contract

Doctor 为 Instructions、Tools、Environment、State 和 Feedback 分别给出：

- `0 Missing`
- `1 Present`
- `2 Operational`
- `3 Evidenced`

Readiness 证明能力可发现、可执行。Effectiveness 必须来自代表性任务结果。

规范输出是 JSON。终端、Markdown 和 HTML 只负责渲染，不得改变结论。

## Creator Boundary

Creator 负责：

- 检查目标仓库；
- 生成变更计划；
- 非破坏地创建或合并项目工件；
- 条件式创建 bootstrap feature；
- 渲染项目专属内容；
- 重新运行 shared inspector。

Creator 写入前必须展示计划。现有文件默认跳过；覆盖或替换需要显式确认。

每项写入结果标记为 `created`、`merged`、`skipped` 或 `blocked`，使部分执行可以
安全恢复。

## Doctor Boundary

Doctor 负责：

- 只读采集证据；
- 区分 Readiness 和 Effectiveness；
- 输出五维成熟度；
- 标记候选瓶颈和置信度；
- 解释未知项；
- 给出优先修复建议；
- 将安全修复建议交给 creator。

Doctor 不修改目标仓库。没有真实失败证据时，只能称最低维度为候选瓶颈。

## Project-Owned Facts

目标项目始终拥有：

- mission、scope 和领域语言；
- 真实 feature、依赖和完成证据；
- 当前进度、阻塞和下一步；
- 验证命令和运行时路径；
- 决策与演进历史。

Shared core 可以定义这些信息的契约，但不能分发填好的事实。

## Safety

发现过程默认只读，并限制在目标仓库。外部证据源必须由用户明确提供。

未知文件或不支持的项目形态产生 `unknown`，不能直接判定为缺失。

Creator 必须保留现有文件、报告冲突，并让重复执行得到稳定结果。

## Verification

### Contract Fixtures

首批 fixture 必须覆盖：

- 空仓库；
- 只有 Instructions；
- 结构完整但没有可执行验证；
- operational minimal harness；
- 非标准等价文件名；
- creator 不得覆盖的冲突文件。

Fixture 证明 inspector 稳定，并证明 creator 只改变预期结果。

### Field Experiments

真实任务对照实验记录：

- verified completion rate；
- completion time；
- correction loops；
- session count；
- restart cost。

Fixture 通过只证明工具一致。Field evidence 才能把规则升级为 validated 或
canonical。

## Implementation Sequence

按依赖顺序实施：

1. **Shared Harness Contract Core**：schema、能力规则、readiness inspector、
   fixture tests。
2. **Harness Doctor Skill**：只读入口、规范 JSON 和人类报告。
3. **Harness Creator Skill**：非破坏写入、Context 门禁、check-first init。
4. **Harness Product Integration**：creator 到 doctor 的闭环 fixture。
5. **Harness Field Validation**：代表性真实任务对照实验。

第一步不包含 creator 写入、HTML renderer 或 Effectiveness 结论。
