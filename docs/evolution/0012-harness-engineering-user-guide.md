# 0012 - Harness Engineering User Guide

## Goal

让第一次接触 `harness-engineering` 的协作者只阅读一份文档，就能完成本地安装、
Creator 规划与应用、Context 恢复、初始化验证、Doctor 诊断和常见故障处理。

## Starting Point

产品已有本地 marketplace、安装器和两个 namespaced skills，但 onboarding 信息
分散在 `docs/index.md`、两个内部 `SKILL.md` 和演进记录中。这些材料足以供开发者
追溯实现，不足以让陌生用户独立接入。

外部读者也容易把 local marketplace 误解成正式公开分发渠道。

## Decision

采用一份渐进式主指南，而不是拆分安装、Creator、Doctor 和 FAQ：

- 前部提供 5 分钟首次接入路径；
- 后部按需展开行为边界、结果解释、非标准项目、维护和排障；
- README 保持 review map，只增加一个产品入口；
- `docs/index.md` 把指南列为首要用户文档，内部源码链接保持为实现参考。

生成的 plugin metadata 没有加入仓库相对文档 URL。当前没有稳定公共文档地址，
相对路径在安装 cache 中也不能可靠指向源码仓库；添加它会制造一个看似正式但
无法跨环境工作的入口。

## Canonical Workflow

契约测试锁定以下顺序：

1. `node scripts/install-harness-plugin.mjs`
2. 新建 Codex thread
3. `$harness-engineering:harness-creator`
4. 完成真实 `Project Context Restoration`
5. `./init.sh`
6. `$harness-engineering:harness-doctor`

指南同时明确：Creator 不覆盖项目事实，Doctor 保持只读，legacy bare
`$harness-creator` 不属于本 plugin，Readiness 不证明 Effectiveness。

## Evidence

- 文档契约测试先因指南与导航缺失而 0/3 失败。
- 主指南加入后，workflow 与 evidence-boundary 两项通过，导航项继续失败。
- README 和 docs index 接入后，文档契约 3/3 通过。
- Harness Product suite 从 18 增至 21，21/21 通过。
- `./init.sh` 通过 122 tests、official plugin validator、两个 official skill
  validators、隔离 real-Codex install 和 field-result validation。
- `git diff --check` 无错误。

## Distribution Boundary

当前指南服务两类读者，但只提供一种可执行安装路径：

- 仓库协作者可以使用 local marketplace 完成安装；
- 外部用户能明确看到尚无公开 marketplace 或独立安装包。

指南没有把未来公开发布写成已经存在的能力。

## Next Validation

下一步不是增加更多文档，而是让一名未参与设计的用户仅依据
`docs/harness-engineering-guide.md` 完成一次真实项目接入，记录卡点、错误操作和
需要回看的章节。只有可复现摩擦才应驱动下一轮 onboarding 调整。
