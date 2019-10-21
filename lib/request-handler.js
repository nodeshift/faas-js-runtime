'use strict';

const eventHandler = require('./event-handler');

module.exports = function(fastify, opts, done) {
  fastify.get('/', async(request, reply) => sendReply(reply, request.context));

  fastify.post('/', async(request, reply) => {
    if ('ce-type' in request.headers) {
      // we are receiving a cloud event
      return eventHandler(request)
        .then(_ => sendReply(reply, request.context));
    }
    request.context.body = request.body;
    return sendReply(reply, request.context);
  });

  async function sendReply(reply, context) {
    const message = await opts.func(context);
    return reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf8')
      .send({ message });
  }

  done();
};
