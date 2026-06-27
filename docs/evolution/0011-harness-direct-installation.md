# 0011 - Harness Direct Installation

## Goal

把已经通过产品集成测试的 `harness-engineering` plugin 变成可直接安装、可被新
Codex 进程发现、可执行 Creator-to-Doctor 首次流程的本地产品入口。

## Starting Point

仓库能够确定性生成 plugin package，但没有 Codex marketplace、安装命令或真实
安装验证。当前机器只能发现历史遗留的 bare `$harness-creator`，不能发现本项目
的 Doctor，也无法区分旧 skill 与新产品。

## Decisions

- 采用 Codex 标准 plugin namespace：
  `$harness-engineering:harness-creator` 与
  `$harness-engineering:harness-doctor`。
- 不增加 bare alias，避免与已有 `$harness-creator` 发生来源歧义。
- marketplace 保留在仓库内；安装器先生成完整 package，再注册和安装。
- 每次本地安装添加唯一 build metadata，避免 Codex plugin cache 复用旧产物。
- 首次验证必须使用隔离 `CODEX_HOME` 和真实 Codex CLI，而不是只检查生成目录。

## Problems Found

### Marketplace lifecycle contract

Codex marketplace schema 不接受 `NOT_REQUIRED`；本地 plugin 使用
`ON_INSTALL`。安装命令也不能直接从任意 package directory 安装，必须先注册
marketplace。

### Cache identity

相同版本会命中已有 plugin cache，不能证明新生成产物被安装。安装器因此只在
staged package 中增加一次 `+codex.<token>` build metadata，不修改 canonical
source version。

### Imprecise Doctor recommendation

一个 operational requirement group 原来使用复合 recommendation。当
`init.sh` 已存在但环境 metadata 缺失时，Doctor 仍会建议增加初始化命令。
规则现已拆成逐 requirement recommendation，assessment 只组合真正未满足的项。

## Implementation

- `.agents/plugins/marketplace.json` 定义仓库本地 marketplace。
- `scripts/install-harness-plugin.mjs` 生成、注册、安装并核对 exact version。
- `scripts/verify-harness-plugin-install.mjs` 创建隔离 Codex home 和空目标仓库，
  验证新进程发现、Creator plan/apply、生成的 `init.sh` 和 Doctor 输出。
- `init.sh` 把真实安装 verifier 纳入 restart check。
- `docs/index.md` 提供唯一安装命令和 canonical skill 名称。

## Evidence

- 全量 core、Doctor、Creator、product、field suite：119 tests，0 failures。
- 隔离 verifier 返回 `freshProcessDiscovery: passed`，Creator 创建 Context
  restoration feature，生成的初始化命令通过。
- 隔离 Doctor 对部分 operational 环境只建议 `Add environment metadata.`。
- `./init.sh` 通过全部测试、official plugin validator、两个 official skill
  validator 和 field-result validator。
- live Codex home 安装
  `harness-engineering@harness-engineering-local`
  `0.1.0+codex.local-20260627-165001`。
- 新 `codex debug prompt-input` 进程发现两个 `harness-engineering:*` skill。

## Evidence Boundary

这轮证明的是 distribution、discovery 和 first-run workflow 的 Operational
Readiness，不是 Harness Effectiveness。新安装的 skill catalog 需要新 Codex
thread 才会进入当前 App 的可用上下文。旧 bare `$harness-creator` 仍是独立安装，
不属于本 plugin。

## Next Step

在新线程中对代表性仓库依次调用 Creator 和 Doctor，记录真实用户首次使用摩擦。
只有出现可复现反馈时才迭代安装或交互；只有独立、重复、跨会话任务才能推进
Effectiveness 结论。
