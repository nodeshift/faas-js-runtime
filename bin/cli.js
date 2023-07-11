#!/usr/bin/env node
const path = require('path');

const { start, defaults } = require('../');
const { loadFunction } = require('../lib/function-loader.js');
const pkg = require('../package.json');
const { Command } = require('commander');

const program = new Command();

program
  .version(pkg.version)
  .option('--log-level <log-level>', 'change the log level of the function', defaults.LOG_LEVEL)
  .option('--port <port>', 'change the port the runtime listens on', defaults.PORT)
  .option('--include-raw', 'include the raw body in the request context', defaults.INCLUDE_RAW)
  .arguments('<file>')
  .action(runServer);

program.parse(process.argv);

async function runServer(file) {
  const programOpts = program.opts();

  try {
    let options = {
      logLevel: process.env.FUNC_LOG_LEVEL || programOpts['logLevel'] || defaults.LOG_LEVEL,
      port: process.env.FUNC_PORT || programOpts.port || defaults.PORT,
      includeRaw: process.env.FUNC_INCLUDE_RAW ? true : programOpts.includeRaw || defaults.INCLUDE_RAW,
    };

    const filePath = extractFullPath(file);
    const code = await loadFunction(filePath);

    // The module will extract `handle` and other lifecycle functions
    // from `code` if it is an object. If it's just a function, it will
    // be used directly.
    if (typeof code === 'function' || typeof code === 'object') {
      return start(code, options);
    } else {
      console.error(code);
      throw TypeError(`Cannot find Invokable function 'handle' in ${code}`);
    }
  } catch (error) {
    console.error(`⛔ ${error}`);
  }
}

function extractFullPath(file) {
  if (path.isAbsolute(file)) return file;
  return path.join(process.cwd(), file);
}
