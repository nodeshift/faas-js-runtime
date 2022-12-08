#!/usr/bin/env node
const path = require('path');

const { start, defaults } = require('../');
const pkg = require('../package.json');

const ON_DEATH = require('death')({ uncaughtException: true });
const { Command } = require('commander');

// This is the way to import es modules inside a CJS module
const dynamicImport = new Function('modulePath', 'return import(modulePath)');

const program = new Command();

program
  .version(pkg.version)
  .option('--log-level <log-level>', 'change the log level of the function', defaults.LOG_LEVEL)
  .option('--port <port>', 'change the port the runtime listens on', defaults.PORT)
  .arguments('<file>')
  .action(runServer);

program.parse(process.argv);

async function runServer(file) {
  const programOpts = program.opts();

  try {
    let server;
    let options = {
      logLevel: process.env.FUNC_LOG_LEVEL || programOpts['logLevel'] || defaults.LOG_LEVEL,
      port: process.env.FUNC_PORT || programOpts.port || defaults.PORT
    };

    const filePath = extractFullPath(file);

    let code;
    if (isESM(filePath)) {
      code = await dynamicImport(filePath);
    } else {
      code = require(filePath);
    }

    if (typeof code === 'function') {
      server = await start(code, options);
    } else if (typeof code.handle === 'function') {
      server = await start(code.handle, options);
    } else {
      console.error(code);
      throw TypeError(`Cannot find Invokable function 'handle' in ${code}`);
    }
    ON_DEATH(_ => {
      server.close();
    });
  } catch (error) {
    console.error(`⛔ ${error}`);
  }
}

function extractFullPath(file) {
  if (path.isAbsolute(file)) return file;
  return path.join(process.cwd(), file);
}


// An ESM module can be determined 2 ways
// 1. has the mjs file extention
// 2. type=module in the package.json
function isESM(filePath) {
  const pathParsed = path.parse(filePath);

  if (pathParsed.ext === '.mjs') {
    return true;
  }

  // find the functions package.json and see if it has a type field
  const functionPkg = require(path.join(pathParsed.dir, 'package.json'));
  if (functionPkg.type === 'module') {
    return true;
  }

  // Should default to CJS
  return false;
}
