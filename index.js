const qs = require('qs');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const healthCheck = require('./lib/health-check');
const requestHandler = require('./lib/request-handler');

// function context
const Context = require('./lib/context');

// HTTP framework
const fastify = require('fastify');

let LOG_LEVEL = 'warn';
const PORT = 8080;

// Invoker
function start(func, options) {
  // If there is a func.yaml file, check it for logLevel
  const funcYaml = loadFuncYaml(options && options.config);
  if (funcYaml &&
    ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']
    .find(l => funcYaml.logLevel === l)) {
    LOG_LEVEL = funcYaml.logLevel;
  }

  const { logLevel = LOG_LEVEL, port = PORT } = { ...options };

  const server = fastify({ logger: { level: logLevel } });

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
      resolve(server.server);
    });
  });
}

// reads a func.yaml file at path and returns it as a JS object
function loadFuncYaml(fileOrDirPath) {
  if (!fileOrDirPath) return;
  
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
    const maybeYaml = fs.statSync(yamlFile);
    if (maybeYaml.isFile()) {
      try {
        return yaml.load(fs.readFileSync(yamlFile, 'utf8'));
      } catch(err) {
        console.warn(err);
      }
    }
  }
}

module.exports = exports = { start, defaults: { LOG_LEVEL, PORT } };
