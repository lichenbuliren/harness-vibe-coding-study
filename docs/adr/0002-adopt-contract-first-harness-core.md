# ADR 0002: Adopt A Contract-First Harness Core

Status: Accepted

## Context

现有 `harness-creator` 将静态模板、项目 placeholder、结构评分和产品工作流放在
同一个 skill 中。Creator 与未来 doctor 如果分别演进，容易形成不同的模型、
schema 和诊断结论。

本项目已经采用五子系统模型，并要求 Readiness 与 Effectiveness 分离。

## Decision

采用 contract-first shared core。

Shared core 统一拥有 schema、能力检测规则、成熟度、证据模型、规范 JSON 和
fixtures。Creator 与 doctor 作为两个薄入口共享这些契约。

项目事实动态生成或由目标仓库维护，不作为填好的模板内容分发。

## Rejected Alternatives

### Template-first fork

直接复制现有 skill 虽然启动快，但会继承固定文件名、placeholder、总分模型和
有副作用的初始化逻辑。

### Doctor-first independent implementation

先独立实现 doctor 范围较小，但 creator 后续容易产生第二套契约和判断逻辑。

## Consequences

- shared schema 和 fixture tests 必须先于产品入口；
- creator 和 doctor 的判断可以保持一致；
- 第一阶段投入更多契约设计，但减少后续迁移和漂移；
- shared core 只能声称 Readiness，直到真实任务提供 Effectiveness 证据；
- 产品实现按 shared core、doctor、creator、integration、field validation
  顺序推进。

