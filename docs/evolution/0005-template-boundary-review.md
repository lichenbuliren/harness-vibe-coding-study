# 0005 - Template Boundary Review

## Goal

确定未来 creator/doctor 产品中哪些资产可以共享，哪些属于单一产品，哪些必须留在
目标项目，并建立通向最终产品的完整 feature 路线。

## Starting State

仓库的 `templates/` 只保留边界说明。机器上的现有 `harness-creator` 包含六个
模板、四个脚本和参考资料，但混合了共享规则、固定文件名、placeholder 项目内容、
结构总分和有副作用的初始化行为。

`CONTEXT.md` 已确认双入口、单核心方向，但尚未给每类资产明确归属。

## Method

使用 contract-first 视角逐项检查现有 creator 资产，并确认：

- 静态契约与动态项目事实的边界；
- Context 的条件式初始化门禁；
- Progress 默认、Handoff 按复杂度启用；
- `init.sh` check-first 和 setup 分离；
- feature state 的规范字段与状态机；
- Readiness 与 Effectiveness 的验证边界。

## Decisions

采用 contract-first shared core。Creator 与 doctor 是共享核心之上的薄入口。

Shared core 拥有 schema、能力规则、成熟度、证据模型、规范 JSON 和 fixtures。
Creator 拥有非破坏生成与改进。Doctor 拥有只读诊断与解释。

项目 mission、feature、progress、handoff、验证证据和演进历史始终由目标项目
拥有，不能作为填好的模板内容分发。

## Asset Boundary

现有资产被分类为：

- Shared core：feature schema、validator 思路、fixture 与 benchmark contract；
- Creator-only：agent contract 渲染、progress/handoff/init 生成和安全写入；
- Doctor-only：诊断报告渲染与修复建议；
- Evidence input：参考资料；
- Excluded：虚构 feature 和填好的项目状态；
- Project-owned：Context、真实状态、路径和历史。

详细矩阵见 `docs/workflows/harness-product-boundaries.md`。

## Evidence

- ADR 0002 接受 contract-first shared core，并记录两个拒绝方案。
- Workflow reference 包含 shared contracts、产品边界、安全和验证策略。
- `feature_list.json` 新增 `feat-008` 至 `feat-012`。
- 依赖检查确认所有 feature 引用存在，且只有 `feat-008` 为 `next`。
- `git diff --check` 和 `./init.sh` 通过。

## Reusable Conclusion

模板不应承载虚构事实。稳定复用面是 schema、不变量、检测规则和安全策略；实际
文件内容必须从目标仓库事实生成。

Creator 与 doctor 共享结论的前提不是相似 prompt，而是共同依赖确定性的契约和
fixture。

## Next Step

继续 `feat-008 - Shared Harness Contract Core`。先为 schemas、capability rules、
readiness inspector 和 fixture tests 写独立 spec，再开始实现。

