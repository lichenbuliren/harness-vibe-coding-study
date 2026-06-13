# Harness Vibe Coding Study

This context defines the project language for a living lab that studies
agent-first work, harness engineering, and restartable project memory.

## Language

**Agent Operating Contract**:
A short, root-level agreement that tells an agent how to start, stay in scope,
verify work, and leave the project restartable.
_Avoid_: full manual, generated reference dump, implementation guide

**Workflow Reference**:
A deeper document for runtime details, routing tables, mode-specific behavior,
or operational background that is useful on demand but too large for the root
agent contract.
_Avoid_: root contract, startup checklist

**Generated Reference Material**:
Tool-produced guidance that may be useful as background but should not own the
root operating contract unless the project explicitly chooses that generator as
the source of truth.
_Avoid_: project contract, canonical policy
