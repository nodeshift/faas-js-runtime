'use strict';

const protection = require('overload-protection');

// Default LIVENESS/READINESS urls
const READINESS_URL = '/health/readiness';
const LIVENESS_URL = '/health/liveness';

// Configure protect for liveness/readiness probes
const protectCfg = {
  production: process.env.NODE_ENV === 'production',
  maxHeapUsedBytes: 0, // Max heap used threshold (0 to disable) [default 0]
  maxRssBytes: 0, // Max rss size threshold (0 to disable) [default 0]
  errorPropagationMode: false // Don't propagate error
};

const readinessURL = process.env.READINESS_URL || READINESS_URL;
const livenessURL = process.env.LIVENESS_URL || LIVENESS_URL;
const protect = protection('http', protectCfg);

module.exports = function(fastify, options, done) {
  fastify.get(readinessURL, (request, reply) => {
    reply.header('Content-Type', 'text/plain; charset=utf8');
    protect(request, reply, _ => reply.send('OK'));
  });
  fastify.get(livenessURL, (request, reply) => {
    reply.header('Content-Type', 'text/plain; charset=utf8');
    protect(request, reply, _ => reply.send('OK'));
  });
  done();
};
