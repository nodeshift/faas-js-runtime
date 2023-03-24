const qs = require('qs');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const requestHandler = require('./lib/request-handler');
const eventHandler = require('./lib/event-handler');
const Context = require('./lib/context');

// HTTP framework
const fastify = require('fastify');

const LOG_LEVEL = 'warn';
const PORT = 8080;

async function start(func, options) {
  options = options || {};
  if (typeof func === 'function') {
    return __start(func, options);
  }
  if (typeof func.handle !== 'function') {
    throw new TypeError('Function must export a handle function');
  }
  if (typeof func.init === 'function') {
    func.init();
  }
  if (typeof func.shutdown === 'function') {
    options.shutdown = func.shutdown;
  }
  if (typeof func.liveness === 'function') {
    options.liveness = func.liveness;
  }
  if (typeof func.readiness === 'function') {
    options.readiness = func.readiness;
  }
  return __start(func.handle, options);
}

// Invoker
async function __start(func, options) {
  // Load a func.yaml file if it exists
  const config = loadConfig(options);

  // Create and configure the server for the default behavior
  const server = initializeServer(config);

  // Configures the server to handle incoming requests to the function itself,
  // and also to other endpoints such as telemetry and liveness/readiness
  requestHandler(server, { func, funcConfig: config });

  // Start the server
  return new Promise((resolve, reject) => {
    server.listen({
      port: options.port,
      host: '::'
    },
    err => { // callback function
      if (err) return reject(err);
      // If the function exports a shutdown function add it as a listener
      if (typeof options.shutdown !== 'function') {
        options.shutdown = _ => {};
      }
      server.server.on('close', options.shutdown);
      resolve(server.server);
    });
  });
}

function initializeServer(config) {
  const server = fastify({
    logger: {
      level: config.logLevel,
      formatters: {
        bindings: bindings => ({
            pid: bindings.pid,
            hostname: bindings.hostname,
            node_version: process.version
        })
      }
    }
  });

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

  server.addContentTypeParser('*', { parseAs: 'buffer' }, function(req, body, done) {
    try {
      done(null, body);
    } catch (err) {
      err.statusCode = 500;
      done(err, undefined);
    }
  });

  // Initialize the invocation context
  // This is passed as a parameter to the function when it's invoked
  server.decorateRequest('fcontext');
  server.addHook('preHandler', (req, reply, done) => {
    req.fcontext = new Context(req);
    done();
  });

  // Evaluates the incoming request, parsing any CloudEvents and attaching
  // to the request's `fcontext`
  eventHandler(server);

  return server;
}

/**
 * loadConfig() loads a func.yaml file if it exists, allowing it to take precedence over the default options
 *
 * @param {Object} options Server options
 * @param {String} options.config Path to a func.yaml file
 * @param {String} options.logLevel Log level - one of 'fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'
 * @param {number} options.port Port to listen on
 * @returns {Object} Configuration object
 */
function loadConfig(options) {
  return { ...options, ...readFuncYaml(options.config) };
}

// reads a func.yaml file at path and returns it as a JS object
function readFuncYaml(fileOrDirPath) {
  if (!fileOrDirPath) fileOrDirPath = './';

  let baseDir;
  let maybeDir = fs.statSync(fileOrDirPath);
  if (maybeDir.isDirectory()) {
    baseDir = fileOrDirPath;
  } else {
    maybeDir = fs.statSync(path.dirname(fileOrDirPath));
    if (maybeDir.isDirectory()) {
      baseDir = fileOrDirPath;
    }
  }

  if (baseDir) {
    const yamlFile = path.join(baseDir, 'func.yaml');
    const maybeYaml = fs.statSync(yamlFile, { throwIfNoEntry: false });
    if (!!maybeYaml && maybeYaml.isFile()) {
      try {
        return yaml.load(fs.readFileSync(yamlFile, 'utf8'));
      } catch(err) {
        console.warn(err);
      }
    }
  }
}

module.exports = exports = { start, defaults: { LOG_LEVEL, PORT } };
