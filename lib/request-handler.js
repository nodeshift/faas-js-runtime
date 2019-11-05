'use strict';

const eventHandler = require('./event-handler');

module.exports = function(fastify, opts, done) {
  fastify.decorateRequest('isCloudEvent', function() {
    return this.req.headers === undefined
      ? false
      : 'ce-type' in this.req.headers;
  });

  fastify.get('/', async(request, reply) =>
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf8')
      .send(await invokeFunction(request.context))
  );

  fastify.post('/', async(request, reply) => {
    if (request.isCloudEvent()) {
      return eventHandler(request)
        .then(async _ =>
          reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf8')
            .send(await invokeFunction(request.context)));
    }

    request.context.body = request.body;
    return reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf8')
      .send(await invokeFunction(request.context));
  });

  async function invokeFunction(context) {
    let payload = await opts.func(context);
    if (typeof payload !== 'object') payload = { payload };
    return payload;
  }

  fastify.setErrorHandler((error, request, reply) => {
    if (request && request.isCloudEvent()) {
      // Add error to cloud event response
    } else {
      // Just send a normal HTTP erorr response
      reply.code(500).send(error);
    }
  });

  done();
};
