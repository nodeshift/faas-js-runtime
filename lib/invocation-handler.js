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
  let _reply = reply;
  const contentType = payload.headers?.['content-type'];
  if (
    contentType?.startsWith('text/plain') &&
    typeof payload.response !== 'string'
  ) {
    payload.response = JSON.stringify(payload.response);
  }
  if (payload.code) {
    _reply = _reply.code(payload.code);
  }
  if (payload.headers) {
    _reply = _reply.headers(payload.headers);
  }
  return _reply.send(payload.response);
}
