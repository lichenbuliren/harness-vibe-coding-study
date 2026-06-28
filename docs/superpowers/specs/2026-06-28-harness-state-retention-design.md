# Harness State Retention And Work Ownership Design

## Goal

让长期迭代项目的根状态面保持小而可恢复，同时保留完整、可验证的历史：

- `feature_list.json` 只承担当前阶段的 feature 调度；
- `progress.md` 只承担当前会话连续性；
- 完成阶段由用户主动归档为 immutable snapshot；
- 新阶段通过 Stage Baseline 继承历史，而不继续扩张当前依赖图；
- feature 明确声明目标 branch；
- 同一 branch 同一时刻只允许一个 Codex thread 持有写 lease。

本设计增加独立的 `harness-archiver` plugin skill。`harness-creator` 继续只负责
创建、补齐和改进 Harness；`harness-doctor` 继续只读诊断。

## Current Problem

当前 `feature_list.json` 已累计 14 个全部完成的 feature，`progress.md` 同时累计
完成清单、证据和下一步。两者都在保存历史，开始与 `docs/evolution/` 的长期证据
职责重叠。

现有 feature validator 还要求每个 dependency ID 位于同一个
`feature_list.json`。直接移动 done feature 会产生 `missing-dependency`，因此
不能只靠手工裁剪。

此外，当前 feature state 没有 branch 归属，plugin 也没有跨 Codex thread 的写入
协调。两个 thread 可以在同一 branch 和 worktree 中同时修改状态与代码。

## Accepted Model

采用四层状态：

| Layer | Artifact | Purpose | Persistence |
|---|---|---|---|
| Current work | `feature_list.json` | 当前阶段调度图 | Tracked, mutable |
| Current continuity | `progress.md` | 当前状态、阻塞、下一步 | Tracked, mutable |
| Baseline head | `.harness/baseline` | 当前阶段继承的最近关闭阶段 | Tracked, mutable |
| Historical snapshot | `docs/evolution/snapshots/<stageId>/` | 完整历史与证据 | Tracked, immutable |
| Writer lease | Git common dir 下的 lease | 当前 branch 的 thread 写所有权 | Local, ephemeral |

历史归档不进入 `feature_list.json` schema。Thread lease 不进入 Git 历史。

## Feature State Contract

### Schema Evolution

`feature_list.json` 从 `1.0.0` 演进为 `1.1.0`，仅增加 feature 的 branch 归属。
Baseline 不属于 feature 调度合同，因此不会借此升级塞入 feature document。

迁移期 shared core：

- 读取并验证 `1.0.0` 与 `1.1.0`；
- 只创建或更新 `1.1.0`；
- 对 `1.0.0` 提供确定性迁移结果；
- snapshot 保留归档时的原始 schema，不重写历史。

新 feature 结构增加：

```json
{
  "id": "feat-015",
  "name": "Harness State Retention",
  "behavior": "Keep current state compact while preserving stage evidence.",
  "branch": "codex/feat-015-harness-state-retention",
  "dependencies": [],
  "status": "next",
  "verification": null,
  "evidence": []
}
```

Branch 规则：

- 新建 feature 时必须记录目标 branch；
- 默认读取当前 Git branch；
- 使用 `git check-ref-format --branch` 等价规则验证；
- detached HEAD 时 block，除非调用方明确提供合法 branch；
- `not-started`、`next`、`in-progress`、`blocked` feature 必须有 branch；
- 从 `1.0.0` 迁移的历史 `done` feature 可以使用 `branch: null`；
- branch reassignment 必须是显式、可审阅的状态变更。

### Dependency Semantics

`dependencies` 只表达当前阶段内的调度关系：

- dependency 必须引用当前 `features` 数组中的 ID；
- 不允许普通 feature dependency 跨 snapshot；
- 阶段整体通过 `.harness/baseline` 继承上一阶段；
- 当前 feature 若依赖历史能力，必须在自己的 verification 中重新证明该能力；
- evolution record 可以引用历史 feature 作为 provenance，但 provenance 不参与调度。

这一区分避免把 execution dependency 和 historical provenance 合并成一张无限增长
的图。

## Archive Eligibility

归档是用户主动操作，不由文件大小自动触发。文件大小和 done feature 数量只能
产生 Doctor recommendation。

一个阶段只有同时满足以下条件才可归档：

1. feature document 可由 shared core 完整验证；
2. `features` 非空；
3. 所有 feature 状态都是 `done`；
4. 每个 feature 都有 verification；
5. 每个 feature 至少有一条 `passed` evidence；
6. 当前 branch 没有 foreign thread lease；
7. worktree 没有未提交变更；
8. snapshot 目标不存在，或已存在完全相同的 snapshot；
9. plan 绑定的 HEAD、source digest 和 previous baseline 未发生变化。

`progress.md` 中的风险文本不会通过自然语言解析成为机器 gate。未解决工作必须体现
为非 `done` feature；长期剩余风险进入 evolution record。

阶段关闭应在阶段内分支全部集成后执行。Archiver 不猜测 `main`、`master` 或其他
集成分支名称；用户在哪个 branch 主动执行，哪个 branch 就是关闭候选。

## Stage Identity

不使用 `stage-001`、时间戳或随机 UUID。

`stageId` 使用内容寻址：

```text
stage-<canonical closure digest 前 16 个十六进制字符>
```

Canonical closure digest 的输入按固定顺序包括：

1. canonicalized `feature_list.json`；
2. `progress.md` 原始 UTF-8 bytes；
3. previous baseline ID，没有时使用空字符串；
4. repository-relative evolution record path。

不额外包含 `closedAt`、关闭操作所在 branch、commit SHA、用户名、主机名或绝对
路径。Feature document 中持久化的 `feature.branch` 是 snapshot 内容的一部分，
因此正常参与 digest。相同输入必须产生相同 stage ID 和相同 plan ID。

Snapshot manifest 保存完整 SHA-256。若短 ID 路径已存在但完整 digest 不同，
Archiver block，不自动改名或覆盖。

## Archive Layout

```text
.harness/
└── baseline

docs/evolution/
└── snapshots/
    └── stage-a3f927c49db281e6/
        ├── stage.json
        ├── feature_list.json
        └── progress.md
```

`.harness/baseline` 是以换行结尾的单行 stage ID，不含 schemaVersion。

`stage.json` 使用独立、稳定的 archive manifest 格式：

```json
{
  "format": "harness-stage/v1",
  "stageId": "stage-a3f927c49db281e6",
  "digest": "<full-sha256>",
  "previousBaseline": null,
  "sourceHead": "<git-commit>",
  "closedAt": "<rfc3339>",
  "evolution": "docs/evolution/0015-harness-state-retention.md",
  "artifacts": {
    "featureState": {
      "path": "feature_list.json",
      "sha256": "<sha256>"
    },
    "progress": {
      "path": "progress.md",
      "sha256": "<sha256>"
    }
  },
  "summary": {
    "featureCount": 14,
    "passedEvidenceCount": 47
  }
}
```

`closedAt` 使用 `sourceHead` 的 Git committer timestamp，而不是 plan/apply 的
本机时钟；这样同一 HEAD 的完整计划保持确定性。`closedAt` 和 `sourceHead` 是
归档证据，但不参与 stage ID。Archive manifest 的 format version 不随阶段递增。

## Root State After Archive

归档后根 `feature_list.json`：

```json
{
  "schemaVersion": "1.1.0",
  "mode": "serial",
  "features": []
}
```

空数组表示当前没有已承诺工作，是合法且可恢复的状态。项目级 `init.sh` 不再要求
feature 数组非空，只要求结构有效。

根 `progress.md` 压缩为：

```markdown
# Session Progress

## Baseline

- `stage-a3f927c49db281e6`

## Current State

- No active feature.

## What's Next

- Define the next real project feature.

## Blockers And Risks

- None.
```

完整旧内容只存在于 snapshot。根文件不复制 `What's Done` 历史。

`session-handoff.md` 不属于强制 snapshot。若阶段已完成且无复杂交接，它压缩为
baseline 和 restart path；若仍有未完成交接，阶段不应满足归档条件。

## Harness Archiver

新增：

```text
$harness-engineering:harness-archiver
```

它使用独立的 plan/apply 协议：

```text
archiver plan --target <repository> --evolution <repository-relative-path>
  [--format text|json] [--pretty]

archiver apply --target <repository> --evolution <repository-relative-path>
  --plan-id <sha256> [--format text|json] [--pretty]
```

`plan` 只读，输出：

- eligibility findings；
- current branch、HEAD 和 lease owner；
- previous baseline；
- stage ID 和 full digest；
- snapshot 路径；
- root file replacements；
- blocked actions；
- deterministic `planId`。

`apply`：

1. 重新生成计划并比较 `planId`；
2. current branch 没有 lease 时为调用 thread 原子 claim；已有 same-thread lease
   时复用；已有 foreign lease 时 block；
3. 对所有 source 和 destination 做 preflight；
4. 以 exclusive creation 写入 snapshot；
5. 替换根 feature/progress 与 baseline；
6. 运行 shared structural validation；
7. 失败时恢复根文件；已完成且内容正确的 immutable snapshot 可以安全保留；
8. 输出每项 `created`、`compacted`、`linked` 或 `blocked` 结果。

Archiver 不执行 target project commands、不安装依赖、不删除 snapshot、不自动 commit。
Archiver 自己取得的临时 lease 在成功回滚或失败退出后释放；调用前已经存在的
same-thread lease 保持不变。正常工作流在 apply 后运行项目
`initialize`/`verify` commands 和 Doctor。

## Branch Ownership And Thread Lease

### Invariant

```text
one branch = one active writer thread
```

`feature.branch` 是持久归属声明；lease 是当前运行所有权。两者不能互相替代。

### Storage

Lease 位于：

```text
<git-common-dir>/harness-engineering/leases/<sha256-normalized-ref>.json
```

它不是 Git 内建功能，而是 plugin 的 cooperative lock。使用 Git common directory
使同一 repository 的多个 worktree 能看到同一 branch lease，同时避免污染
`git status`、commit 和 remote history。

Lease 至少包含：

```json
{
  "format": "harness-branch-lease/v1",
  "branch": "refs/heads/codex/feat-015-harness-state-retention",
  "featureId": "feat-015",
  "threadId": "<CODEX_THREAD_ID>",
  "worktree": "<absolute-local-path>",
  "head": "<git-commit>",
  "leaseId": "<unguessable-token>",
  "acquiredAt": "<rfc3339>"
}
```

当前 Codex App 暴露 `CODEX_THREAD_ID`。没有稳定 thread identity 时，写操作
block，而不是退化为无所有者写入。

### Operations

- `claim`：使用 exclusive create 原子获取 branch lease；
- `check`：确认 current thread 是否为 owner；
- `release`：只有匹配 `threadId` 与 `leaseId` 的 owner 可以释放；
- `takeover`：显式显示旧 owner 后生成 plan，由用户批准后替换 abandoned lease；
- 同一 thread 重复 claim：幂等成功；
- 不同 thread claim 同一 branch：写入前 block；
- 不使用自动 TTL；等待用户的有效 thread 不能因时间经过被静默接管。

Feature 进入 `in-progress` 前必须 claim。完成 feature 或显式 handoff 时 release。
Creator、Archiver 及后续所有 plugin mutation command 都必须调用同一 lease guard。

Foreign lease 的文本结果必须包含：

```text
BLOCKED: branch-owned-by-another-thread
Branch
Feature
Owner thread
Worktree
Acquired time
No files were modified
Recovery choices
```

Recovery choices 只包括：返回 owner thread、创建独立 branch/worktree、显式 handoff，
或显式 takeover。不得默认 force。

### Enforcement Boundary

这是 cooperative enforcement：

- shared commands 和 plugin 写操作强制检查；
- generated Agent Operating Contract 要求工作前 claim；
- initialization 可以报告 foreign lease；
- 普通并行工作采用一 thread 一 branch/worktree。

它不能阻止绕过 Harness 的任意 editor 或 shell 直接写文件。操作系统级硬锁或平台
专用 tool hook 不进入跨平台 shared core v1。

## Multi-Branch Behavior

内容寻址避免不同分支争抢相同数字 stage directory：

- 相同 closure content 得到相同 stage ID；
- 不同 closure content 得到不同 stage ID；
- snapshot 路径可以安全并存。

`.harness/baseline` 仍可能在两个独立关闭阶段的分支间产生 merge conflict。这是
必须暴露的语义冲突，不应自动选择一边。

正确恢复方式：

1. 合并阶段内 feature branches；
2. 不手工任选某个 baseline head；
3. 在合并后的集成状态重新运行 Archiver；
4. 生成代表最终集成内容的唯一 stage snapshot。

## Doctor Integration

Doctor 保持只读，并新增：

- 当前阶段是否 archive-eligible；
- done-only 状态是否正在造成根状态膨胀；
- baseline 指针是否存在且格式正确；
- stage manifest、artifact digest 和 previous baseline chain 是否完整；
- current feature dependency 是否错误跨 snapshot；
- active feature 是否缺少 branch；
- current branch 是否存在 foreign lease。

Doctor 只推荐 `$harness-engineering:harness-archiver`，不触发归档、claim、release
或 takeover。

## Creator Boundary

Creator 继续负责创建和改进 Harness 结构，不承担阶段归档：

- 新生成 feature 使用 `1.1.0` 和合法 branch；
- 现有 `1.0.0` 状态通过可审阅计划迁移；
- Creator 写入前检查 branch lease；
- Creator 不创建虚构 snapshot 或历史 stage；
- Creator 不替 Archiver 压缩 project-owned state。

Plugin 产品由“三入口、单核心”组成：

```text
harness-creator   create or improve Harness structure
harness-doctor    inspect and explain
harness-archiver  close and archive completed project stages
shared core       schemas, validation, discovery, digest, lease protocol
```

## Failure Handling

以下情况必须在任何 project file 写入前 block：

- malformed or unsupported current feature state；
- unfinished or unevidenced feature；
- detached HEAD；
- missing `CODEX_THREAD_ID`；
- foreign branch lease；
- dirty worktree；
- missing or unsafe evolution path；
- unsafe symlink or repository escape；
- stale plan、HEAD、baseline 或 source digest；
- existing snapshot with mismatched full digest；
- invalid baseline chain。

错误输出区分 `ineligible`、`blocked`、`stale`、`unsafe` 和 `corrupt`，并给出一个
最小恢复动作。

## Verification

Shared core contract tests覆盖：

- `1.0.0` read compatibility 和确定性 `1.1.0` migration；
- branch validation、detached HEAD 和 active feature branch requirement；
- local-only dependency graph；
- archive eligibility；
- canonical digest 和 deterministic stage ID；
- baseline 和 snapshot chain validation；
- malformed、missing、tampered 和 digest-collision fixtures；
- empty current feature list 合法。

Lease tests覆盖：

- exclusive claim；
- same-thread idempotency；
- foreign-thread block before write；
- common-dir behavior across worktrees；
- owner-only release；
- explicit takeover；
- missing thread identity block；
- concurrent claim 只有一个 winner。

Archiver tests覆盖：

- plan zero writes；
- deterministic plan ID；
- stale plan rejection；
- snapshot exclusive creation；
- root state compaction；
- rollback after injected failure；
- repeat apply idempotency；
- no overwrite、delete、network、install、target-command execution 或 host-path
  leakage。

Product tests覆盖：

- packaged third skill 和唯一 shared core；
- official plugin/skill validation；
- Creator、Doctor、Archiver contract consistency；
- foreign thread user-facing blocked output；
- end-to-end completed stage archive、new-stage restart 和 Doctor verification。

Repository migration verification：

- 当前 14 个 done feature 完整进入 snapshot；
- 根 feature state 变为空 current workset；
- 根 progress 只保留 baseline、current state、next 和 blockers；
- current snapshot digest 与 archived source 完全一致；
- `./init.sh`、targeted tests、full suite 和 `git diff --check` 通过。

## Out Of Scope

- 自动按文件大小归档；
- 自动选择 integration branch；
- 自动解决 baseline merge conflict；
- 跨 snapshot feature scheduling；
- 自动 TTL 或静默 lease takeover；
- 阻止绕过 Harness 的任意 editor 写入；
- 自动 commit、push 或执行 target project commands；
- 删除、压缩或重写历史 snapshot。
