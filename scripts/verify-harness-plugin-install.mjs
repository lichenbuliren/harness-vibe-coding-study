#!/usr/bin/env node

import {spawn} from 'node:child_process';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {installPlugin} from './install-harness-plugin.mjs';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

class VerificationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VerificationError';
  }
}

function execute(command, arguments_, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, arguments_, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code, signal) => {
      resolve({code, signal, stdout, stderr});
    });
  });
}

async function executeChecked(command, arguments_, options = {}) {
  const result = await execute(command, arguments_, options);
  if (result.code !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim()
      || `exit ${result.code}`;
    throw new VerificationError(
      `Command failed: ${command} ${arguments_.join(' ')}: ${detail}`
    );
  }
  return result.stdout;
}

async function executeJson(command, arguments_, options = {}) {
  const stdout = await executeChecked(command, arguments_, options);
  try {
    return JSON.parse(stdout);
  } catch {
    throw new VerificationError(
      `Command returned invalid JSON: ${command} ${arguments_.join(' ')}`
    );
  }
}

function requireDiscovery(promptInput, install) {
  const content = JSON.stringify(promptInput);
  for (const skill of install.skills) {
    if (!content.includes(`- ${skill}:`)) {
      throw new VerificationError(
        `Fresh Codex process did not discover ${skill}.`
      );
    }
  }
  if (!content.includes(install.installedPath)) {
    throw new VerificationError(
      'Fresh Codex process did not load skills from the installed cache path.'
    );
  }
}

async function verifyInstall() {
  const temporaryRoot = await mkdtemp(path.join(
    os.tmpdir(),
    'harness-plugin-verification-'
  ));
  const marketplaceRoot = path.join(temporaryRoot, 'marketplace');
  const codexHome = path.join(temporaryRoot, 'codex-home');
  const target = path.join(temporaryRoot, 'target');
  const marketplaceMetadata = path.join(
    marketplaceRoot,
    '.agents',
    'plugins'
  );
  await mkdir(marketplaceMetadata, {recursive: true});
  await mkdir(codexHome, {recursive: true});
  await mkdir(target, {recursive: true});
  await copyFile(
    path.join(
      repositoryRoot,
      '.agents',
      'plugins',
      'marketplace.json'
    ),
    path.join(marketplaceMetadata, 'marketplace.json')
  );

  const codexBinary = process.env.CODEX_BIN ?? 'codex';
  const environment = {
    ...process.env,
    CODEX_HOME: codexHome,
    FORCE_COLOR: '0',
    NO_COLOR: '1'
  };

  try {
    const install = await installPlugin({
      marketplaceRoot,
      codexBinary,
      cachebuster: 'verify',
      env: environment
    });
    const promptInput = await executeJson(
      codexBinary,
      [
        'debug',
        'prompt-input',
        'Use the installed Harness Engineering plugin.'
      ],
      {cwd: target, env: environment}
    );
    requireDiscovery(promptInput, install);

    const creator = path.join(
      install.installedPath,
      'skills',
      'harness-creator',
      'scripts',
      'creator.mjs'
    );
    const doctor = path.join(
      install.installedPath,
      'skills',
      'harness-doctor',
      'scripts',
      'doctor.mjs'
    );
    const plan = await executeJson(
      process.execPath,
      [
        creator,
        'plan',
        '--target',
        target,
        '--with-handoff',
        '--format',
        'json'
      ],
      {cwd: target, env: environment}
    );
    await executeJson(
      process.execPath,
      [
        creator,
        'apply',
        '--target',
        target,
        '--plan-id',
        plan.planId,
        '--with-handoff',
        '--format',
        'json'
      ],
      {cwd: target, env: environment}
    );
    await executeChecked(
      path.join(target, 'init.sh'),
      [],
      {cwd: target, env: environment}
    );

    const featureState = JSON.parse(await readFile(
      path.join(target, 'feature_list.json'),
      'utf8'
    ));
    const contextFeature = featureState.features.find(
      (feature) => feature.status === 'next'
    )?.id;
    if (contextFeature !== 'harness-context-restoration') {
      throw new VerificationError(
        'Creator did not create the required Context restoration task.'
      );
    }

    const assessment = await executeJson(
      process.execPath,
      [doctor, '--target', target, '--format', 'json'],
      {cwd: target, env: environment}
    );
    const environmentRecommendation = assessment.recommendations.find(
      (item) => item.ruleId === 'environment.bootstrap'
    )?.message;
    if (environmentRecommendation !== 'Add environment metadata.') {
      throw new VerificationError(
        'Doctor did not report the precise missing environment requirement.'
      );
    }

    return {
      schemaVersion: '1.0.0',
      pluginId: install.pluginId,
      version: install.version,
      skills: install.skills,
      freshProcessDiscovery: 'passed',
      contextFeature,
      initialization: 'passed',
      doctor: {
        environmentLevel: assessment.subsystems.environment.level,
        environmentRecommendation,
        effectiveness: assessment.effectiveness.status
      }
    };
  } finally {
    await rm(temporaryRoot, {recursive: true, force: true});
  }
}

async function main() {
  try {
    const result = await verifyInstall();
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await main();
}

export {
  VerificationError,
  verifyInstall
};
