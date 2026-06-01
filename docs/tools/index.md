# Tools

This directory stores notes about tools that support harness + vibe coding work.

## Current Notes

- `grill-me.md`: notes for the Matt Pocock skills collection.
- `superpowers.md`: notes for the Superpowers plugin and brainstorming workflow.

Tool notes should explain why a tool matters to this project, how to install or
enable it, and when an agent should use it.

Use `../../harness/capability-discovery.md` before searching for or recommending
new skills, plugins, tools, playbooks, scripts, or runtime capabilities.

When a standard-capture task depends on an optional skill, the agent should
first check whether that skill is available. If it is missing, the agent should
tell the user how to install it and continue with the closest lightweight
fallback.
