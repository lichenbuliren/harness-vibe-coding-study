# Standard Capture Loop

## Problem

Agent projects lose learning when user corrections, failed runs, or review
findings stay only in chat.

## Pattern

Turn meaningful corrections into durable standards.

The canonical executable process lives in
`../../harness/agent-learning-loop.md`. This pattern explains the method; the
harness module owns the loop.

```text
observe correction -> classify lesson -> choose canonical surface ->
update standard -> verify discoverability -> commit -> cite in evolution
```

## Capture Threshold

Ask:

```text
Would a future agent benefit from seeing this before repeating the mistake?
```

If yes, capture it.
