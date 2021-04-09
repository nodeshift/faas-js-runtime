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
  const { log = 'info' } = { ...options };

  const server = fastify({ logger: { level: log } });

  // All incoming requests get a Context object
  server.decorateRequest('fcontext');
  server.addHook('preHandler', (req, reply, done) => {
    req.fcontext = new Context(req, reply);
    done();
  });

  // Incoming requests to the readiness and liveness URLs
  server.register(healthCheck);

  // Incoming requests to the hosted function
  server.register(requestHandler, { func });

  server.addContentTypeParser('application/x-www-form-urlencoded',
    function(_, payload, done) {
      var body = '';
      payload.on('data', data => (body += data));
      payload.on('end', _ => {
        try {
          const parsed = qs.parse(body);
          done(null, parsed);
        } catch (e) {
          done(e);
        }
      });
      payload.on('error', done);
    });

  return new Promise((resolve, reject) => {
    server.listen(port, '0.0.0.0', err => {
      if (err) return reject(err);
      if (cb) cb(server.server);
      resolve(server.server);
    });
  });
}

module.exports = exports = start;
