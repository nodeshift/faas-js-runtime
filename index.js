'use strict';
const qs = require('qs');
const healthCheck = require('./lib/health-check');
const requestHandler = require('./lib/request-handler');

// function context
const Context = require('./lib/context');

// HTTP framework
const fastify = require('fastify');

const DEFAULT_PORT = 8080;

function start(func, port, cb, options) {
  switch (typeof port) {
    case 'function':
      options = cb;
      cb = port;
      port = DEFAULT_PORT;
      break;
    case 'undefined':
      port = DEFAULT_PORT;
      break;
  }
  const { log = true } = { ...options };

  const server = fastify({ logger: log });

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

  // eslint-disable-next-line max-len
  // curl -X POST -d 'hello=world' -H'Content-type: application/x-www-form-urlencoded' http://localhost:8080/
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
