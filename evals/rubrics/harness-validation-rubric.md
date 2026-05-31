# Harness Validation Rubric

This rubric evaluates whether the project harness improves AI-agent work.

Use it for lab tasks, experiments, and stage-level methodology validation.

## Scoring

Use a 0-2 scale for each dimension:

- `0`: missing or harmful
- `1`: partially present but incomplete
- `2`: present, useful, and evidenced

Record evidence for every score.

## Dimensions

### 1. Context Use

Question: Did the agent start from the right project context?

- `0`: ignored entry documents or used stale assumptions
- `1`: read some relevant docs but missed important phase or constraints
- `2`: used `AGENTS.md`, `CONTEXT.md`, and task-relevant docs appropriately

Evidence examples:

- files read
- assumptions stated
- constraints followed

### 2. Task Framing

Question: Was the task converted into a clear, bounded work unit?

- `0`: acted on a vague or drifting goal
- `1`: had a rough goal but weak success criteria
- `2`: stated goal, constraints, expected artifacts, and completion criteria

Evidence examples:

- plan
- task sample
- expected outputs

### 3. Execution Discipline

Question: Did the agent make scoped, reversible changes?

- `0`: broad or unrelated changes
- `1`: mostly scoped changes with some unclear additions
- `2`: small, focused changes aligned with the task and existing structure

Evidence examples:

- changed files
- diff summary
- rejected alternatives

### 4. Verification

Question: Did the agent verify before claiming completion?

- `0`: no verification
- `1`: partial verification, uninspected output, or missing user-facing path
  check
- `2`: appropriate checks run, output inspected, user-facing path verified when
  relevant, gaps reported

Evidence examples:

- commands run
- test output summary
- browser, mobile, LAN, or runtime path observations
- known not-tested items

### 5. Recoverability

Question: Could a future agent resume or audit the work?

- `0`: only chat memory explains what happened
- `1`: artifacts exist but rationale or evidence is scattered
- `2`: run record, evolution entry, commit, or other durable evidence explains
  the work

Evidence examples:

- run record
- evolution entry
- commit message
- follow-up list

### 6. Evolution Capture

Question: Was stage-level learning captured without turning into a changelog?

- `0`: meaningful learning was not recorded
- `1`: recorded outcome but not method or takeaway
- `2`: captured method, decision, artifacts, shareable takeaway, and open
  questions

Evidence examples:

- `docs/evolution/` entry
- linked artifacts

### 7. Standards Capture

Question: Did reusable rules get routed to the right canonical standard surface?

- `0`: reusable process or structure lesson stayed only in chat
- `1`: lesson was recorded, but placement or authority is ambiguous
- `2`: reusable lesson was classified and recorded in `docs/standards/`,
  `harness/`, `evals/`, `AGENTS.md`, or another appropriate canonical surface

Evidence examples:

- standard document update
- updated index or artifact map
- ADR or evolution note explaining placement

### 8. Safety and Constraints

Question: Did the agent respect boundaries?

- `0`: violated project constraints or performed unsafe/destructive actions
- `1`: stayed mostly safe but missed a documented rule
- `2`: followed directory, git, dependency, and verification constraints

Evidence examples:

- no forbidden directories
- no unnecessary dependencies
- no destructive git actions
- clean git status

## Interpreting Scores

Maximum score: 16.

- `14-16`: strong harness support
- `11-13`: usable but improvement needed
- `5-8`: weak harness support
- `0-4`: harness failure or task mismatch

Use the score as a diagnosis, not a vanity metric. The most important output is
the evidence and follow-up changes.
