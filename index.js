'use strict';

const healthCheck = require('./lib/health-check');
const requestHandler = require('./lib/request-handler');

// function context
const Context = require('./lib/context');

// HTTP framework
const fastify = require('fastify');

const DEFAULT_PORT = 8080;

function start(func, port, cb) {
  switch (typeof port) {
    case 'function':
      cb = port;
      port = DEFAULT_PORT;
      break;
    case 'undefined':
      port = DEFAULT_PORT;
      break;
  }

  const server = fastify({ logger: true });
  server.decorateRequest('context');
  server.addHook('onRequest', (req, reply, done) => {
    req.context = new Context(req, reply);
    done();
  });
  server.register(healthCheck);
  server.register(requestHandler, { func });
  server.addContentTypeParser('*', function(req, done) {
    var data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      done(null, data);
    });
  });

  // app.on('clientError', (err, socket) => {
  //   socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  //   console.error(err);
  // });

  return new Promise((resolve, reject) => {
    server.listen(port, err => {
      if (err) return reject(err);
      if (cb) cb(server.server);
      resolve(server.server);
    });
  });
}

module.exports = exports = start;
