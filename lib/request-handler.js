'use strict';
const healthCheck = require('./health-check');
const invocationHandler = require('./invocation-handler');
const metrics = require('./metrics');

const METRICS_URL = '/metrics';
const metricsURL = process.env.METRICS_URL || METRICS_URL;

// Registers the root endpoint to respond to the user function
module.exports = function use(server, opts) {
  // Handle function invocation
  let metricsHandler;
  server.register(function invocationContext(s, _, done) {
    s.register(invocationHandler, opts);
    // Initialize the metrics handler in this context
    // but register it in its own context
    metricsHandler = metrics(opts.funcConfig)(s);
    done();
  });

  // Gather telemetry and metrics for the function
  // using the handler initialized above. Register the
  // metrics URL and handler on a different context
  // so that telemetry is not measured for calls to
  // the metrics URL itself.
  server.register(function metricContext(s, _, done) {
    s.get(metricsURL, { logLevel: 'warn' }, metricsHandler);
    done();
  });

  // Handle health checks
  server.register(function healthCheckContext(s, _, done) {
    s.register(healthCheck(opts.funcConfig));
    done();
  });
};

