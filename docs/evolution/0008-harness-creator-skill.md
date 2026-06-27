# 0008 - Harness Creator Skill

## Goal

在 shared core 和 Doctor 之上实现非破坏式 Creator，使 agent 可以先检查并展示
计划，再安全创建最小 harness；当长期上下文缺失时，默认生成真实的
`Project Context Restoration` task，而不是编造 `CONTEXT.md`。

## Starting State

机器上的旧 creator 已有技术栈探测、最小模板和 skip-existing 行为，但仍包含：

- `--force` 覆盖；
- 固定文件名与旧五维审计；
- 虚构的 placeholder product features；
- 在 `init.sh` 中安装依赖；
- create、audit、benchmark 和 HTML report 耦合。

shared core 与 Doctor 已实现 canonical 能力模型，但尚无写入产品。

## Method

按 TDD 分成五层：

1. 公开 shared-core 已有的 bounded path safety；
2. 实现纯模板，锁定 Context task 与 check-first init；
3. 实现只读 planner 和 deterministic `planId`；
4. 实现全量 preflight、exclusive create 与 validated merge；
5. 添加薄 CLI 和纯 Text renderer。

每个 `planId` 都包含 exact file precondition 与完整 intended content。Apply 会重新
规划，只有当前 ID 与已展示 ID 一致时才写入。

## Decisions

Creator 只暴露：

```text
creator plan
creator apply --plan-id <sha256>
```

现有文件默认 `skip`。唯一允许的修改是向合法 canonical feature state 语义合并
Context restoration task；legacy、malformed、ID 冲突或 unsafe destination 都
`block`。

所有结果使用 `created`、`merged`、`skipped` 或 `blocked`。没有 overwrite、
force、delete、setup、network 或任意 target-command execution 接口。

生成的 `init.sh` 只检查 harness path、command executable，并打印发现的项目验证
命令。它不安装依赖、不修改 lockfile、不启动服务，也不替用户运行 setup。

## Context Bootstrap

Creator 不创建填有 placeholder 的 `CONTEXT.md`。

Context 缺失时，新 feature state 只有：

```text
harness-context-restoration
Project Context Restoration
status: next
```

任务要求从项目所有者与仓库证据补齐 mission、scope/non-goals、canonical
language、产品或架构边界、evidence status 和 restart assumptions。

如果现有 serial tracker 已有 active feature，该任务以 `not-started` 合并，避免
破坏 one-active-feature invariant。已有 feature object 保持值级不变。

## Safety

shared core 新增 `resolveSafeWritePath()`，会拒绝 repository traversal 和
escaping parent symlink。Planner 不导入写 API；Apply 在首写前验证所有 action。

Create 使用 exclusive `wx`。Merge 绑定源文件 SHA-256 并再次运行 canonical
feature validation。失败只回滚本次 Creator 创建或合并的内容，不删除既有项目
文件。

## Evidence

- shared-core、Doctor 与 Creator 合计 95 tests passed。
- Creator skill 通过官方 `quick_validate.py`。
- plan 连续运行字节稳定，目标 tree digest 不变。
- stale plan 与 blocked plan 在首写前 exit `2`。
- empty、partial、operational、non-standard、malformed 与 conflict 行为有测试。
- source scans 证明 planner 零写入，Creator 无 target command execution 或网络。
- 空目录 plan 创建 5 个工件，无覆盖：
  `.harness/manifest.json`、`AGENTS.md`、`feature_list.json`、`init.sh`、
  `progress.md`。
- 空目录 apply 后 Doctor profile 为 Instructions 1、Tools 2、
  Environment 1、State 2、Feedback 2；Context 与 environment 仍是诚实缺口。
- Effectiveness 保持 `not-assessed`。

## Reusable Conclusion

“写前展示计划”必须成为机器协议，而不只是 skill 文案。把 exact precondition、
intended content 和 options 纳入 `planId`，才能让 agent automation 同时具备可审查
性与 stale-state 防护。

初始化的目标不是制造满分，而是建立可执行的最小状态，并把不能安全推断的项目事实
转化为真实工作。

## Remaining Risk

当前 source skill 仍引用仓库 shared core。Creator 与 Doctor 的可分发 bundle、
完整 cross-product fixture、Context 完成后的闭环，以及真实编码任务
Effectiveness 留给 `feat-011` 和 `feat-012`。

多文件 apply 采用全量 preflight 与 best-effort rollback，不宣称提供文件系统事务。

## Next Step

继续 `feat-011 - Harness Product Integration`：把 creator -> context completion ->
doctor 的完整流程固化为 supported fixtures，并验证可分发产品形态。
