'use strict';

const protection = require('overload-protection');

// Default LIVENESS/READINESS urls
const READINESS_URL = '/health';
const LIVENESS_URL = '/health';

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

function healthCheck(req, res, next) {
  // Check if health path
  if (req.url === readinessURL || req.url === livenessURL) {
    return protect(req, res, () => res.end('OK'));
  }
  next(req, res);
}

module.exports = exports = healthCheck;
