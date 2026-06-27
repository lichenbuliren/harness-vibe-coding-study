# Documentation Index / 文档索引

`docs/` 存储 harness + vibe coding 研究的方法论和知识。

`docs/` stores methodology and knowledge for the harness + vibe coding study.

## 当前入口

- [`adr/`](adr/)：重要项目决策记录。
- [`evolution/`](evolution/)：项目阶段性演进记录，用于未来复盘。
- [`tools/`](tools/)：支持本项目的工具、插件和 skill 说明。
- [`workflows/`](workflows/)：按需阅读的工作流参考。

## Harness 产品实现

- [`../packages/harness-core/`](../packages/harness-core/)：creator 与 doctor
  共享的 schema、能力规则、Readiness inspector 和 fixture tests。
- [`../skills/harness-doctor/`](../skills/harness-doctor/)：只读诊断入口，
  输出 canonical JSON、Text、Markdown 或安全的 standalone HTML。
- [`../skills/harness-creator/`](../skills/harness-creator/)：plan-bound
  非破坏创建入口，默认用真实 feature 引导补齐项目 Context。
- [`../scripts/package-harness-plugin.mjs`](../scripts/package-harness-plugin.mjs)：
  将两个 skill 与唯一 shared core 确定性打包为 `harness-engineering`
  Codex plugin。
- [`../scripts/install-harness-plugin.mjs`](../scripts/install-harness-plugin.mjs)：
  生成 cache-busted 本地插件、注册仓库 marketplace 并安装到 Codex。
- [`../experiments/field-validation/`](../experiments/field-validation/)：
  bare/harness 受控任务协议、机器结果与 observed-only validator。
- [`workflows/harness-product-boundaries.md`](workflows/harness-product-boundaries.md)：
  shared core、creator、doctor 与项目事实的边界。

## 安装和调用

在仓库根目录运行：

```bash
node scripts/install-harness-plugin.mjs
```

安装成功后，新建 Codex thread，再使用：

```text
$harness-engineering:harness-creator
$harness-engineering:harness-doctor
```

机器上已有的裸名 `$harness-creator` 是独立的 legacy skill，不属于本插件。
本项目不安装或维护裸名兼容层。

## 根目录生命周期入口

- [`../feature_list.json`](../feature_list.json)：当前 feature 范围、依赖、状态和证据。
- [`../progress.md`](../progress.md)：跨 session 的连续性日志。
- [`../session-handoff.md`](../session-handoff.md)：较大或中断任务的交接记录。
- [`../init.sh`](../init.sh)：标准启动和结构验证脚本。
