# 0014 — Remove Session Handoff

## 阶段目标

删除 `session-handoff.md` 及其产品能力，让 `progress.md` 成为唯一的跨会话连续性
入口，避免两个 Markdown 状态面重复记录当前任务、下一步、阻塞和验证信息。

## 起点与问题

- `feature_list.json` 与 `progress.md` 已经通过 Stage Archive 压缩到 213 bytes。
- `session-handoff.md` 仍有 206 行、14,915 bytes，并保留已完成阶段和旧分支信息。
- Doctor 的 State Readiness 只依赖 Feature State 与 Progress，不使用 handoff。
- Archiver 只归档 Feature State 与 Progress，不处理 handoff。
- Creator 的 `renderHandoff()` 与 `renderProgress()` 重复描述 Context Restoration、
  当前状态和重启步骤。

该文件已经没有独立职责，并位于 Readiness 与 Stage Archive 两条有效链路之外。

## 主要决策

1. 删除根 `session-handoff.md`，不为它增加另一套归档和压缩机制。
2. `feature_list.json` 继续拥有范围、状态、分支、验证与证据。
3. `progress.md` 统一拥有当前状态、下一步、阻塞与跨会话恢复。
4. Branch Lease 继续拥有 one-branch/one-writer 协调。
5. Stage Snapshot、Stage Baseline 与 `docs/evolution/` 继续拥有完成历史。
6. 不保留 CLI flag、manifest field、schema branch、template 或 compatibility
   adapter；旧 manifest 中的 `artifacts.handoff` 明确报告 unsupported key。
7. 历史 evolution、snapshot、spec 与 plan 保持不变，作为当时架构的证据。

## 实现结果

- Shared Core 删除 `handoff` artifact key、schema property 与 discovery mapping。
- Creator 删除 `--with-handoff`、`withHandoff` plan identity、handoff renderer 与
  manifest emission。
- packaged verifier 证明 Creator 不再生成 `session-handoff.md`。
- 根 contract、manifest、init、导航和当前方法论统一到 Progress continuity。
- 当前产品净删除 203 行，减少一个根状态文件和一个 Creator 条件分支。

## 验证证据

- Shared Core RED→GREEN：新增测试先证明旧合同仍接受 handoff，再证明旧 manifest
  返回 unsupported key。
- Creator RED→GREEN：新增测试先证明旧 flag 仍成功，再证明它无写入失败。
- Product RED→GREEN：文档单状态面与真实 packaged Creator 验证先失败后通过。
- 全量 Node suite：156 tests，156 passed，0 failed。
- `node scripts/verify-harness-plugin-install.mjs`：三 skill fresh-process
  discovery、Creator、generated init、Doctor 与 Archiver smoke 全部通过。
- `./init.sh`：不再要求 handoff，core、三个 skill、product 与 field validation
  全部通过。
- `git diff --check`：通过。

## 可复用结论

跨会话恢复是一种 State 能力，不需要独立文件。只要 Feature State 表达范围与状态，
Progress 表达当前位置与下一步，Lease 表达写入者，Archive 表达历史，额外 handoff
文件只会增加同步成本和陈旧风险。

删除重复事实源比为它增加压缩、归档和兼容协议更简单，也更符合
`Minimal but complete`。

## 下一步

使用 Harness Archiver 关闭本阶段，验证第二个 Stage Baseline 能从单一 Progress
continuity surface 生成并保持链路完整。
