osu = require('node-os-utils');

const { randomUUID } = require('crypto');
const {
  Registry,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} = require('prom-client');

const { cpu, mem, netstat } = osu;

module.exports = function configure(config) {
  // eslint-disable-next-line max-len
  // See: https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/faas.md
  const labels = {
    faas_name:
      config.name ||
      process.env.FAAS_NAME ||
      process.env.K_SERVICE ||
      'anonymous',
    faas_id:
      config.id ||
      process.env.FAAS_ID ||
      `${process.env.POD_NAME}-${randomUUID()}`,
    faas_instance:
      config.instance || process.env.FAAS_INSTANCE || process.env.POD_NAME,
    faas_version:
      config.version || process.env.FAAS_VERSION || process.env.K_REVISION,
    faas_runtime: config.runtime || process.env.FAAS_RUNTIME || 'Node.js',
  };

  // Create a metrics register and add our identifying labels to it
  const register = new Registry();
  register.setDefaultLabels(labels);
  collectDefaultMetrics({ register });

  // invoked on GET to /metrics
  async function callMetrics(req, res) {
    try {
      res.headers('Content-Type', register.contentType);
      res.send(await register.metrics());
    } catch (ex) {
      res.code(500).send(ex);
    }
  }

  const invocations = new Counter({
    name: 'faas_invocations',
    help: 'The number of times this function was invoked',
    registers: [register],
  });

  const execLatency = new Histogram({
    name: 'faas_execution_latency',
    help: 'The time it took for this function to be invoked and return',
    registers: [register],
  });

  const errors = new Counter({
    name: 'faas_errors',
    help: 'The number of function invocation failures',
    registers: [register],
  });

  const coldStartLatency = new Histogram({
    name: 'faas_cold_start_latency',
    help: 'The time it took for this function to be in the ready state after the container started',
    registers: [register],
  });

  const queueLatency = new Histogram({
    name: 'faas_queue_latency',
    help: 'The time spent in a system queue before the function was invoked',
    registers: [register],
  });

  new Gauge({
    name: 'faas_cpu_utilization',
    help: 'The CPU utilization of this function instance',
    collect() {
      cpu
        .usage()
        .then((usage) => {
          if (supported(usage)) {
            this.set(usage);
          }
        })
        .catch(console.error);
    },
    registers: [register],
  });

  new Gauge({
    name: 'faas_mem_utilization',
    help: 'The memory utilization of this function instance',
    collect() {
      mem
        .used()
        .then((used) => {
          if (supported(used)) {
            this.set(used.usedMemMb);
          }
        })
        .catch(console.error);
    },
    registers: [register],
  });

  new Gauge({
    name: 'faas_netio_utilization',
    help: 'The network I/O utilization of this function instance',
    collect() {
      netstat
        .inOut()
        .then((io) => {
          if (supported(io)) {
            this.set(io.total.inputMb + io.total.outputMb);
          }
        })
        .catch(console.error);
    },
    registers: [register],
    labels,
  });

  return function handler(fastify) {
    // Each request has its own pair of timers
    fastify.decorateRequest('queueTimer');
    fastify.decorateRequest('execTimer');

    // When the server is fully ready, set the
    // cold start latency to our total uptime
    fastify.addHook('onReady', (done) => {
      coldStartLatency.observe(process.uptime());
      done();
    });

    // On each request, increment the invocation count
    // and start the queueLatency timer
    fastify.addHook('onRequest', (req, rep, done) => {
      invocations.inc();
      req.queueTimer = queueLatency.startTimer();
      done();
    });

    // Just before the endpoint's handler is called (i.e.
    // the function is invoked), stop the queueTimer and
    // start the execution latency timer
    fastify.addHook('preHandler', (req, res, done) => {
      req.queueTimer();
      req.execTimer = execLatency.startTimer();
      done();
    });

    // When the response is sent, stop the execution timer
    fastify.addHook('onResponse', (req, res, done) => {
      req.execTimer();
      done();
    });

    // If there is an error, count it
    fastify.addHook('onError', (req, res, done) => {
      errors.inc();
      done();
    });

    // Return the endpoint handler so that the caller
    // can add it to the appropriate invocation context
    return callMetrics;
  };
};

// Utility function to determine if a given metric
// is not supported
function supported(metric) {
  return !osu.isNotSupported(metric);
}
