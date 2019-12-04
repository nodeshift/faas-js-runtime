'use strict';

const eventHandler = require('./event-handler');
const invoker = require('./invoker');

module.exports = function(fastify, opts, done) {
  const invokeFunction = invoker(opts.func);

  fastify.decorateRequest('isCloudEvent', function() {
    return this.req.headers === undefined
      ? false
      : 'ce-type' in this.req.headers;
  });

  fastify.get('/', doGet);

  fastify.post('/', doPost);

  fastify.setErrorHandler(handleError);

  async function doGet(request, reply) {
    sendReply(reply, await invokeFunction(request.context, reply.log));
  }

  async function doPost(request, reply) {
    // Cloud Events are handled with the eventHandler
    if (request.isCloudEvent()) {
      return eventHandler(request)
        .then(async _ =>
          sendReply(reply, await invokeFunction(request.context, reply.log)));
    }

    request.context.body = request.body;
    sendReply(reply, await invokeFunction(request.context, reply.log));
  }

  done();
};

function handleError(error, request, reply) {
  if (request && request.isCloudEvent()) {
    // TODO: Add error to cloud event response
    reply.code(500).send(error);
  } else {
    // Just send a normal HTTP erorr response
    const code = error.code ? error.code : 500;
    reply.code(code).send(error);
  }
}

function sendReply(reply, payload) {
  if (payload.headers['Content-Type'].startsWith('text/plain')) {
    payload.response = JSON.stringify(payload.response);
  }

  return reply
    .code(payload.code)
    .headers(payload.headers)
    .send(payload.response);
}
