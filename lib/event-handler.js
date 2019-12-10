'use strict';

const v02 = require('cloudevents-sdk/v02');
const v03 = require('cloudevents-sdk/v03');
const v1 = require('cloudevents-sdk/v1');

const v02Unmarshaller = new v02.HTTPUnmarshaller();
const v03Unmarshaller = new v03.HTTPUnmarshaller();
const v1BinaryReceiver = new v1.BinaryHTTPReceiver();

function use(fastify) {
  fastify.decorateRequest('isCloudEvent', function() {
    return this.req.headers === undefined
      ? false
      : 'ce-type' in this.req.headers;
  });

  // Any incoming requests for cloud events will only be
  // processed if it's a cloud event spec version we know about
  fastify.addHook('preHandler', async(request, reply) => {
    if (request.isCloudEvent()) {
      const version = request.headers['ce-specversion'];
      if (!acceptsVersion(version)) {
        reply.code(406);
        const error = new Error(
          `Unsupported cloud event version detected: ${version}`);
        error.code = 406;
        throw error;
      } else {
        await unmarshallEvent(request);
      }
    }
  });
}

async function unmarshallEvent(request) {
  const version = request.headers['ce-specversion'];
  if (version === '0.2') {
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
