const test = require('tape');
const path = require('path');
const { loadFunction } = require('../lib/function-loader.js');

const fixtureDir = path.join(__dirname, 'fixtures');

test('Loads a CJS function', async t => {
  await loadFunction(path.join(fixtureDir, 'cjs-module', 'index.js'));
  t.pass('CJS function loaded');
});

test('Loads an ESM function with an .mjs extension', async t => {
  await loadFunction(path.join(fixtureDir, 'esm-module-mjs', 'index.mjs'));
  t.pass('ESM module with a mjs ext loaded');
});

test('Loads an ESM function with the type=module in the package.json', async t => {
  await loadFunction(path.join(fixtureDir, 'esm-module-type-module', 'index.js'));
  t.pass('ESM module with a type=module in the package.json');
});
