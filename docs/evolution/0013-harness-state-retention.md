# 0013 — Harness State Retention And Work Ownership

## 阶段目标

让根 `feature_list.json` 与 `progress.md` 只承载当前工作，同时把完成阶段保存为
可验证的不可变快照；并避免同一 Git branch 被多个 Codex thread 静默并发写入。

## 起点与量化基线

- 根状态共 31,515 bytes：`feature_list.json` 18,419 bytes，
  `progress.md` 13,096 bytes。
- 当前 tracker 含 15 个 feature，历史完成项与当前项混在一个文件。
- plugin 只有 Creator 与 Doctor，没有用户主动归档入口。
- feature 没有稳定的 branch ownership 契约，也没有跨 worktree 的 writer 协调。

归档后根状态预计为 213 bytes（69 + 144），feature 数为 0；相对本阶段归档前
减少约 99.3%。历史内容保留在 snapshot，不以删除换取体积下降。

## 主要决策

1. 采用 Stage Baseline：`.harness/baseline` 只保存最新 `stageId`。
2. `stageId` 使用阶段闭包 SHA-256 的前 16 位；闭包包含 canonical feature JSON、
   原始 progress 字节、前一 baseline 与 evolution 路径。
3. snapshot 固定为
   `docs/evolution/snapshots/<stageId>/{stage.json,feature_list.json,progress.md}`。
4. `harness-archiver` 是第三个、用户显式触发的 plan/apply skill；不自动归档、
   不运行项目命令、不提交 Git。
5. feature schema 升级到 `1.1.0` 并增加 `branch`。历史完成项可为 `null`；
   未完成项必须声明有效 branch。
6. 一个 branch 同时只允许一个 writer thread。lease 位于 Git common dir，
   以原子独占创建实现协作式阻断；不会提交、不会自动过期，takeover 必须绑定
   当前 lease digest。

## 实现结果

- shared core 新增 feature migration、branch lease、stage identity、manifest、
  compact renderer 与 baseline-chain validator。
- Creator 在 foreign lease 下阻断写入，只释放本次 apply 自己取得的临时 lease。
- Doctor 只读报告 archive eligibility、baseline integrity、branch alignment 与
  branch ownership，并保持 Readiness 与 lifecycle 分离。
- plugin 变为 Creator、Doctor、Archiver 三入口共享唯一 runtime core。
- isolated real-Codex verifier 已发现三个 namespaced skills，并完成 packaged
  Archiver 的 plan/apply smoke。

## 验证证据

- 全量 Node suite：154 tests，154 passed，0 failed。
- `node scripts/verify-harness-plugin-install.mjs`：fresh-process discovery、
  Creator、generated init、Doctor 与 Archiver smoke 全部通过。
- `./init.sh`：core、三个 skill、product、field validation 与官方 validators 通过。
- `git diff --check`：通过。

## 限制

- lease 是本地 cooperative enforcement；绕过 plugin 或直接编辑文件仍可破坏协议。
- lease 不自动判断 thread 是否已失效；恢复必须走 handoff、worktree 或显式 takeover。
- content-addressed snapshot 保证可检测篡改，不等同于远程备份。
- Readiness 与生命周期完整性不能证明一般化 Effectiveness。

## 下一步

用本阶段作为首个真实 Stage Baseline，观察后续任务创建、跨 thread 阻断、恢复与
二次归档是否降低实际上下文成本，并继续把结论限制在可复现实证范围内。
