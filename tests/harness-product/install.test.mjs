import assert from 'node:assert/strict';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

import {
  installPlugin,
  withCachebuster
} from '../../scripts/install-harness-plugin.mjs';
import {runNode} from './helpers.mjs';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const installer = path.join(
  repositoryRoot,
  'scripts',
  'install-harness-plugin.mjs'
);
const verifier = path.join(
  repositoryRoot,
  'scripts',
  'verify-harness-plugin-install.mjs'
);

async function temporaryMarketplace() {
  const root = await mkdtemp(path.join(
    os.tmpdir(),
    'harness-install-marketplace-'
  ));
  const metadataRoot = path.join(root, '.agents', 'plugins');
  await mkdir(metadataRoot, {recursive: true});
  await copyFile(
    path.join(
      repositoryRoot,
      '.agents',
      'plugins',
      'marketplace.json'
    ),
    path.join(metadataRoot, 'marketplace.json')
  );
  return root;
}

test('repository exposes the canonical local marketplace entry', async () => {
  const marketplace = JSON.parse(await readFile(
    path.join(
      repositoryRoot,
      '.agents',
      'plugins',
      'marketplace.json'
    ),
    'utf8'
  ));

  assert.equal(marketplace.name, 'harness-engineering-local');
  assert.deepEqual(marketplace.interface, {
    displayName: 'Harness Engineering Local'
  });
  assert.deepEqual(marketplace.plugins, [{
    name: 'harness-engineering',
    source: {
      source: 'local',
      path: './plugins/harness-engineering'
    },
    policy: {
      installation: 'AVAILABLE',
      authentication: 'ON_INSTALL'
    },
    category: 'Developer Tools'
  }]);
});

test('replaces one Codex cachebuster without changing the base version', () => {
  assert.equal(
    withCachebuster('0.1.0', 'local-20260628-120000'),
    '0.1.0+codex.local-20260628-120000'
  );
  assert.equal(
    withCachebuster('0.1.0+codex.old', 'local-20260628-120000'),
    '0.1.0+codex.local-20260628-120000'
  );
  assert.throws(
    () => withCachebuster('0.1.0', 'bad/token'),
    /cachebuster/
  );
});

test('installs through the marketplace and verifies the enabled version', async () => {
  const marketplaceRoot = await temporaryMarketplace();
  const calls = [];
  let installedVersion;
  const installedPath = path.join(marketplaceRoot, 'installed-plugin');

  const execute = async (command, arguments_) => {
    calls.push([command, ...arguments_]);
    if (arguments_.slice(0, 3).join(' ') === 'plugin marketplace add') {
      return {
        code: 0,
        stdout: JSON.stringify({
          marketplaceName: 'harness-engineering-local',
          installedRoot: marketplaceRoot,
          alreadyAdded: false
        }),
        stderr: ''
      };
    }
    if (arguments_.slice(0, 2).join(' ') === 'plugin add') {
      const manifest = JSON.parse(await readFile(
        path.join(
          marketplaceRoot,
          'plugins',
          'harness-engineering',
          '.codex-plugin',
          'plugin.json'
        ),
        'utf8'
      ));
      installedVersion = manifest.version;
      return {
        code: 0,
        stdout: JSON.stringify({
          pluginId: 'harness-engineering@harness-engineering-local',
          name: 'harness-engineering',
          marketplaceName: 'harness-engineering-local',
          version: installedVersion,
          installedPath
        }),
        stderr: ''
      };
    }
    if (arguments_.slice(0, 2).join(' ') === 'plugin list') {
      return {
        code: 0,
        stdout: JSON.stringify({
          installed: [{
            pluginId: 'harness-engineering@harness-engineering-local',
            version: installedVersion,
            installed: true,
            enabled: true
          }],
          available: []
        }),
        stderr: ''
      };
    }
    throw new Error(`Unexpected command: ${command} ${arguments_.join(' ')}`);
  };

  const result = await installPlugin({
    marketplaceRoot,
    cachebuster: 'test',
    codexBinary: 'test-codex',
    execute
  });

  assert.deepEqual(calls.map((call) => call.slice(0, 4)), [
    ['test-codex', 'plugin', 'marketplace', 'add'],
    ['test-codex', 'plugin', 'add', 'harness-engineering@harness-engineering-local'],
    ['test-codex', 'plugin', 'list', '--available']
  ]);
  assert.equal(result.version, '0.1.0+codex.test');
  assert.equal(result.installedPath, installedPath);
  assert.deepEqual(result.skills, [
    'harness-engineering:harness-creator',
    'harness-engineering:harness-doctor'
  ]);
  assert.equal(result.newThreadRequired, true);
});

test('refuses to replace an unexpected plugin directory', async () => {
  const marketplaceRoot = await temporaryMarketplace();
  const unexpected = path.join(
    marketplaceRoot,
    'plugins',
    'harness-engineering'
  );
  await mkdir(unexpected, {recursive: true});
  await writeFile(path.join(unexpected, 'owner-data.txt'), 'keep\n');

  await assert.rejects(
    installPlugin({
      marketplaceRoot,
      cachebuster: 'test',
      execute() {
        throw new Error('Codex must not run for an unsafe destination.');
      }
    }),
    /refusing to replace unexpected plugin directory/i
  );
  assert.equal(
    await readFile(path.join(unexpected, 'owner-data.txt'), 'utf8'),
    'keep\n'
  );
});

test('CLI rejects invalid arguments without creating plugin output', async () => {
  const marketplaceRoot = await temporaryMarketplace();
  const result = await runNode(installer, [
    '--marketplace-root',
    marketplaceRoot,
    '--unknown'
  ], {cwd: repositoryRoot});

  assert.equal(result.code, 2);
  assert.match(result.stderr, /Unknown argument: --unknown/);
  assert.match(result.stderr, /Usage:/);
  await assert.rejects(
    readFile(
      path.join(
        marketplaceRoot,
        'plugins',
        'harness-engineering',
        '.codex-plugin',
        'plugin.json'
      )
    ),
    {code: 'ENOENT'}
  );
});

test('real Codex discovers and runs the installed plugin in isolation', {
  timeout: 30_000
}, async () => {
  const result = await runNode(verifier, [], {cwd: repositoryRoot});

  assert.equal(result.code, 0, result.stderr);
  const verification = JSON.parse(result.stdout);
  assert.deepEqual(verification.skills, [
    'harness-engineering:harness-creator',
    'harness-engineering:harness-doctor'
  ]);
  assert.equal(
    verification.contextFeature,
    'harness-context-restoration'
  );
  assert.equal(
    verification.doctor.environmentRecommendation,
    'Add environment metadata.'
  );
});
