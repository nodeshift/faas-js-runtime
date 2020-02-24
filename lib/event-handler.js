'use strict';

const v02 = require('cloudevents-sdk/v02');
const v03 = require('cloudevents-sdk/v03');
const v1 = require('cloudevents-sdk/v1');
const Spec = require('./ce-constants.js').Spec;

const v02Unmarshaller = new v02.HTTPUnmarshaller();
const v03Unmarshaller = new v03.HTTPUnmarshaller();
const v1BinaryReceiver = new v1.BinaryHTTPReceiver();
const v1StructuredReceiver = new v1.StructuredHTTPReceiver();

function use(fastify, opts, done) {
  fastify.addContentTypeParser('application/cloudevents+json',
    { parseAs: 'string' },
    function(req, body, done) {
      // unmarshallEvent() handles parsing
      done(null, body);
    });

  fastify.decorateRequest('isCloudEvent', function() {
    if (Spec.type in this.req.headers) {
      return true;
    } else {
      const contentType = this.req.headers['content-type'];
      if (contentType && contentType.match(/application\/cloudevents/)) {
        return true;
      }
    }
    return false;
  });

  // Any incoming requests for cloud events will only be
  // processed if it's a cloud event spec version we know about
  fastify.addHook('preHandler', async(request, reply) => {
    if (request.isCloudEvent()) {
      const version = request.headers[Spec.version];
      // if there is no version in the headers, it is a
      // structured event
      if (version && !acceptsVersion(version)) {
        reply.code(406);
        const error = new Error(
          `Unsupported cloud event version detected: ${version}`);
        error.code = 406;
        throw error;
      } else {
        try {
          await unmarshallEvent(request);
        } catch (err) {
          throw new Error(err.message || 'failed to unmarshall cloud event');
        }
      }
    }
  });

  done();
}

async function unmarshallEvent(request) {
  const version = request.headers[Spec.version];
  if (!version) {
    // it's a structured event and the version is in the body
    // currently only v1 structured events are supported
    try {
      const event = v1StructuredReceiver.parse(request.body, request.headers);
      request.context.cloudevent = event.format();
    } catch (err) {
      return Promise.reject(err);
    }
  } else if (version === '0.2') {
    return v02Unmarshaller.unmarshall(request.body, request.headers)
      .then(cloudevent => (request.context.cloudevent = cloudevent.format()));
  } else if (version === '0.3') {
    return v03Unmarshaller.unmarshall(request.body, request.headers)
      .then(cloudevent => (request.context.cloudevent = cloudevent.format()));
  } else if (version === '1.0') {
    const event = v1BinaryReceiver.parse(request.body, request.headers);
    request.context.cloudevent = event.format();
  }
}

function acceptsVersion(version) {
  return ['0.2', '0.3', '1.0'].find(elem => version === elem) !== undefined;
}

module.exports = exports = use;
