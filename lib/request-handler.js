'use strict';

const eventHandler = require('./event-handler');
const invoker = require('./invoker');

module.exports = function(fastify, opts, done) {
  const invokeFunction = invoker(opts.func);

  fastify.get('/', doGet);

  fastify.post('/', doPost);

  async function doGet(request, reply) {
    sendReply(reply, await invokeFunction(request.fcontext, reply.log));
  }

  async function doPost(request, reply) {
    sendReply(reply, await invokeFunction(request.fcontext, reply.log));
  }

  eventHandler(fastify, null, done);
};

function sendReply(reply, payload) {
  const contentType = payload.headers['content-type'];
  if (contentType.startsWith('text/plain') && (typeof payload.response !== 'string')) {
    payload.response = JSON.stringify(payload.response);
  }
  return reply
    .code(payload.code)
    .headers(payload.headers)
    .send(payload.response);
}
