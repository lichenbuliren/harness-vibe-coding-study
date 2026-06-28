#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {
  access,
  chmod,
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const PLUGIN_NAME = 'harness-engineering';
const SOURCE_CORE_PREFIX = '../../../packages/harness-core/';
const BUNDLED_CORE_PREFIX = '../../../runtime/harness-core/';
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const pluginManifest = {
  name: PLUGIN_NAME,
  version: '0.1.0',
  description: 'Create, diagnose, and archive restartable coding-agent harnesses.',
  author: {
    name: 'Harness Vibe Coding Study'
  },
  skills: './skills/',
  interface: {
    displayName: 'Harness Engineering',
    shortDescription: 'Create, diagnose, and archive agent harnesses.',
    longDescription:
      'Plan safe harness changes, diagnose readiness, and archive completed stages with one shared contract core.',
    developerName: 'Harness Vibe Coding Study',
    category: 'Developer Tools',
    capabilities: ['Read', 'Write'],
    defaultPrompt:
      'Inspect this project, propose safe harness changes, diagnose readiness, and archive completed stages on request.'
  }
};

const usage = `Usage:
  node scripts/package-harness-plugin.mjs --output <path>/harness-engineering

Creates a new plugin directory. The output must not already exist.
`;

class PackagingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PackagingError';
  }
}

function parseArguments(arguments_) {
  if (arguments_.includes('--help') || arguments_.includes('-h')) {
    if (arguments_.length !== 1) {
      throw new PackagingError('Help cannot be combined with other arguments.');
    }
    return {help: true};
  }

  let output;
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument !== '--output') {
      throw new PackagingError(`Unknown argument: ${argument}`);
    }
    if (output !== undefined) {
      throw new PackagingError('Duplicate argument: --output');
    }
    index += 1;
    if (index >= arguments_.length || arguments_[index].startsWith('--')) {
      throw new PackagingError('Missing value for argument: --output');
    }
    output = arguments_[index];
  }
  if (output === undefined) {
    throw new PackagingError('Missing required argument: --output');
  }
  return {help: false, output};
}

async function pathExists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function listFiles(root, relative = '') {
  const directory = path.join(root, relative);
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name))) {
    const entryRelative = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(root, entryRelative));
    } else if (entry.isFile()) {
      files.push(entryRelative);
    } else {
      throw new PackagingError(
        `Unsupported packaged entry type: ${entryRelative}`
      );
    }
  }
  return files;
}

async function rewriteSkillImports(pluginRoot) {
  for (const skill of [
    'harness-creator',
    'harness-doctor',
    'harness-archiver'
  ]) {
    const scriptsRoot = path.join(pluginRoot, 'skills', skill, 'scripts');
    for (const relative of await listFiles(scriptsRoot)) {
      const filePath = path.join(scriptsRoot, relative);
      const source = await readFile(filePath, 'utf8');
      const rewritten = source.replaceAll(
        SOURCE_CORE_PREFIX,
        BUNDLED_CORE_PREFIX
      );
      if (rewritten !== source) {
        await writeFile(filePath, rewritten);
      }
    }
  }
}

function validateManifest(manifest) {
  const errors = [];
  const allowed = new Set([
    'id',
    'name',
    'version',
    'description',
    'skills',
    'apps',
    'mcpServers',
    'interface',
    'author',
    'homepage',
    'repository',
    'license',
    'keywords'
  ]);
  for (const key of Object.keys(manifest)) {
    if (!allowed.has(key)) {
      errors.push(`unsupported manifest field: ${key}`);
    }
  }
  const requiredStrings = ['name', 'version', 'description'];
  for (const key of requiredStrings) {
    if (typeof manifest[key] !== 'string' || manifest[key].trim() === '') {
      errors.push(`manifest field ${key} must be a non-empty string`);
    }
  }
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(
    manifest.version ?? ''
  )) {
    errors.push('manifest version must be strict semver');
  }
  if (manifest.name !== PLUGIN_NAME) {
    errors.push(`manifest name must be ${PLUGIN_NAME}`);
  }
  if (manifest.skills !== './skills/') {
    errors.push('manifest skills must be ./skills/');
  }
  if (
    typeof manifest.author !== 'object' ||
    typeof manifest.author?.name !== 'string' ||
    manifest.author.name.trim() === ''
  ) {
    errors.push('manifest author.name must be a non-empty string');
  }
  const interfaceRequired = [
    'displayName',
    'shortDescription',
    'longDescription',
    'developerName',
    'category',
    'defaultPrompt'
  ];
  if (typeof manifest.interface !== 'object') {
    errors.push('manifest interface must be an object');
  } else {
    for (const key of interfaceRequired) {
      if (
        typeof manifest.interface[key] !== 'string' ||
        manifest.interface[key].trim() === ''
      ) {
        errors.push(`manifest interface.${key} must be a non-empty string`);
      }
    }
    if (
      !Array.isArray(manifest.interface.capabilities) ||
      !manifest.interface.capabilities.every(
        (value) => typeof value === 'string' && value.trim() !== ''
      )
    ) {
      errors.push('manifest interface.capabilities must be an array of strings');
    }
  }
  if (JSON.stringify(manifest).includes('[TODO:')) {
    errors.push('manifest contains a TODO placeholder');
  }
  if (errors.length > 0) {
    throw new PackagingError(`Invalid plugin manifest: ${errors.join('; ')}`);
  }
}

async function validateBundle(pluginRoot, sourceRoot) {
  const manifest = JSON.parse(await readFile(
    path.join(pluginRoot, '.codex-plugin', 'plugin.json'),
    'utf8'
  ));
  validateManifest(manifest);

  for (const requiredPath of [
    'skills/harness-creator/SKILL.md',
    'skills/harness-creator/scripts/creator.mjs',
    'skills/harness-doctor/SKILL.md',
    'skills/harness-doctor/scripts/doctor.mjs',
    'skills/harness-archiver/SKILL.md',
    'skills/harness-archiver/scripts/archiver.mjs',
    'runtime/harness-core/package.json',
    'runtime/harness-core/src/index.mjs',
    'runtime/harness-core/rules/capabilities.json',
    'runtime/harness-core/schemas/assessment.schema.json'
  ]) {
    await access(path.join(pluginRoot, requiredPath));
  }

  for (const relative of await listFiles(pluginRoot)) {
    const source = await readFile(path.join(pluginRoot, relative));
    if (source.includes(Buffer.from(SOURCE_CORE_PREFIX))) {
      throw new PackagingError(
        `Repository core import remains in packaged file: ${relative}`
      );
    }
    if (source.includes(Buffer.from(sourceRoot))) {
      throw new PackagingError(
        `Repository absolute path remains in packaged file: ${relative}`
      );
    }
  }
}

async function describeBundle(pluginRoot) {
  const files = [];
  for (const relative of await listFiles(pluginRoot)) {
    const content = await readFile(path.join(pluginRoot, relative));
    files.push({
      path: relative,
      sha256: createHash('sha256').update(content).digest('hex')
    });
  }
  return {
    plugin: {
      name: pluginManifest.name,
      version: pluginManifest.version
    },
    files
  };
}

async function buildBundle(stageRoot, sourceRoot) {
  await mkdir(path.join(stageRoot, '.codex-plugin'), {recursive: true});
  await writeFile(
    path.join(stageRoot, '.codex-plugin', 'plugin.json'),
    `${JSON.stringify(pluginManifest, null, 2)}\n`
  );
  await mkdir(path.join(stageRoot, 'skills'), {recursive: true});
  for (const skill of [
    'harness-creator',
    'harness-doctor',
    'harness-archiver'
  ]) {
    await cp(
      path.join(sourceRoot, 'skills', skill),
      path.join(stageRoot, 'skills', skill),
      {recursive: true, errorOnExist: true, force: false}
    );
  }
  await mkdir(path.join(stageRoot, 'runtime'), {recursive: true});
  await cp(
    path.join(sourceRoot, 'packages', 'harness-core'),
    path.join(stageRoot, 'runtime', 'harness-core'),
    {
      recursive: true,
      errorOnExist: true,
      force: false,
      filter(source) {
        return !source.split(path.sep).includes('test');
      }
    }
  );
  await rewriteSkillImports(stageRoot);
  await chmod(
    path.join(stageRoot, 'skills', 'harness-creator', 'scripts', 'creator.mjs'),
    0o755
  );
  await chmod(
    path.join(stageRoot, 'skills', 'harness-doctor', 'scripts', 'doctor.mjs'),
    0o755
  );
  await chmod(
    path.join(stageRoot, 'skills', 'harness-archiver', 'scripts', 'archiver.mjs'),
    0o755
  );
}

async function packagePlugin(outputValue, options = {}) {
  const sourceRoot = path.resolve(options.sourceRoot ?? repositoryRoot);
  const output = path.resolve(outputValue);
  if (path.basename(output) !== PLUGIN_NAME) {
    throw new PackagingError(
      `Output directory must be named ${PLUGIN_NAME}.`
    );
  }
  if (await pathExists(output)) {
    throw new PackagingError(`Output already exists: ${PLUGIN_NAME}`);
  }

  const parent = path.dirname(output);
  await access(parent);
  const stage = await mkdtemp(path.join(parent, `.${PLUGIN_NAME}.stage-`));
  try {
    await buildBundle(stage, sourceRoot);
    await validateBundle(stage, sourceRoot);
    const description = await describeBundle(stage);
    await rename(stage, output);
    return description;
  } catch (error) {
    await rm(stage, {recursive: true, force: true});
    throw error;
  }
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(usage);
      return;
    }
    const result = await packagePlugin(options.output);
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
  packagePlugin,
  pluginManifest,
  validateManifest
};
