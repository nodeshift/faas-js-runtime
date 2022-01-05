const qs = require('qs');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const requestHandler = require('./lib/request-handler');
const eventHandler = require('./lib/event-handler');
const Context = require('./lib/context');

// HTTP framework
const fastify = require('fastify');

let LOG_LEVEL = 'warn';
const PORT = 8080;

// Invoker
function start(func, options) {
  options = options || {};

  // Load a func.yaml file if it exists
  const funcConfig = loadFuncYaml(options.config) || {};

  // Set the log level
  if (['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']
    .find(l => funcConfig.logLevel === l)) {
    LOG_LEVEL = funcConfig.logLevel;
  }

  // Create the server
  const { logLevel = LOG_LEVEL, port = PORT } = { ...options };
  const server = fastify({ logger: { level: logLevel } });

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

  // Initialize the invocation context
  // This is passed as a parameter to the function when it's invoked
  server.decorateRequest('fcontext');
  server.addHook('preHandler', (req, reply, done) => {
    req.fcontext = new Context(req, reply);
    done();
  });

  // Evaluates the incoming request, parsing any CloudEvents and attaching
  // to the request's `fcontext`
  eventHandler(server);

  // Configures the server to handle incoming requests to the function itself,
  // and also to other endpoints such as telemetry and liveness/readiness
  requestHandler(server, { func, funcConfig });

  return new Promise((resolve, reject) => {
    server.listen(port, '0.0.0.0', err => {
      if (err) return reject(err);
      resolve(server.server);
    });
  });
}

// reads a func.yaml file at path and returns it as a JS object
function loadFuncYaml(fileOrDirPath) {
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
