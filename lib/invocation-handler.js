const invoker = require('./invoker');

// Sets the HTTP endpoints for the function invocation
module.exports = function use(fastify, opts, done) {
  fastify.get('/', doGet);
  fastify.post('/', doPost);
  const invokeFunction = invoker(opts.func);

  // TODO: if we know this is a CloudEvent function, should
  // we allow GET requests?
  async function doGet(request, reply) {
    sendReply(reply, await invokeFunction(request.fcontext, reply.log));
  }

  async function doPost(request, reply) {
    sendReply(reply, await invokeFunction(request.fcontext, reply.log));
  }
  done();
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
