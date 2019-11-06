'use strict';

const eventHandler = require('./event-handler');

module.exports = function(fastify, opts, done) {
  fastify.decorateRequest('isCloudEvent', function() {
    return this.req.headers === undefined
      ? false
      : 'ce-type' in this.req.headers;
  });

  fastify.get('/', async(request, reply) =>
    sendReply(reply, await invokeFunction(request.context))
  );

  fastify.post('/', async(request, reply) => {
    // Cloud Events are handled with the eventHandler
    if (request.isCloudEvent()) {
      return eventHandler(request)
        .then(async _ =>
          sendReply(reply, await invokeFunction(request.context)));
    }

    request.context.body = request.body;
    sendReply(reply, await invokeFunction(request.context));
  });

  async function invokeFunction(context) {
    let payload = await opts.func(context);
    if (!payload) payload = { code: 204 };
    if (typeof payload !== 'object') payload = { payload };
    return payload;
  }

  function sendReply(reply, payload) {
    const code = payload.code ? payload.code : 200;

    const headers = {
      'Content-Type': 'application/json; charset=utf8',
      'Access-Control-Allow-Methods':
        'OPTIONS, GET, DELETE, POST, PUT, HEAD, PATCH',
      'Access-Control-Allow-Origin': '*'
    };

    if (typeof payload.headers === 'object') {
      Object.assign(headers, payload.headers);
    }

    return reply
      .code(code)
      .headers(headers)
      .send(payload);
  }

  fastify.setErrorHandler((error, request, reply) => {
    if (request && request.isCloudEvent()) {
      // TODO: Add error to cloud event response
      reply.code(500).send(error);
    } else {
      // Just send a normal HTTP erorr response
      reply.code(500).send(error);
    }
  });

  done();
};
