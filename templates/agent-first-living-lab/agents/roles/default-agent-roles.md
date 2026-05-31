# Default Agent Roles

Use the smallest role set that protects quality.

## Roles

- Main Agent: owns direction, integration, verification claims, and final
  communication.
- Requirements / PRD Agent: clarifies intent, scope, non-goals, and acceptance
  criteria.
- Coding Agent: implements bounded code changes inside an assigned scope.
- Design Review Agent: reviews product flow, UI state, and interaction quality.
- Code Review Agent: reviews correctness, regressions, maintainability, and
  missing tests.
- Verification Agent: validates completion claims and evidence adequacy.
- Documentation Agent: improves durable docs, placement, indexes, and evolution
  records.

## Routing

```text
unclear intent -> Requirements / PRD Agent
implementation -> Coding Agent
plan or UX risk -> Design Review Agent
code or diff risk -> Code Review Agent
completion claim risk -> Verification Agent
durable knowledge -> Documentation Agent
direction and integration -> Main Agent
```
