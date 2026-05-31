# Harness 工程实践总结

这份文档面向后续分享使用，目标是讲清楚两个问题：

- 什么是 harness 工程？
- 在真实项目里，应该如何系统性地实践 harness 工程？

本文基于本项目对
[`walkinglabs/awesome-harness-engineering`](https://github.com/walkinglabs/awesome-harness-engineering)
中多个模块的阶段性学习，包括 Foundations、Context/Memory、Guardrails、
Specs/Workflows、Evals/Observability、Benchmarks 与 Runtimes。

## 一句话定义

Harness 工程，是围绕 AI 模型构建一层工程系统，让 agent 的工作变得可控、可观察、可恢复、可评估。

可以用一个简化公式理解：

```text
agent = model + harness
```

模型提供能力，harness 决定能力如何被使用。

更具体地说，harness 决定：

- agent 读到什么上下文
- agent 能使用哪些工具
- agent 如何拆解任务
- agent 如何保存状态
- agent 如何验证结果
- agent 出错后如何恢复
- agent 的工作如何被人类和系统评估

所以，很多时候一个 agent 表现不好，并不只是模型不够强，而是 harness 没有设计好。

## 为什么需要 Harness 工程

在传统软件开发里，我们不会只依赖程序员“记得做对”。我们会用：

- README
- 架构约束
- 类型系统
- 测试
- lint
- CI
- code review
- 日志
- 监控
- rollback

这些东西共同构成软件工程的控制系统。

AI agent 也一样。不能只给模型一个大 prompt，然后期待它稳定完成复杂任务。agent 需要一套工作环境，一套规则，一套反馈机制，一套恢复机制。

这套围绕 agent 的工程系统，就是 harness。

## Harness 不是 Prompt Engineering

Prompt engineering 主要关心“这一轮要怎么说”。

Harness engineering 关心的是“整个工作系统如何运转”。

Prompt 是 harness 的一部分，但 harness 还包括：

- repo-local instructions，例如 `AGENTS.md`
- 项目上下文，例如 `CONTEXT.md`
- specs、plans、ADRs
- 文件系统和 git
- shell、browser、MCP、CLI、skills
- 测试、lint、typecheck、静态分析
- 子 agent 分工
- handoff 文档
- run records
- eval rubrics
- trace 和日志
- sandbox、权限和安全边界

换句话说，prompt 是入口，harness 是系统。

## 一个实用模型：Control + Agency + Runtime + Substrate

本项目暂时采用四层模型理解 harness 工程：

```text
Control + Agency + Runtime + Substrate
```

### Control：控制层

控制层定义“什么是正确的”和“如何判断正确”。

它包括：

- 项目规则
- 架构约束
- 任务 spec
- 实施 plan
- 测试
- lint / typecheck
- code review
- eval rubric
- 人类审批点

控制层又可以分成两类：

- **Guide**：事前引导，例如文档、规范、示例、任务说明。
- **Sensor**：事后或过程中反馈，例如测试、日志、review、trace。

只有 guide 没有 sensor，规则会腐烂。只有 sensor 没有 guide，agent 会反复犯本可避免的错误。

### Agency：自治层

自治层定义 agent 有多少自由度。

不是所有任务都需要高自治 agent。

可以粗略分成三档：

- **Direct call**：简单问题，直接调用模型即可。
- **Workflow**：路径明确的多步骤任务，用固定流程更可靠。
- **Agent**：开放任务，需要模型动态决定下一步。

实践原则是：从最简单可工作的系统开始，只有当任务确实需要灵活决策时，才增加 agent 自治。

### Runtime：运行时层

运行时层定义工作如何跨时间推进。

它包括：

- step 生命周期
- 状态保存
- retry
- timeout
- cancellation
- restart
- trace
- run record
- handoff
- 并发和冲突处理

长任务不能只依赖聊天记录。聊天窗口不是可靠的运行时，文件系统和 git 才是更可靠的记忆和恢复路径。

### Substrate：底座层

底座层是 agent 实际工作的环境。

它包括：

- 仓库结构
- 文件系统
- git
- shell
- browser
- 测试工具
- MCP server
- CLI
- skills
- 文档拓扑
- 代码组织方式

一个混乱的代码库，本身就会成为 harness 的瓶颈。小文件、清晰边界、明确目录、可运行测试，会直接提升 agent 的工作质量。

## Context 是有限预算，不是越多越好

Context engineering 是 harness 工程里非常核心的一部分。

一个常见误区是：上下文窗口越大越好，塞进去的信息越多越好。

更准确的理解是：

```text
prompt = active working set
filesystem = durable memory
git = versioned memory and recovery path
```

prompt 是当前工作集，不是长期记忆。

真正应该长期保存的是：

- specs
- plans
- decisions
- evolution logs
- run records
- handoff
- tests
- source files
- git history

因此，优秀的 harness 不会把所有东西都塞进 prompt，而是让 agent 先读一个小地图，再按需加载细节。

## 实践原则一：Root Instructions 要短

`AGENTS.md` 或 `CLAUDE.md` 不应该变成百科全书。

它应该回答：

- 这个项目是什么？
- agent 应该先读哪里？
- 哪些目录负责什么？
- 哪些行为禁止？
- 完成任务前如何验证？

详细内容应该分散到更具体的文件：

- harness 方法论放 `harness/`
- agent 角色和 handoff 放 `agents/`
- 实验记录放 `experiments/`
- 评估标准放 `evals/`
- 阶段复盘放 `docs/evolution/`
- 决策记录放 `decisions/`

Root instruction 的作用是导航，不是承载全部知识。

## 实践原则二：用 Progressive Disclosure 管理上下文

Progressive disclosure 的意思是：先给 agent 最小必要上下文，再按需展开。

不要一开始就加载：

- 所有文档
- 所有工具
- 所有历史记录
- 所有文章
- 所有规则

更好的方式是：

1. 先读 `AGENTS.md` 和 `CONTEXT.md`。
2. 根据任务进入相关目录。
3. 只读取当前任务需要的文件。
4. 大资料用链接、路径、摘要引用。
5. 必要时派子 agent 分组阅读，再返回压缩后的结论。

这可以降低噪声，也能减少 agent 被旧信息带偏。

## 实践原则三：把工作状态外部化

长任务中，agent 必须能恢复。

一个可恢复的工作状态至少应包含：

```text
Current Goal
Current Plan
Verified Facts
Decisions Made
Open Questions
Blockers / Risks
Critical Files
Verification State
Resume Instructions
```

这些状态不应该只存在于聊天记录里。

根据任务类型，它可以落在：

- `agents/handoffs/`
- `harness/runs/`
- `experiments/reports/`
- `docs/evolution/`
- commit message
- plan/spec 文档

判断标准很简单：如果换一个 fresh agent 接手，它能不能不用重读完整聊天记录就继续工作？

## 实践原则四：让输出有 Backpressure

agent 经常被工具输出淹没。

比如：

- 长测试日志
- 大量 passing output
- 无关 warning
- 重复 stack trace
- 整页网页内容

好的 harness 应该控制输出形态。

建议：

- 成功时输出一句简洁 OK。
- 失败时保留关键错误。
- 调试时 fail fast。
- 大日志写入文件，用路径引用。
- 不要把完整 passing logs 塞进上下文。
- 不要依赖模型自己从噪声里找重点。

这就是 context-efficient backpressure：让上下文只承载有决策价值的信息。

## 实践原则五：做事和评估要分离

对于重要任务，不应该只让同一个 agent 做完后自我判断。

更可靠的模式是：

- planner 负责计划
- implementer 负责执行
- verifier 负责验证
- reviewer 负责质量判断
- human 负责高风险决策

这不意味着每个小任务都要重流程。它意味着高风险、长周期、阶段性成果需要独立评估。

在我们的第一阶段和第二阶段学习里，子 agent 就主要用来做 source group research，而主 agent 负责整合判断。这是一种上下文隔离，而不是角色扮演。

## 实践原则六：先机械检查，再语义判断

能机械化的，不要只靠人或模型判断。

例如：

- 文件是否存在
- Markdown 是否有占位符
- forbidden directory 是否出现
- git status 是否干净
- 链接是否可导航
- 测试是否通过
- 类型检查是否通过

这些适合 deterministic checks。

而这些更适合 human / reviewer / evaluator：

- 架构是否合理
- 文档是否清晰
- 取舍是否符合目标
- 分享叙事是否成立
- 是否有隐藏风险

好的 harness 会把两者结合起来。

## 实践原则七：评估要同时看结果和轨迹

Agent eval 不能只问“最后答案对不对”。

真实项目里的 agent 常常会出现这些情况：

- 最终文件是对的，但过程里试错过多，成本很高。
- 最终测试通过，但用了错误工具或绕过了约束。
- 这一次成功了，但换一个模型、环境或上下文就失败。
- 分数提升了，但其实是 sandbox 资源更宽松，而不是 agent 更强。

因此 harness 的评估记录至少应该包含：

```text
Task -> Run -> Trace -> Grade -> Diagnose -> Change -> Regression Gate
```

其中：

- `Task` 是一个边界清晰的任务。
- `Run` 是一次受控环境里的尝试。
- `Trace` 记录 prompt、tool call、command、handoff、错误和 artifact。
- `Grade` 用 deterministic verifier 优先判断结果。
- `Diagnose` 从 trace 中找失败原因和成本来源。
- `Change` 是一次具体 harness 调整。
- `Regression Gate` 防止同类问题回归。

这意味着 eval 和 observability 不是两个孤立模块。eval 负责证明变化有没有变好，observability 负责解释为什么变好或变坏。

## 实践原则八：记录的不只是结果，还有方法论

这个项目有一个特殊目标：未来要做分享。

所以每个阶段性成果不只要记录“做了什么”，还要记录：

- 当时处于什么阶段
- 目标是什么
- 用了什么方法论
- 问了哪些关键问题
- 最终得到什么成果
- 产出了哪些文档或代码
- 可以对外分享的 takeaway 是什么
- 还有哪些开放问题

这就是 `docs/evolution/` 的作用。

它不是 changelog，而是项目演进叙事。

## 实践原则九：Benchmark 测的是系统，不只是模型

Agent benchmark 常常不是纯模型能力测试。

尤其是 coding agent、browser agent、desktop agent、MCP agent 这类任务，分数会同时受到这些因素影响：

- 模型能力
- prompt 和 instruction
- 工具设计
- context 管理
- sandbox 资源
- timeout 和 retry
- verifier 质量
- trace 和恢复机制
- 成本控制

所以更准确的说法是：

```text
benchmark score = model + harness + environment
```

这对实践很重要。我们不应该只问“哪个模型分数高”，还要问：

- 这个 benchmark 测的是哪类任务面？
- 它和我们的真实任务分布是否相似？
- 评分器是否可靠？
- 环境是否可复现？
- 资源限制是否记录清楚？
- trace 能不能解释成功和失败？
- 分数提升来自模型，还是来自 harness 改造？

Benchmark 的价值不是替代本地 eval，而是帮助我们选择外部参照系。

## 在真实项目中的落地路径

一个项目要实践 harness 工程，可以按下面顺序推进。

### 第一步：建立项目入口

需要最少三个入口：

- `README.md`：给人看。
- `AGENTS.md`：给 agent 看。
- `CONTEXT.md`：保存长期上下文。

这三个文件回答：

- 项目是什么？
- 当前阶段是什么？
- agent 应该如何工作？
- 哪些目录负责什么？
- 完成任务前如何验证？

### 第二步：拆分知识目录

不要把所有文档堆在一个 `docs/`。

建议拆分：

- `docs/`：方法论和可分享知识。
- `harness/`：harness 工程方法。
- `agents/`：角色、playbook、handoff。
- `experiments/`：实验过程和报告。
- `evals/`：评估标准和 checklist。
- `decisions/`：ADR。
- `docs/evolution/`：阶段演进记录。

目录结构本身就是给 agent 的认知路径。

### 第三步：定义 Harness 基础模型

先不要急着写工具。

先定义：

- harness 包含什么
- control 怎么做
- agency 怎么分级
- runtime 怎么恢复
- substrate 依赖什么
- context 怎么管理
- memory 怎么持久化
- eval 怎么判断

没有这些定义，后面写出来的工具很容易只是脚本集合，而不是工程系统。

### 第四步：建立工作状态和恢复机制

长任务必须有可恢复状态。

至少要能回答：

- 当前目标是什么？
- 已完成什么？
- 下一步是什么？
- 哪些事实已验证？
- 哪些风险还没解决？
- 哪些文件必须读？
- 哪些命令跑过？
- 如果上下文丢失，如何恢复？

这一步通常比写更多 prompt 更有价值。

### 第五步：引入验证和反馈

把验证分成两类：

- deterministic checks：测试、lint、typecheck、结构检查、链接检查。
- judgment checks：code review、spec review、架构审查、人工审批。

agent 可以自己运行 deterministic checks，但重要成果最好有独立 reviewer 或人类确认。

### 第六步：建立 Eval 和 Trace 闭环

当项目开始反复使用 agent，就应该建立最小评估闭环：

- 选择真实、边界清晰的小任务。
- 定义一个可检查 artifact。
- 写 deterministic verifier。
- 保留 no-skill / old-harness / old-prompt baseline。
- 捕获 trace、成本、耗时、失败原因。
- 只把重复出现的问题升级为 regression case。

早期不需要庞大 benchmark。少量高质量、可复跑的任务，比一堆模糊打分更有价值。

同时要把环境当成 eval 的一部分记录下来：

- model 和 harness 版本
- prompt / tool / skill 版本
- sandbox 资源限制
- timeout 和 retry 策略
- dependency/cache 状态
- 运行日期、runner、并发条件

否则同一个分数很可能在比较不同的系统，而不是比较不同的 agent 能力。

### 第七步：做实验，而不是凭感觉

当你觉得某个 harness 设计更好时，要能实验验证。

例如：

- 有无 `AGENTS.md`，agent 恢复速度是否不同？
- 有无 handoff 模板，跨会话任务是否更稳定？
- 有无 backpressure，agent 调试是否更少迷路？
- 有无 eval rubric，review 结果是否更一致？

这些实验应记录在 `experiments/`，判断标准应沉淀到 `evals/`。

### 第八步：用真实项目反向验证

纯文档容易正确但无用。

所以需要 `lab/`：

- 用一个真实项目承载 agent 开发任务。
- 在真实任务中验证 harness 是否有帮助。
- 把经验反馈到 `harness/`、`agents/`、`evals/`、`docs/evolution/`。

这也是本项目选择 Agent-First Living Lab 的原因。

### 第九步：谨慎引入 Runtime

框架、运行时和 harness 不是一回事。

可以粗略区分为：

- **Framework**：提供开发抽象，例如 agent loop、tool schema、middleware。
- **Runtime**：提供 durable execution，例如状态持久化、重试、恢复、调度、human-in-the-loop。
- **Harness**：围绕 agent 的操作系统，例如 prompt、tools、skills、filesystem、memory、verification、observability、eval。

很多项目会误以为“用了 agent framework，就有了完整 harness”。实际并不是。

本项目的原则是：

1. 先把 harness 概念、文档、运行记录、eval 规则做清楚。
2. 再做小脚本和 adapter。
3. 只有当任务需要长时间运行、异步事件、crash recovery、调度或复杂 human approval 时，才引入 durable runtime。

### 第十步：把纠错转成项目标准

这是本项目在真实协作中沉淀出的一个重点方法论。

AI agent 的失败不只来自代码错误，也来自过程错误：没有主动测试、没有验证真实用户路径、没有提交、没有更新演进记录、把规范放错目录，等等。

如果这些问题只停留在聊天里，下一次 agent 还会重复犯错。

因此，一个成熟的 harness 项目应该有标准捕获循环：

```text
observe correction -> classify lesson -> choose canonical surface ->
update standard -> verify discoverability -> commit -> cite in evolution
```

中文可以理解为：

```text
发现纠错 -> 判断是否可复用 -> 选择规范归属面 ->
更新标准 -> 验证可发现性 -> 提交 -> 写入演进
```

这里的“规范”不一定只属于 `harness/`。它可能是：

- harness 交付规范
- 目录结构规范
- 文档归档规范
- eval / checklist 规范
- lab 项目实现规范
- agent 运行时规范
- 阶段性演进方法论

本项目因此新增了 `docs/standards/`，用于承接跨越多个目录的项目标准；同时保留 `harness/`、`evals/`、`docs/patterns/`、`docs/evolution/`、`decisions/` 各自的职责边界。

这个方法论的核心不是“多写文档”，而是：

```text
fix the issue + teach the project how not to repeat it
```

也就是：解决当前问题，同时让项目系统学会避免下一次重复发生。

## 一个最小可行 Harness Checklist

如果要判断一个项目是否具备最小 harness，可以问：

- agent 是否知道先读哪里？
- 项目当前阶段是否明确？
- 任务是否有 spec 或 plan？
- 重要规则是否写在版本库里？
- 长任务是否有 handoff 或 progress 记录？
- 上下文是否按需加载，而不是一股脑塞入？
- 工具输出是否被控制？
- 失败证据是否被保留？
- 是否有 deterministic checks？
- 重要成果是否有独立 review？
- 阶段性学习是否进入 evolution log？
- 决策是否进入 ADR？
- 用户纠错、review 发现、失败运行是否被判断为可复用标准？
- 新标准是否放到了未来 agent 能发现的规范面？

如果这些问题大部分答案是否定的，那么问题通常不是模型，而是 harness。

## 常见反模式

### 反模式一：把所有希望写进一个超长 Prompt

超长 prompt 会腐烂，也很难验证。更好的方式是短入口 + 分层文档 + 按需加载。

### 反模式二：只看最终结果，不看过程

agent 的过程很重要。trace、run record、失败证据、工具调用、验证命令都应该成为评估的一部分。

### 反模式三：让 agent 自己证明自己做得好

复杂任务需要独立评估。self-check 有价值，但不能替代 reviewer、eval 或人类审批。

### 反模式四：把工具越接越多

工具越多，上下文和安全边界越复杂。应该优先使用小而明确的工具，并通过 progressive disclosure 暴露能力。

### 反模式五：只靠新开会话解决上下文污染

新会话确实能清理上下文，但如果没有 compaction 和 durable memory，它也会丢失任务连续性。

## 本项目当前状态

本项目已经完成了 harness 工程探索的两个基础模块：

- Foundations：
  - 沉淀为 `harness/foundations.md`
  - 建立 `Control + Agency + Runtime + Substrate` 模型
- Context, Memory & Working State：
  - 沉淀为 `harness/context-memory.md`
  - 建立 `prompt / filesystem / git` 的记忆模型
- Constraints, Guardrails & Safe Autonomy：
  - 沉淀为 `harness/guardrails-safe-autonomy.md`
  - 建立“更高自治必须有更强边界”的安全原则
- Specs, Agent Files & Workflow Design：
  - 沉淀为 `harness/specs-agent-workflows.md`
  - 建立 `Context -> Work -> Validation -> Learning` 工作流模型
- Evals & Observability：
  - 沉淀为 `harness/evals-observability.md`
  - 建立 `Task -> Run -> Trace -> Grade -> Diagnose -> Change -> Regression Gate` 评估闭环
- Benchmarks：
  - 沉淀为 `harness/benchmarks.md`
  - 建立按任务面选择 benchmark 的分类方法
- Runtimes, Harnesses & Reference Implementations：
  - 沉淀为 `harness/runtimes-reference-implementations.md`
  - 建立 framework / runtime / harness 的分层判断

我们已经形成一个初步判断：

```text
Harness 工程的核心不是让 agent 更自由，
而是让 agent 的自由发生在可恢复、可验证、可治理的系统里。
```

## 后续应该继续探索什么

接下来可以继续推进：

- 把文档方法论转成最小可执行 eval。
- 为 `harness/runs/` 设计 run record schema。
- 在 `lab/` 中启动一个真实验证项目。
- 用真实任务反向验证当前 harness 方法论。

这些工作会进一步回答：

- 哪些规则真的帮助 agent 稳定工作？
- 哪些文档只是看起来正确？
- 哪些 eval 能成为长期 regression gate？
- 什么时候需要从文档 harness 升级到 executable harness？

## 分享时可以带走的主线

如果要对外分享，可以用这条主线：

1. AI agent 的能力不只取决于模型，还取决于模型外面的工程系统。
2. 这个系统就是 harness。
3. harness 包括控制、自治、运行时和工程底座。
4. context 是有限预算，文件系统和 git 才是可靠记忆。
5. 好的 harness 会让 agent 可控、可恢复、可验证、可评估。
6. 在真实项目中，harness 应该从目录、文档、状态、验证、实验和演进记录开始，而不是从写工具开始。
7. 高质量协作会把用户纠错转成项目标准：修复当前问题，同时教会项目避免未来重复犯错。
