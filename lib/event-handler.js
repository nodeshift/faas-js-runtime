'use strict';

const V03Binary = require('cloudevents-sdk/lib/bindings/http/receiver_binary_0_3');
const V03Structured = require('cloudevents-sdk/lib/bindings/http/receiver_structured_0_3.js');
const V1Binary = require('cloudevents-sdk/lib/bindings/http/receiver_binary_1.js');
const V1Structured = require('cloudevents-sdk/lib/bindings/http/receiver_structured_1.js');

const Spec = require('./ce-constants.js').Spec;

const receivers = {
  v1: {
    structured: new V1Structured(),
    binary: new V1Binary()
  },
  v03: {
    structured: new V03Structured(),
    binary: new V03Binary()
  }
};

function use(fastify, opts, done) {
  fastify.addContentTypeParser('application/cloudevents+json',
    { parseAs: 'string' },
    function(req, body, done) {
      done(null, body);
    });

  fastify.decorateRequest('isCloudEvent', function() {
    if (Spec.type in this.req.headers) {
      return true;
    }
    const contentType = this.req.headers['content-type'];
    return contentType && contentType.match(/application\/cloudevents/);
  });

  // Any incoming requests for cloud events will only be
  // processed if it's a cloud event spec version we know about
  fastify.addHook('preHandler', function(request, reply, done) {
    if (request.isCloudEvent()) {
      try {
        request.context.cloudevent =
          accept(request.headers, request.body).format();
      } catch (err) {
        reply.code(406);
        done(err);
      }
    }
    done();
  });

  done();
}

function accept(headers, body) {
  const mode = getMode(headers);
  const version = getVersion(mode, headers, body);
  switch (version) {
    case '1.0':
      return receivers.v1[mode].parse(body, headers);
    case '0.3':
      return receivers.v03[mode].parse(body, headers);
    default:
      console.error(`Unknown spec version ${version}`);
      throw new TypeError(
        `Unsupported cloud event version detected: ${version}`);
  }
}

function getMode(headers) {
  let mode = 'binary';
  if (headers['content-type']) {
    if (headers['content-type'].startsWith('application/cloudevents')) {
      mode = 'structured';
    }
  }
  return mode;
}

function getVersion(mode, headers, body) {
  let version = '1.0'; // default to 1.0

  if (mode === 'binary') {
    // Check the headers for the version
    if (headers['ce-specversion']) {
      version = headers['ce-specversion'];
    }
  } else {
    // structured mode - the version is in the body
    version = typeof body === 'string'
      ? JSON.parse(body).specversion : body.specversion;
  }
  return version;
}

module.exports = exports = use;
