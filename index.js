'use strict';

const { execSync } = require('child_process');
const { createServer } = require('http');
const { existsSync } = require('fs');
const path = require('path');
const Context = require('./lib/context');
const eventHandler = require('./lib/event-handler');
const protection = require('overload-protection');

// Default LIVENESS/READINESS urls
const READINESS_URL = '/health';
const LIVENESS_URL = '/health';

module.exports = exports = start;

function installDependenciesIfExist(functionPath) {
  if (path.extname(functionPath) !== '') {
    functionPath = path.dirname(functionPath);
  }
  if (existsSync(path.join(functionPath, 'package.json'))) {
    execSync('npm install --production', { cwd: functionPath });
  }
}

function start(functionPath, port, cb) {
  installDependenciesIfExist(functionPath);
  const func = require(functionPath);

  switch(typeof port) {
    case 'function':
      cb = port;
      port = 8080;
      break;
    case 'undefined':
      port = 8080;
      break;
  }

  // Configure protect for liveness/readiness probes
  const protectCfg = {
    production: process.env.NODE_ENV === 'production',
    maxHeapUsedBytes: 0, // Max heap used threshold (0 to disable) [default 0]
    maxRssBytes: 0, // Max rss size threshold (0 to disable) [default 0]
    errorPropagationMode: false // Don't propagate error
  };
  const readinessURL = process.env.READINESS_URL || READINESS_URL;
  const livenessURL = process.env.LIVENESS_URL || LIVENESS_URL;
  const protect = protection('http', protectCfg);

  // listen for incoming requests
  const app = createServer((req, res) => {
    const context = new Context(req, res);
    // Check if health path
    if (req.url === readinessURL || req.url === livenessURL) {
      protect(req, res, () => res.end('OK'));
    } else if (('ce-type' in req.headers) &&
      req.headers['ce-type'].startsWith('dev.knative')) {
      eventHandler(req, res)
        .then(event => {
          context.cloudevent = event;
          res.end(func(context));
        })
        .catch(err => {
          // TODO: This should do some better error handling.
          console.error(err);
          res.end(err);
        });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const body = func(context);
      if (typeof body.then === 'function') {
        body.then(body => {
          res.end(JSON.stringify({ body }));
        });
      } else {
        res.end(JSON.stringify({ body }));
      }
    }
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


