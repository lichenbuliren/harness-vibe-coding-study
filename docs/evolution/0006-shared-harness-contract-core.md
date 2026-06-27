# 0006 - Shared Harness Contract Core

## Goal

把 creator 与 doctor 共同需要的 schema、能力规则、状态语义和 Readiness 判断实现为
一个确定性、只读、零第三方依赖的共享核心。

## Starting State

机器上的旧 `harness-creator` validator 使用固定文件名、关键词检查、五分制子项和
单一百分制总分。它曾帮助本仓库补齐基本结构，但存在四个已验证限制：

- `scope`、`lifecycle` 和 `verification` 与新的五子系统模型层级冲突；
- 等价文件名无法显式声明；
- 文案关键词可能改变分数，却不代表能力真实可用；
- 结构总分容易被误读为实际任务效果。

本阶段开始时，shared core 只有设计、边界和 ADR，没有可执行 runtime。

## Method

按 TDD 顺序实现：

1. 先锁定 JSON Schema 2020-12 和声明式 capability rules；
2. 再实现有界路径、manifest 与 symlink 安全；
3. 实现 canonical feature graph 和 lifecycle 不变量；
4. 用 fixture matrix 实现五维 Readiness 分类；
5. 最后添加确定性 JSON CLI，并由本仓库 dogfood。

每层先观察测试因缺失行为而失败，再写最小实现通过。

## Decisions

Shared core 位于 `packages/harness-core`，不是可调用 skill。

它只拥有：

- feature、manifest 和 assessment schema；
- Instructions、Tools、Environment、State、Feedback 五子系统规则；
- bounded discovery 与 feature-state semantic validation；
- `inspectHarness()` library API；
- 规范 JSON CLI 与 contract fixtures。

非标准项目通过 `.harness/manifest.json` 声明等价工件。声明只帮助发现，不能替代
文件存在性、可读性、可执行性和状态合法性检查。

Readiness inspector 只产生 `0 Missing / 1 Present / 2 Operational`。
`3 Evidenced` 保留给后续代表性任务证据。无法公平判断时使用 `level: null` 的
`Unknown`，它不参与候选瓶颈计算。

## Implementation

实现资产包括：

- `schemas/feature-list.schema.json`
- `schemas/harness-manifest.schema.json`
- `schemas/assessment.schema.json`
- `rules/capabilities.json`
- safe path、manifest、feature-state、discovery、assessment modules
- `bin/inspect-harness.mjs`
- conventional、non-standard、malformed 和 unsafe fixtures

CLI 对能力缺口返回 exit `0`，对参数、目标或内部契约错误返回 exit `2`。
输出没有时间戳、host path、随机 ID、elapsed time 或总体分数。

## Dogfood Migration

本仓库的 `feature_list.json` 从 legacy `description` 和字符串 evidence 迁移到：

```text
schemaVersion
mode
features[].behavior
features[].verification
features[].evidence[]
```

`.harness/manifest.json` 显式声明本仓库的 environment、tool、state 和 command
等价工件。`init.sh` 现在运行 shared-core tests 和 self-inspection。

迁移前：

| Subsystem | Level |
|---|---|
| Instructions | 2 Operational |
| Tools | 2 Operational |
| Environment | 1 Present |
| State | 1 Present |
| Feedback | 2 Operational |

迁移后五个子系统均为 `2 Operational`，候选瓶颈为空。

## Evidence

- `node --test packages/harness-core/test/*.test.mjs`：39 tests passed。
- fixture matrix 覆盖 empty、instructions-only、structure-only、
  operational、non-standard、malformed state 和 escaping manifest。
- CLI 连续两次输出字节一致。
- target-tree digest 在 inspection 前后保持一致。
- canonical feature validator 对本仓库返回 `valid: true`、零 findings。
- `node packages/harness-core/bin/inspect-harness.mjs --target . --pretty`
  返回五维 `Operational`、无总分、Effectiveness `not-assessed`。
- `./init.sh` 通过，并包含 core tests 与 self-inspection。

## Reusable Conclusion

Capability-first 不能只靠“支持更多文件名”实现。可靠做法是：conventional defaults
加显式 manifest、独立验证声明、稳定 rule ID、Unknown 语义和可复现 fixture。

Readiness 与 Effectiveness 必须在数据结构中分离，而不只是报告文案中提醒。

## Remaining Risk

当前 core 证明 inspector 一致且只读，不证明规则能提升真实编码任务结果。
它也尚未提供 doctor 的人类报告、creator 的非破坏写入或完整产品分发。

## Next Step

继续 `feat-009 - Harness Doctor Skill`，在不重新评分的前提下把 canonical JSON
渲染为终端和 Markdown 报告，并保持 doctor 完全只读。
