'use strict';

// paackage.json handling
const { existsSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// base server
const { createServer } = require('http');

// incoming request handlers
const healthCheck = require('./lib/health-check');
const requestHandler = require('./lib/request-handler');

function start(functionPath, port, cb) {
  installDependenciesIfExist(functionPath);

  switch (typeof port) {
    case 'function':
      cb = port;
      port = 8080;
      break;
    case 'undefined':
      port = 8080;
      break;
  }

  const handler = requestHandler(functionPath);

  // listen for incoming requests
  const app = createServer((req, res) => {
    healthCheck(req, res, handler);
  });

  app.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    console.error(err);
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(port, _ => {
      // eslint-disable-next-line
      console.log(`Server listening on port ${app.address().port}`);
      if (cb) cb(server);
      resolve(server);
    });
  });
}

function installDependenciesIfExist(functionPath) {
  if (path.extname(functionPath) !== '') {
    functionPath = path.dirname(functionPath);
  }
  if (existsSync(path.join(functionPath, 'package.json'))) {
    execSync('npm install --production', { cwd: functionPath });
  }
}

module.exports = exports = start;
