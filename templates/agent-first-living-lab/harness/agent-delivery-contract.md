# Agent Delivery Contract

## Core Rule

The user should not be the first QA surface.

For meaningful code, UI, lab, or methodology changes, close the loop before
claiming completion:

```text
implement -> test -> inspect output -> verify user-facing path when relevant ->
record evidence -> return to mainline
```

## Evidence By Change Type

| Change Type | Minimum Evidence |
| --- | --- |
| Docs edit | link/path check, status check, placeholder review |
| Domain logic | targeted tests plus relevant suite |
| UI behavior | interaction tests plus browser/user-path check |
| Methodology | updated canonical doc plus evolution note when stage-level |
| User-corrected process gap | classify reusable lesson and update durable surface |
