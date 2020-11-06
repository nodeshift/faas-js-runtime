#!/usr/bin/env node
const path = require('path');

const runtime = require('../');
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
    const func = require(extractFullPath(file));
    const server = await runtime(func);

    ON_DEATH(_ => {
      server.close();
      log(chalk.yellow(`Goodbye!`));
    });

    log(chalk.blue(`
The server has started.

You can use curl to POST an event to the endpoint:

curl -X POST -d '{"hello": "world"}' \\
    -H'Content-type: application/json' \\
    -H'Ce-id: 1' \\
    -H'Ce-source: cloud-event-example' \\
    -H'Ce-type: dev.knative.example' \\
    -H'Ce-specversion: 1.0' \\
    http://localhost:8080`));

  } catch (error) {
    log(chalk.redBright('Something went wrong'));
    log(chalk.red(error));
  }
}

function extractFullPath(file) {
  if (path.isAbsolute(file)) return file;
  return path.join(process.cwd(), file);
}
