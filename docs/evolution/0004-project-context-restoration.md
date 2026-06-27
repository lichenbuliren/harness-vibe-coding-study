# 0004 - Project Context Restoration

## Goal

补齐项目长期目的、范围、规范语言和恢复假设，并为未来 creator/doctor 产品建立
不提前宣称实现完成的方向约束。

## Starting State

`CONTEXT.md` 只有三个文档术语，无法回答项目为何存在、理论适用于什么范围、
Harness 的规范模型是什么，以及未来产品如何证明有效。

压缩后的方法论采用 Instructions、Tools、Environment、State 和 Feedback，
现有 `harness-creator` 则混用了子系统、运行机制和生命周期概念。

## Method

通过 `$grill-me` 逐项确认：

- 项目使命和明确非目标；
- 五子系统、生命周期和运行机制的层级；
- creator 与 doctor 的责任边界；
- Codex-first、adapter 扩展的平台策略；
- Readiness 与 Effectiveness 的证据边界；
- 四级成熟度画像和结论晋级机制；
- skill 优先、CLI 后置的交付顺序。

## Decisions

本项目采用“五子系统 + 一条生命周期 + 三个运行机制”作为唯一规范模型。

未来产品采用双入口、单核心：

- creator 创建和改进；
- doctor 只读诊断；
- 两者共享 schema、validator、证据规则和 fixtures。

现有 `harness-creator` 是实现种子，不是永久运行时依赖。Doctor 按能力而非固定
文件名判断缺口。

## Evidence

- `CONTEXT.md` 包含六个按依赖顺序组织的长期上下文部分。
- `docs/learning-harness-summary.md` 明确记录了概念层级和旧模型映射。
- `feature_list.json` 将 `feat-003` 标为完成，并将 `feat-005` 设为下一项。
- `./init.sh` 和 `git diff --check` 通过。

## Reusable Conclusion

稳定理论必须区分系统组成、运行流程和跨系统机制。把不同抽象层级混成一个评分表，
会让诊断规则难以解释，也会遗漏 Tools 和 Environment 等真实能力。

结构完整只能证明 readiness。只有真实任务记录才能支持 effectiveness 判断。

## Next Step

继续 `feat-005 - Template Boundary Review`。识别哪些工件和规则能进入共享
creator/doctor 核心，哪些必须保留为本仓库特有的研究状态和演进叙事。

