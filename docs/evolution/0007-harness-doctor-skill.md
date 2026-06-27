# 0007 - Harness Doctor Skill

## Goal

在 shared core 之上实现一个只读 Doctor：帮助 coding agent 判断仓库当前具备
哪些 harness 能力、缺少什么、优先检查哪里，同时不把结构 Readiness 误写成
任务 Effectiveness。

## Starting State

旧 `harness-creator` validator 的基线输出包含 `overall: 96`、单一
`bottleneck: state`，以及
`instructions/state/verification/scope/lifecycle` 五项分类。

这个模型与当前 canonical 五子系统不一致，也容易让百分制结构分数看起来像任务
质量。shared core 已解决诊断合同，但尚无人类可读入口或可复用 skill。

## Method

按 TDD 分成三层：

1. 先捕获旧模型反例，并锁定 skill、输出和只读边界；
2. 实现只接收 assessment 的纯 Text、Markdown、HTML renderers；
3. 实现只调用一次 `inspectHarness()` 的薄 CLI，并用真实 fixtures 验证。

Skill 使用官方 `skill-creator` 脚手架生成，再删除占位说明。它不复制 schema、
capability rules 或 assessment 逻辑。

## Decisions

Doctor 支持：

```text
--target <directory>
--manifest <repository-relative-path>
--format text|json|markdown|html
--pretty
--help
```

Text 是默认格式。`--pretty` 只适用于 JSON。能力缺口是有效诊断结果，exit `0`；
参数、目标和 inspection 错误 exit `2`。

JSON 直接序列化 shared-core assessment。三个 renderer 不访问文件系统、不调用
inspector、不重新评分，并保留 canonical 顺序、rule ID、Unknown、
candidate bottlenecks、Effectiveness 和 limitations。

HTML 是无脚本、无外部资源的 standalone document，所有动态值都经过转义。

## Evidence

- Doctor suite：25 tests passed。
- Shared-core regression：39 tests passed。
- JSON 输出与直接 `inspectHarness()` 结果深度相等，重复运行字节一致。
- target-tree digest 在 Doctor 运行前后不变。
- 非标准 manifest 与 unsafe path 的 Unknown 语义均通过 fixture 验证。
- HTML 恶意样例完成转义，且无 `<script>`、外部 URL 或 image。
- 官方 `quick_validate.py` 通过，skill body 少于 500 words。
- 本仓库 Doctor 输出为五项 `2 Operational`、无候选瓶颈，
  Effectiveness `not-assessed`。

## Reusable Conclusion

Doctor 应当是 shared assessment 的解释器，而不是第二套审计器。只要 JSON 保持
直接透传、renderers 保持纯函数、缺口不改变进程成功语义，就能让机器合同与人类
报告共享同一个事实源。

候选瓶颈只能表示“当前最低的已知 Readiness 维度”，不能宣称它是任务失败原因。

## Remaining Risk

Doctor 证明了诊断一致性和只读性，但不会修复仓库。`harness-creator`、二者的完整
fixture workflow，以及代表性编码任务的 Effectiveness 证据仍未实现。

源 skill 当前引用本仓库 shared core；可分发 bundle 留给产品集成阶段处理。

## Next Step

继续 `feat-010 - Harness Creator Skill`：基于相同 shared core 实现 check-first、
非破坏式初始化，并默认引导用户补齐项目特有的 `CONTEXT.md`。
