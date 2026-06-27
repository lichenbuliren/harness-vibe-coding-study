#!/usr/bin/env node

import {spawn} from 'node:child_process';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {packagePlugin} from './package-harness-plugin.mjs';

const PLUGIN_NAME = 'harness-engineering';
const MARKETPLACE_NAME = 'harness-engineering-local';
const PLUGIN_ID = `${PLUGIN_NAME}@${MARKETPLACE_NAME}`;
const SKILLS = Object.freeze([
  'harness-engineering:harness-creator',
  'harness-engineering:harness-doctor'
]);
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const usage = `Usage:
  node scripts/install-harness-plugin.mjs [options]

Options:
  --marketplace-root <directory>  Marketplace root (default: repository root)
  --codex-bin <executable>        Codex executable (default: codex)
  --cachebuster <token>           Codex version token (default: UTC timestamp)
  --help                          Show this help
`;

class InstallError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InstallError';
  }
}

function timestampCachebuster(date = new Date()) {
  return `local-${date.toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replaceAll('-', '')
    .replaceAll(':', '')
    .replace('T', '-')
    .replace('Z', '')}`;
}

function validateCachebuster(token) {
  if (
    typeof token !== 'string'
    || !/^[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?$/.test(token)
  ) {
    throw new InstallError(
      'The cachebuster must use only letters, numbers, dots, and hyphens.'
    );
  }
  return token;
}

function withCachebuster(version, token) {
  validateCachebuster(token);
  if (typeof version !== 'string' || version.length === 0) {
    throw new InstallError('The plugin version must be a non-empty string.');
  }
  return `${version.split('+', 1)[0]}+codex.${token}`;
}

function parseArguments(arguments_) {
  if (arguments_.includes('--help') || arguments_.includes('-h')) {
    if (arguments_.length !== 1) {
      throw new InstallError('Help cannot be combined with other arguments.');
    }
    return {help: true};
  }

  const values = new Map();
  const known = new Set([
    '--marketplace-root',
    '--codex-bin',
    '--cachebuster'
  ]);
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (!known.has(argument)) {
      throw new InstallError(`Unknown argument: ${argument}`);
    }
    if (values.has(argument)) {
      throw new InstallError(`Duplicate argument: ${argument}`);
    }
    index += 1;
    if (index >= arguments_.length || arguments_[index].startsWith('--')) {
      throw new InstallError(`Missing value for argument: ${argument}`);
    }
    values.set(argument, arguments_[index]);
  }

  const codexBinary = values.get('--codex-bin') ?? 'codex';
  if (codexBinary.trim() === '') {
    throw new InstallError('The Codex executable must be non-empty.');
  }
  const cachebuster = validateCachebuster(
    values.get('--cachebuster') ?? timestampCachebuster()
  );

  return {
    help: false,
    marketplaceRoot: path.resolve(
      values.get('--marketplace-root') ?? repositoryRoot
    ),
    codexBinary,
    cachebuster
  };
}

function executeProcess(command, arguments_, options = {}) {
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

async function executeJson(execute, command, arguments_, options) {
  const result = await execute(command, arguments_, options);
  if (result.code !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim()
      || `exit ${result.code}`;
    throw new InstallError(
      `Codex command failed: ${arguments_.join(' ')}: ${detail}`
    );
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new InstallError(
      `Codex command returned invalid JSON: ${arguments_.join(' ')}`
    );
  }
}

async function readMarketplace(marketplaceRoot) {
  const marketplacePath = path.join(
    marketplaceRoot,
    '.agents',
    'plugins',
    'marketplace.json'
  );
  let marketplace;
  try {
    marketplace = JSON.parse(await readFile(marketplacePath, 'utf8'));
  } catch (error) {
    throw new InstallError(
      `Cannot read marketplace metadata: ${error.message}`
    );
  }
  const entry = marketplace.plugins?.find(
    (plugin) => plugin.name === PLUGIN_NAME
  );
  if (
    marketplace.name !== MARKETPLACE_NAME
    || entry?.source?.source !== 'local'
    || entry?.source?.path !== `./plugins/${PLUGIN_NAME}`
  ) {
    throw new InstallError(
      'Marketplace metadata does not expose the canonical Harness Engineering plugin.'
    );
  }
  return marketplacePath;
}

async function existingDestinationIsGenerated(output) {
  let outputStat;
  try {
    outputStat = await lstat(output);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
  if (!outputStat.isDirectory() || outputStat.isSymbolicLink()) {
    throw new InstallError(
      `Refusing to replace unexpected plugin directory: ${output}`
    );
  }

  try {
    const manifest = JSON.parse(await readFile(
      path.join(output, '.codex-plugin', 'plugin.json'),
      'utf8'
    ));
    if (manifest.name !== PLUGIN_NAME) {
      throw new Error('plugin name mismatch');
    }
  } catch {
    throw new InstallError(
      `Refusing to replace unexpected plugin directory: ${output}`
    );
  }
  return true;
}

async function publishInstallBundle(options) {
  const outputParent = path.join(options.marketplaceRoot, 'plugins');
  const output = path.join(outputParent, PLUGIN_NAME);
  await mkdir(outputParent, {recursive: true});
  const stageParent = await mkdtemp(path.join(
    outputParent,
    `.${PLUGIN_NAME}.install-`
  ));
  const stagedPlugin = path.join(stageParent, PLUGIN_NAME);

  try {
    await packagePlugin(stagedPlugin, {sourceRoot: options.sourceRoot});
    const manifestPath = path.join(
      stagedPlugin,
      '.codex-plugin',
      'plugin.json'
    );
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.version = withCachebuster(
      manifest.version,
      options.cachebuster
    );
    await writeFile(
      manifestPath,
      `${JSON.stringify(manifest, null, 2)}\n`
    );

    if (await existingDestinationIsGenerated(output)) {
      await rm(output, {recursive: true});
    }
    await rename(stagedPlugin, output);
    return {
      output,
      version: manifest.version
    };
  } finally {
    await rm(stageParent, {recursive: true, force: true});
  }
}

async function installPlugin(options = {}) {
  const marketplaceRoot = path.resolve(
    options.marketplaceRoot ?? repositoryRoot
  );
  const codexBinary = options.codexBinary ?? 'codex';
  const cachebuster = validateCachebuster(
    options.cachebuster ?? timestampCachebuster()
  );
  const execute = options.execute ?? executeProcess;
  const environment = options.env ?? process.env;
  const sourceRoot = path.resolve(options.sourceRoot ?? repositoryRoot);

  await readMarketplace(marketplaceRoot);
  const bundle = await publishInstallBundle({
    marketplaceRoot,
    sourceRoot,
    cachebuster
  });

  const commandOptions = {
    cwd: marketplaceRoot,
    env: environment
  };
  const marketplace = await executeJson(
    execute,
    codexBinary,
    ['plugin', 'marketplace', 'add', marketplaceRoot, '--json'],
    commandOptions
  );
  if (marketplace.marketplaceName !== MARKETPLACE_NAME) {
    throw new InstallError(
      `Codex registered unexpected marketplace: ${marketplace.marketplaceName}`
    );
  }

  const installed = await executeJson(
    execute,
    codexBinary,
    ['plugin', 'add', PLUGIN_ID, '--json'],
    commandOptions
  );
  if (
    installed.pluginId !== PLUGIN_ID
    || installed.version !== bundle.version
    || typeof installed.installedPath !== 'string'
  ) {
    throw new InstallError('Codex returned an unexpected install result.');
  }

  const listed = await executeJson(
    execute,
    codexBinary,
    ['plugin', 'list', '--available', '--json'],
    commandOptions
  );
  const record = listed.installed?.find(
    (plugin) => plugin.pluginId === PLUGIN_ID
  );
  if (
    record?.installed !== true
    || record.enabled !== true
    || record.version !== bundle.version
  ) {
    throw new InstallError(
      'Installed Harness Engineering plugin is not enabled at the expected version.'
    );
  }

  return {
    schemaVersion: '1.0.0',
    pluginId: PLUGIN_ID,
    version: bundle.version,
    marketplaceRoot,
    installedPath: installed.installedPath,
    skills: [...SKILLS],
    newThreadRequired: true
  };
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(usage);
      return;
    }
    const result = await installPlugin(options);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n\n${usage}`);
    process.exitCode = 2;
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await main();
}

export {
  InstallError,
  installPlugin,
  parseArguments,
  timestampCachebuster,
  withCachebuster
};
