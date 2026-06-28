# Harness Engineering 使用指南

`harness-engineering` 是一个 Codex plugin，用于为 coding-agent 项目创建或改进
最小、可恢复的 harness，并诊断项目是否具备可发现、可执行的结构。

它包含三个入口：

- Creator：先生成非破坏性计划，再按确认过的计划创建或合并 harness 工件。
- Doctor：只读检查 Instructions、Tools、Environment、State 和 Feedback。
- Archiver：仅在用户主动、显式请求后关闭已完成阶段并压缩当前状态。

## 当前分发边界

当前版本通过本仓库内的 local marketplace 分发，适合已经 clone 本仓库的协作者。
项目尚未发布到公开 Codex marketplace，也没有独立的外部安装包。外部用户目前
需要先取得本仓库，再使用下面的本地安装流程。

安装器生成的 plugin 和 Codex cache 都是构建产物；它们不是第二份应当手工维护的
源码。

## 前置条件

开始前确认：

- 已安装 `node`；
- 已安装并可运行 `codex`；
- 已 clone 本仓库；
- 目标项目是本机可读写的目录。

可以在本仓库根目录检查：

```bash
node --version
codex --version
```

## 5 分钟接入

### 1. 安装 plugin

在本仓库根目录运行：

```bash
node scripts/install-harness-plugin.mjs
```

安装器会：

1. 从当前源码生成完整 plugin；
2. 为本地构建增加 cache-busting version；
3. 注册 `harness-engineering-local` marketplace；
4. 安装并启用 `harness-engineering`；
5. 核对实际安装版本。

### 2. 重新加载 skill catalog

安装完成后，新建 Codex thread。已有 thread 不会自动加载刚安装的 skill catalog。

### 3. 运行 Creator

在新 thread 中说明目标仓库，然后调用：

```text
$harness-engineering:harness-creator
```

例如：

```text
$harness-engineering:harness-creator
请为 /path/to/project 创建最小、可恢复的 coding-agent harness。
```

Creator 会先检查目标并展示 plan。检查计划中的目标目录、actions、blocked items、
内容摘要和 `planId`；只有同一份计划仍然有效时才会 apply。

如果项目缺少 Context，Creator 会创建真实的
`Project Context Restoration` feature。请根据项目证据补全 `CONTEXT.md`，不要
为了通过结构检查填写虚构使命、架构或验证结果。

### 4. 运行项目初始化检查

进入目标仓库，执行 Creator 生成或识别出的初始化命令。默认 harness 使用：

```bash
./init.sh
```

该命令用于证明项目可以重新进入，不代表 Creator 会替你安装依赖或启动服务。

### 5. 运行 Doctor

回到 Codex thread，调用：

```text
$harness-engineering:harness-doctor
```

例如：

```text
$harness-engineering:harness-doctor
请诊断 /path/to/project，并解释最优先的三个 Readiness 缺口。
```

Doctor 保持只读。需要修复时，将诊断结果交回 Creator，不要让 Doctor 静默修改
项目。

### 6. 用户主动归档已完成阶段

确认全部 feature 已为 `done` 且具有 passing evidence，并准备对应的
`docs/evolution/*.md` 后，显式调用：

```text
$harness-engineering:harness-archiver
```

Archiver 先展示只读 plan；用户接受后才 apply。它不会自动归档，也不会替项目提交
Git。归档快照位于 `docs/evolution/snapshots/<stageId>/`，
`.harness/baseline` 指向最新 Stage Baseline。

## Stage Baseline 与状态保留

`feature_list.json` 和 `progress.md` 只保存当前工作集。完成阶段的原始状态、进度和
`stage.json` 进入不可变快照。`stageId` 是阶段闭包 SHA-256 摘要的稳定前缀；
闭包包含 canonical feature JSON、原始 progress 字节、前一 baseline 和 evolution
路径，不使用用户名、机器路径或随机序号。

每个 feature 的 `branch` 记录工作分支。历史迁移的已完成 feature 可以使用
`null`，未完成 feature 必须使用有效 Git branch。

## One branch, one writer thread

同一个 Git branch 同时只允许一个 writer thread。lease 存在 Git common dir，
不会提交到仓库，也不会自动过期。操作语义依次是 `branch-lease claim`、
`branch-lease check` 和 `branch-lease release`：

```bash
CODEX_THREAD_ID="$CODEX_THREAD_ID" \
  node packages/harness-core/bin/branch-lease.mjs claim \
  --target . --feature-id <feature-id>
CODEX_THREAD_ID="$CODEX_THREAD_ID" \
  node packages/harness-core/bin/branch-lease.mjs check --target .
CODEX_THREAD_ID="$CODEX_THREAD_ID" \
  node packages/harness-core/bin/branch-lease.mjs release \
  --target . --lease-id <lease-id>
```

foreign owner 默认 block 且不改文件。优先 handoff 或换 worktree/branch；必须
takeover 时，先生成并核对绑定当前 lease digest 的 takeover plan。

## Creator 工作方式

### Plan-bound apply

Creator 把读取和写入分成两个阶段：

1. `plan` 读取目标状态并生成确定性的 `planId`；
2. `apply` 只接受刚刚展示且目标状态未变化的计划。

如果相关文件在两步之间发生变化，计划会变成 stale，必须重新 plan。这防止旧计划
覆盖新的人类或 agent 工作。

### Action 语义

Creator 会报告以下结果：

| Result | 含义 |
| --- | --- |
| `created` | 目标不存在，已独占创建。 |
| `merged` | 对受支持的结构化状态执行了保守合并。 |
| `skipped` | 已存在可用等价工件，无需修改。 |
| `blocked` | 存在冲突、无效状态或不安全路径，未写入。 |

Creator 不提供 overwrite 开关，也不会删除项目文件。

### 可选行为

- 默认生成或识别 `AGENTS.md`。
- Claude-oriented 项目可选择 `CLAUDE.md`。
- 只有需要跨 session 或多 agent 交接时才增加 handoff。
- Context、领域语言、当前任务和验证证据始终由项目拥有。

Creator 在创建阶段不会：

- 安装项目依赖；
- 访问网络；
- 启动服务；
- 执行目标项目命令；
- 删除或覆盖已有文件；
- 虚构项目事实。

## Doctor 结果解释

Doctor 按固定顺序检查五个子系统：

| 子系统 | Doctor 关注的问题 |
| --- | --- |
| Instructions | Agent 是否能找到短而明确的操作约束？ |
| Tools | 可用命令、工具入口和非标准能力是否可发现？ |
| Environment | 运行时、依赖和初始化方式是否明确？ |
| State | 当前工作、证据和跨 session 状态是否可恢复？ |
| Feedback | 是否存在可执行验证与失败反馈回路？ |

每个子系统返回：

| Level | 含义 |
| --- | --- |
| `0 Missing` | 没有发现所需能力。 |
| `1 Present` | 发现了结构，但尚不能证明可执行。 |
| `2 Operational` | 结构存在且通过对应操作检查。 |
| `Unknown` | 因不安全、不可读或证据不足而无法公平判断。 |

低维度只是 candidate bottleneck，不是任务失败的已证明原因。Doctor 的
recommendation 只描述当前未满足的 requirement，并保留 rule ID 方便追踪。

## 非标准项目

默认约定不是强制文件名。项目可以通过 `.harness/manifest.json` 声明安全的、
repository-relative 等价路径，例如：

```json
{
  "schemaVersion": "1.0.0",
  "artifacts": {
    "instructions": ["PROJECT_GUIDE.md"],
    "context": ["docs/project-context.md"],
    "featureState": ["ops/work.json"],
    "progress": ["ops/status.md"],
    "environment": ["runtime/project.json"],
    "tools": ["runtime/tools.toml"]
  },
  "commands": {
    "initialize": ["scripts/check-project.sh"],
    "verify": ["scripts/check-project.sh"]
  }
}
```

manifest 只帮助 Creator 和 Doctor 发现等价工件。声明不会让缺失、不可读、
不可执行或语义无效的文件自动变成 Operational。绝对路径、目录穿越和逃逸
symlink 会被拒绝。

## 高级命令参考

日常接入应调用 namespaced skill。下面的 Node CLI 是 skill 内部和调试场景使用的
底层命令，不要求普通用户进入 Codex cache 手工运行。

Creator：

```text
creator plan --target <directory> [--agent-file AGENTS.md|CLAUDE.md] [--with-handoff] [--format text|json] [--pretty]
creator apply --target <directory> --plan-id <sha256> [--agent-file AGENTS.md|CLAUDE.md] [--with-handoff] [--format text|json] [--pretty]
```

`--pretty` 只能与 JSON 格式组合；apply 必须重复 plan 阶段使用的选项。

Doctor：

```text
doctor --target <directory> [--manifest <relative-path>] [--format text|json|markdown|html] [--pretty]
```

默认输出 Text。`--pretty` 只适用于 JSON；Markdown 和 standalone HTML 用于
明确需要保存报告的场景。

## 更新与重新安装

本仓库源码更新后，在仓库根目录重新运行：

```bash
node scripts/install-harness-plugin.mjs
```

安装器会生成新的本地 build version，避免 Codex 继续复用旧 cache。安装或更新后
都要新建 thread。

源码与产物边界：

- `packages/harness-core/`：共享判断逻辑的可编辑源码；
- `skills/harness-creator/`、`skills/harness-doctor/`、
  `skills/harness-archiver/`：skill 可编辑源码；
- `plugins/harness-engineering/`：可删除、可重新生成的 plugin 产物；
- `~/.codex/plugins/cache/`：Codex 管理的安装 cache。

不要直接修改 `plugins/harness-engineering/runtime/harness-core` 或 Codex cache；
下次安装会覆盖这些修改。

## 卸载

先删除已安装 plugin：

```bash
codex plugin remove harness-engineering@harness-engineering-local
```

如果不再需要本仓库的 marketplace 注册，再运行：

```bash
codex plugin marketplace remove harness-engineering-local
```

删除 marketplace 前应先删除其中安装的 plugin。

## 故障排查

### 找不到 namespaced skill

确认调用的是：

```text
$harness-engineering:harness-creator
$harness-engineering:harness-doctor
$harness-engineering:harness-archiver
```

然后检查：

```bash
codex plugin list --available --json
```

确认 `harness-engineering@harness-engineering-local` 为 installed 且 enabled。
如果刚安装或更新，请新建 Codex thread。

### 只看到裸名 Creator

机器上已有的 bare `$harness-creator` 是独立 legacy skill，不属于本 plugin。
它不能代表当前 shared core，也不包含本 plugin 的 Doctor。不要把两个来源混用。

### Creator 返回 blocked

检查 blocked action 对应的现有文件、无效 feature state 或不安全路径。Creator
不会为了继续而覆盖冲突；先由用户决定保留、迁移或显式声明等价工件。

### Creator 报告 stale plan

目标状态在 plan 后发生了变化。重新运行 Creator，让它生成并展示新的 `planId`；
不要复用旧 ID。

### Context feature 一直未完成

这是预期行为。Creator 只能创建恢复任务，不能替项目发明事实。与项目所有者一起
补全使命、范围、规范术语、成功证据和 restart assumptions，再更新 feature
evidence。

### Doctor 返回 Unknown

先查看 finding 中的不安全路径、不可读文件、无效 manifest 或有界读取限制。
`Unknown` 不等于 Missing，也不应被强制计入瓶颈。

### 更新后仍像旧版本

重新运行安装器，检查其输出的 exact version，然后新建 thread。不要手工修改 cache
来伪造更新。

### 外部用户无法直接安装

这是当前分发限制，不是用户操作错误。项目尚未提供公开 marketplace 或远程安装
入口；当前必须使用本仓库的 local marketplace。

## Readiness 与 Effectiveness

Creator 和 Doctor 当前验证的是结构 Readiness：agent 是否能发现项目约束、工具、
环境、状态和反馈回路。

Readiness level 2 不能证明 harness 会让真实 coding task 更快、成功率更高或恢复
成本更低。此类结论需要独立、重复、代表性的任务记录。目前 Effectiveness 保持
`not-assessed` 或 bounded pilot 的 `observed`，不得从结构完整性推导普遍有效性。
