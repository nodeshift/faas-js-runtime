const test = require('tape');
const path = require('path');
const { loadFunction } = require('../lib/function-loader.js');

const fixtureDir = path.join(__dirname, 'fixtures');

test('Loads a CJS function', async t => {
  const fn = await loadFunction(path.join(fixtureDir, 'cjs-module', 'index.js'));
  t.equal(typeof fn, 'function');
  t.pass('CJS function loaded');
});

test('Loads an ESM function with an .mjs extension', async t => {
  const fn = await loadFunction(path.join(fixtureDir, 'esm-module-mjs', 'index.mjs'));
  t.equal(typeof fn.handle, 'function');
  t.pass('ESM module with a mjs ext loaded');
});

test('Loads an ESM function with the type=module in the package.json', async t => {
  const fn = await loadFunction(path.join(fixtureDir, 'esm-module-type-module', 'index.js'));
  t.equal(typeof fn.handle, 'function');
  t.pass('ESM module with a type=module in the package.json');
});

test('Loads an ESM function with the type=module in package.json in a parent dir and a .js extension', async t => {
  const fn = await loadFunction(path.join(fixtureDir, 'esm-module-type-up-dir', 'build', 'index.js'));
  t.equal(typeof fn.handle, 'function');
  t.pass('ESM module with a type=module in a package.json in parent directory');
});
