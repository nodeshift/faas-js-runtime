#!/usr/bin/env node
const path = require('path');

const { start } = require('../');
const pkg = require('../package.json');

const chalk = require('chalk');
const ON_DEATH = require('death')({ uncaughtException: true });
const { Command } = require('commander');

// eslint-disable-next-line no-console
const log = console.log;
const program = new Command();

program
  .version(pkg.version)
  .arguments('<file>')
  .action(runServer);

program.parse(process.argv);

async function runServer(file) {
  try {
    let server;
    const filePath = extractFullPath(file);
    const code = require(filePath);
    if (typeof code === 'function') {
      server = await start(code);
    } else if (typeof code.handle === 'function') {
      server = await start(code.handle);
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
