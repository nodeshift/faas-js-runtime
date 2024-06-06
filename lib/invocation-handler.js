const invoker = require('./invoker');

// Sets the HTTP endpoints for the function invocation
module.exports = function use(fastify, opts, done) {
  fastify.get('/', doGet);
  fastify.post('/', doPost);
  fastify.options('/', doOptions);
  const invokeFunction = invoker(opts);

  // TODO: if we know this is a CloudEvent function, should
  // we allow GET requests?
  async function doGet(request, reply) {
    sendReply(reply, await invokeFunction(request.fcontext, reply.log));
  }

  async function doPost(request, reply) {
    sendReply(reply, await invokeFunction(request.fcontext, reply.log));
  }

  async function doOptions(_request, reply) {
    reply.code(204).headers({
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-methods': 'OPTIONS, GET, DELETE, POST, PUT, HEAD, PATCH',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*'
    }).send();
  }
  done();
};

function sendReply(reply, payload) {
  const contentType = payload.headers?.['content-type'];
  if (contentType?.startsWith('text/plain') && (typeof payload.response !== 'string')) {
    payload.response = JSON.stringify(payload.response);
  }
  if (payload.code) {
    reply = reply.code(payload.code);
  }
  if (payload.headers) {
    reply = reply.headers(payload.headers);
  }
  return reply.send(payload.response);
}
