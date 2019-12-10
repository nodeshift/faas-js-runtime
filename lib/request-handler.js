'use strict';

const eventHandler = require('./event-handler');
const invoker = require('./invoker');

module.exports = function(fastify, opts, done) {
  const invokeFunction = invoker(opts.func);
  eventHandler(fastify);

  fastify.get('/', doGet);

  fastify.post('/', doPost);

  async function doGet(request, reply) {
    sendReply(reply, await invokeFunction(request.context, reply.log));
  }

  async function doPost(request, reply) {
    request.context.body = request.body;
    sendReply(reply, await invokeFunction(request.context, reply.log));
  }

  done();
};

function sendReply(reply, payload) {
  if (payload.headers['Content-Type'].startsWith('text/plain')) {
    payload.response = JSON.stringify(payload.response);
  }

  return reply
    .code(payload.code)
    .headers(payload.headers)
    .send(payload.response);
}
