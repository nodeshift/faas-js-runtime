const qs = require('qs');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const requestHandler = require('./lib/request-handler');
const eventHandler = require('./lib/event-handler');
const Context = require('./lib/context');
const shutdown = require('death')({ uncaughtException: true });
const fastifyRawBody = require('fastify-raw-body');
const { isPromise } = require('./lib/utils');

// HTTP framework
const fastify = require('fastify');

// Default log level
const LOG_LEVEL = 'warn';

// Default port
const PORT = 8080;

// Don't Include Raw body by default
const INCLUDE_RAW = false;

/**
 * Starts the provided Function. If the function is a module, it will be
 * inspected for init, shutdown, cors, liveness, and readiness functions and those
 * will be used to configure the server. If it's a function, it will be used
 * directly.
 *
 * @param {Object | function} func The function to start (see the Function type)
 * @param {*} options Options to configure the server
 * @param {string} options.logLevel The log level to use
 * @param {number} options.port The port to listen on
 * @returns {Promise<http.Server>} The server that was started
 */
async function start(func, options) {
  options = options || {};
  if (typeof func === 'function') {
    return __start(func, options);
  }
  if (typeof func.handle !== 'function') {
    throw new TypeError('Function must export a handle function');
  }
  if (typeof func.init === 'function') {
    const initRet = func.init();
    if (isPromise(initRet)) {
      await initRet;
    }
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
  if (typeof func.cors === 'function') {
    options.cors = func.cors;
  }
  return __start(func.handle, options);
}

/**
 * Internal function to start the server. This is used by the start function.
 *
 * @param {function} func - The function to start
 * @param {*} options - Options to configure the server
 * @param {string} options.logLevel - The log level to use
 * @param {number} options.port - The port to listen on
 * @returns {Promise<http.Server>} The server that was started
 */
async function __start(func, options) {
  // Load a func.yaml file if it exists
  const config = loadConfig(options);

  // Create and configure the server for the default behavior
  const server = initializeServer(config);

  // Configures the server to handle incoming requests to the function itself,
  // and also to other endpoints such as telemetry and liveness/readiness
  requestHandler(server, { func, funcConfig: config });

  // Start the server
  try {
    await server.listen({
      port: config.port,
      host: '::',
    });
    return server.server;
  } catch (err) {
    console.error('Error starting server', err);
    process.exit(1);
  }
}

/**
 * Creates and configures the HTTP server to handle incoming CloudEvents,
 * and initializes the Context object.
 * @param {Config} config - The configuration object for port and logLevel
 * @returns {FastifyInstance} The Fastify server that was created
 */
function initializeServer(config) {
  const server = fastify({
    logger: {
      level: config.logLevel,
      formatters: {
        bindings: bindings => ({
          pid: bindings.pid,
          hostname: bindings.hostname,
          node_version: process.version,
        }),
      },
    },
  });

  if (config.includeRaw) {
    server.register(fastifyRawBody, {
      field: 'rawBody',
      global: true,
      encoding: 'utf8',
      runFirst: false,
    });
  }

  // Give the Function an opportunity to clean up before the process exits
  shutdown(async _ => {
    if (typeof config.shutdown === 'function') {
      const shutdownRet = config.shutdown();
      if (isPromise(shutdownRet)) {
        await shutdownRet;
      }
    }
    server.close();
    process.exit(0);
  });

  // Add a parser for application/x-www-form-urlencoded
  server.addContentTypeParser(
    'application/x-www-form-urlencoded',
    function (_, payload, done) {
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
    }
  );

  // Add a parser for everything else - parse it as a buffer and
  // let this framework's router handle it
  server.addContentTypeParser(
    '*',
    { parseAs: 'buffer' },
    function (req, body, done) {
      try {
        done(null, body);
      } catch (err) {
        err.statusCode = 500;
        done(err, undefined);
      }
    }
  );

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
 * @returns {Config} Configuration object
 */
function loadConfig(options) {
  const opts = { ...options, ...readFuncYaml(options.config) };
  opts.logLevel = opts.logLevel || LOG_LEVEL;
  opts.port = opts.port || PORT;
  opts.includeRaw = opts.includeRaw || INCLUDE_RAW;
  return opts;
}

/**
 * Reads a func.yaml file at path and returns it as a JS object
 * @param {string} fileOrDirPath - the path to the func.yaml file or the directory containing it
 * @returns {object} the parsed func.yaml file
 */
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
      } catch (err) {
        console.warn(err);
      }
    }
  }
}

module.exports = exports = {
  start,
  defaults: { LOG_LEVEL, PORT, INCLUDE_RAW },
};
