#!/usr/bin/env node

import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {
  fixtureDefinitions
} from './fixtures.mjs';

const SHA256 = /^[a-f0-9]{64}$/;

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function validateResults(record) {
  const errors = [];
  if (!object(record)) {
    return ['result must be an object'];
  }
  if (record.schemaVersion !== '1.0.0') {
    errors.push('schemaVersion must be 1.0.0');
  }
  if (record.id !== 'pilot-001') {
    errors.push('id must be pilot-001');
  }
  if (record.evidenceLevel !== 'observed') {
    errors.push('evidenceLevel must remain observed');
  }
  if (record.execution?.independent !== false) {
    errors.push('execution.independent must be false for this same-agent pilot');
  }
  if (!Array.isArray(record.runs) || record.runs.length !== 4) {
    errors.push('results must contain exactly four runs');
  } else {
    for (const definition of fixtureDefinitions) {
      const run = record.runs.find((item) => item?.id === definition.id);
      if (!object(run)) {
        errors.push(`missing run: ${definition.id}`);
        continue;
      }
      for (const field of ['order', 'family', 'condition', 'taskName']) {
        if (run[field] !== definition[field]) {
          errors.push(`${definition.id}.${field} does not match the fixture`);
        }
      }
      if (
        run.start?.gitClean !== true ||
        run.start?.verification !== 'failed-as-expected'
      ) {
        errors.push(`${definition.id}.start must be clean and failing as expected`);
      }
      if (!Array.isArray(run.actions) || run.actions.length === 0) {
        errors.push(`${definition.id}.actions must be non-empty`);
      } else {
        const firstEdit = run.actions.findIndex((action) =>
          action?.kind === 'edit');
        const readPaths = run.actions
          .filter((action) => action?.kind === 'read')
          .map((action) => action.path);
        const passedVerifier = run.actions.some((action) =>
          action?.kind === 'verify' &&
          action.command === 'npm test' &&
          action.result === 'passed'
        );
        if (firstEdit < 0) {
          errors.push(`${definition.id} must record an edit action`);
        }
        if (!passedVerifier) {
          errors.push(`${definition.id} must record a passing npm test`);
        }
        for (const entrypoint of definition.entrypoints) {
          if (!readPaths.includes(entrypoint)) {
            errors.push(
              `${definition.id} did not read entrypoint: ${entrypoint}`
            );
          }
        }
        const changedPaths = [...new Set(run.actions
          .filter((action) => action?.kind === 'edit')
          .flatMap((action) => action.paths ?? []))];
        const expectedMetrics = {
          orientationReads: run.actions
            .slice(0, firstEdit < 0 ? run.actions.length : firstEdit)
            .filter((action) => action?.kind === 'read').length,
          verificationCommands: run.actions.filter((action) =>
            action?.kind === 'verify').length,
          correctionLoops: run.actions
            .slice(firstEdit < 0 ? run.actions.length : firstEdit + 1)
            .filter((action) =>
              action?.kind === 'verify' && action.result === 'failed').length,
          stateUpdates: changedPaths.filter((changedPath) =>
            changedPath === 'feature_list.json' ||
            changedPath === 'progress.md').length,
          changedFiles: changedPaths.length
        };
        for (const [metric, expected] of Object.entries(expectedMetrics)) {
          if (run.metrics?.[metric] !== expected) {
            errors.push(
              `${definition.id}.metrics.${metric} must equal ${expected}`
            );
          }
        }
        for (const action of run.actions) {
          if (action?.kind === 'edit') {
            if (!Array.isArray(action.paths) || action.paths.length === 0) {
              errors.push(`${definition.id} edit paths must be non-empty`);
              continue;
            }
            for (const changedPath of action.paths) {
              if (!definition.allowedChangedPaths.includes(changedPath)) {
                errors.push(
                  `${definition.id} edited undeclared path: ${changedPath}`
                );
              }
            }
          }
        }
      }
      if (run.outcome?.verification !== 'passed') {
        errors.push(`${definition.id}.outcome.verification must be passed`);
      }
      if (
        !Array.isArray(run.outcome?.scopeViolations) ||
        run.outcome.scopeViolations.length > 0
      ) {
        errors.push(`${definition.id} must report zero scope violations`);
      }
      const expectedRestart =
        definition.condition === 'harness' ? true : null;
      if (run.outcome?.restartStateCorrect !== expectedRestart) {
        errors.push(
          `${definition.id}.restartStateCorrect must be ${expectedRestart}`
        );
      }
      if (!Number.isInteger(run.outcome?.elapsedMs) ||
        run.outcome.elapsedMs <= 0) {
        errors.push(`${definition.id}.elapsedMs must be a positive integer`);
      }
      for (const field of ['diffSha256', 'testOutputSha256']) {
        if (!SHA256.test(run.outcome?.[field] ?? '')) {
          errors.push(`${definition.id}.${field} must be SHA-256`);
        }
      }
    }
  }
  if (!Array.isArray(record.conclusions) || record.conclusions.length === 0) {
    errors.push('conclusions must be non-empty');
  } else {
    for (const conclusion of record.conclusions) {
      if (conclusion?.status !== 'observed') {
        errors.push('every conclusion status must remain observed');
      }
      if (
        !Array.isArray(conclusion?.supportingRuns) ||
        conclusion.supportingRuns.length === 0
      ) {
        errors.push('every conclusion must cite supporting runs');
      }
    }
  }
  if (!Array.isArray(record.limitations) || record.limitations.length < 3) {
    errors.push('at least three limitations are required');
  }
  if (record.readinessLevelClaim !== 2) {
    errors.push('readinessLevelClaim must remain 2');
  }
  return errors;
}

async function main() {
  const resultPath = process.argv[2];
  if (resultPath === undefined || process.argv.length !== 3) {
    process.stderr.write(
      'Usage: node experiments/field-validation/validate-results.mjs <result.json>\n'
    );
    process.exitCode = 2;
    return;
  }
  try {
    const record = JSON.parse(await readFile(path.resolve(resultPath), 'utf8'));
    const errors = validateResults(record);
    if (errors.length > 0) {
      process.stderr.write(`Field validation failed:\n${errors.map(
        (error) => `- ${error}`
      ).join('\n')}\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(
      `Field validation passed: ${record.id} (${record.runs.length} runs, observed only)\n`
    );
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await main();
}
