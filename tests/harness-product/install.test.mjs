import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

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
