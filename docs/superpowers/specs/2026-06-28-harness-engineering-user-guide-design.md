# Harness Engineering User Guide Design

## Goal

Provide one complete onboarding guide that lets a first-time user install and
operate the `harness-engineering` Codex plugin without reading internal skills,
implementation code, or project evolution records.

The guide serves two audiences:

1. repository collaborators who can install from the current local
   marketplace;
2. external users who need an honest statement that public distribution is not
   available yet.

## Chosen Approach

Create one progressive guide at `docs/harness-engineering-guide.md`.

The document starts with a five-minute path, then expands into the full
workflow, command reference, interpretation, maintenance, troubleshooting, and
evidence boundaries. This keeps the onboarding surface small while retaining
enough detail for independent recovery.

Rejected alternatives:

- Multiple topical guides add navigation overhead before the product has
  enough public surface to justify them.
- Expanding the root README would mix user onboarding with the repository's
  future-review map.

## User Journey

The canonical workflow is:

1. Check prerequisites and clone or enter this repository.
2. Run `node scripts/install-harness-plugin.mjs`.
3. Start a new Codex thread so the installed skill catalog is reloaded.
4. Invoke `$harness-engineering:harness-creator` against a target repository.
5. Review the non-destructive plan before Creator applies it.
6. Complete the generated `Project Context Restoration` task with real
   project facts when Context is missing.
7. Run the generated `init.sh`.
8. Invoke `$harness-engineering:harness-doctor`.
9. Interpret the five-dimensional Readiness profile and repair only supported
   findings.

The guide must distinguish skill invocation from the internal Node command
surface. Node commands may appear in an advanced reference section, but they
must not replace the canonical plugin workflow.

## Document Structure

The guide contains:

1. Product purpose and appropriate use cases.
2. Distribution status and supported audience.
3. Prerequisites.
4. Five-minute local installation and first run.
5. Full Creator-to-Doctor workflow.
6. Creator options and safety behavior.
7. Doctor formats and interpretation.
8. Instructions, Tools, Environment, State, and Feedback definitions.
9. Existing-project conflicts and `.harness/manifest.json` for non-standard
   paths.
10. Update, reinstall, uninstall, and generated-output rules.
11. Troubleshooting for missing skills, legacy-name confusion, blocked plans,
    stale plan IDs, incomplete Context, Unknown findings, and cache behavior.
12. Readiness versus Effectiveness boundary.
13. Current public-distribution limitation and future replacement point.

## Source Of Truth Rules

Every documented command and option must be checked against:

- `scripts/install-harness-plugin.mjs --help`;
- `skills/harness-creator/scripts/creator.mjs --help`;
- `skills/harness-doctor/scripts/doctor.mjs --help`;
- `.agents/plugins/marketplace.json`;
- the canonical schemas and capability rules in `packages/harness-core`.

The guide must not:

- claim a public marketplace or remote installation path exists;
- instruct users to edit `plugins/harness-engineering/runtime/harness-core`;
- treat the legacy bare `$harness-creator` as part of this plugin;
- claim Readiness level 2 proves task Effectiveness;
- promise overwrite, dependency installation, service startup, or automatic
  completion of project-owned Context.

## Navigation Changes

- Add the guide to the root `README.md` reading map.
- Make it the primary product-user entry in `docs/index.md`.
- Add a documentation URL to generated plugin metadata only if the Codex
  plugin schema supports a repository-relative documentation link.
  Otherwise keep the metadata unchanged and avoid inventing an unsupported
  field.

## Verification

Add a focused documentation contract test that checks:

- the guide exists;
- both canonical namespaced skills appear;
- the local installer command appears;
- the new-thread requirement appears;
- the Creator-to-Doctor sequence is ordered;
- the legacy bare skill warning appears;
- Readiness and Effectiveness are explicitly separated;
- public distribution is not claimed;
- README and `docs/index.md` link to the guide.

Run the documentation test, the full product tests affected by metadata, then
`./init.sh` and `git diff --check`.

## Completion Criteria

The work is complete when a new repository collaborator can follow one
document from installation through first diagnosis, an external reader can
identify the current distribution limitation without ambiguity, navigation
points to the guide, and automated checks prevent canonical commands and
evidence boundaries from silently drifting.
