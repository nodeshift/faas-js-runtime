'use strict';
const qs = require('qs');
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

  // All incoming requests get a Context object
  server.decorateRequest('context');
  server.addHook('onRequest', (req, reply, done) => {
    req.context = new Context(req, reply);
    done();
  });

  // Incoming requests to the readiness and liveness URLs
  server.register(healthCheck);

  // Incoming requests to the hosted function
  server.register(requestHandler, { func });

  server.addContentTypeParser('application/x-www-form-urlencoded',
    function(req, done) {
      var body = '';
      req.on('data', data => (body += data));
      req.on('end', _ => {
        try {
          const parsed = qs.parse(body);
          done(null, parsed);
        } catch (e) {
          done(e);
        }
      });
      req.on('error', done);
    });

  return new Promise((resolve, reject) => {
    server.listen(port, err => {
      if (err) return reject(err);
      if (cb) cb(server.server);
      resolve(server.server);
    });
  });
}

module.exports = exports = start;
