#!/usr/bin/env node
const path = require('path');

const { start, defaults } = require('../');
const pkg = require('../package.json');

const chalk = require('chalk');
const ON_DEATH = require('death')({ uncaughtException: true });
const { Command } = require('commander');

// eslint-disable-next-line no-console
const log = console.log;
const program = new Command();

program
  .version(pkg.version)
  .option('--logLevel <logLevel>', 'change the log level of the function', 'warn')
  .option('--port <port>', 'change the port the runtime listens on', 8080)
  .arguments('<file>')
  .action(runServer);

program.parse(process.argv);

async function runServer(file) {
  const programOpts = program.opts();
  
  try {
    let server;
    let options = {
      logLevel: programOpts.logLevel || process.env.FUNC_LOG_LEVEL || defaults.LOG_LEVEL,
      port: programOpts.port || process.env.FUNC_PORT || defaults.PORT
    };

    const filePath = extractFullPath(file);
    const code = require(filePath);
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
      log(chalk.yellow(`Goodbye!`));
    });
    log(chalk.blue(`The server has started. http://localhost:8080`));
  } catch (error) {
    log(chalk.red(error));
  }
}

function extractFullPath(file) {
  if (path.isAbsolute(file)) return file;
  return path.join(process.cwd(), file);
}
