'use strict';

const eventHandler = require('./event-handler');
let func;

module.exports = function(fastify, opts, done) {
  func = opts.func;

  fastify.decorateRequest('isCloudEvent', function() {
    return this.req.headers === undefined
      ? false
      : 'ce-type' in this.req.headers;
  });

  fastify.get('/', doGet);

  fastify.post('/', doPost);

  fastify.setErrorHandler(handleError);

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

async function invokeFunction(context, log) {
  // Default payload values
  const payload = {
    code: 200,
    response: undefined,
    headers: {
      'Content-Type': 'application/json; charset=utf8',
      'Access-Control-Allow-Methods':
        'OPTIONS, GET, DELETE, POST, PUT, HEAD, PATCH',
      'Access-Control-Allow-Origin': '*'
    }
  };

  try {
    payload.response = await func(context);
  } catch (err) {
    log.error(err);
    payload.response = {
      statusCode: err.code ? err.code : 500,
      statusMessage: err.message
    };
  }

  // Return 204 No Content if the function returns
  // null, undefined or empty string
  if (!payload.response) {
    payload.code = 204;
    return payload;
  }

  // Check for user defined status code
  if (payload.response.statusCode) {
    payload.code = payload.response.statusCode;
    delete payload.response.statusCode;
  }

  // Check for user defined headers
  if (typeof payload.response.headers === 'object') {
    Object.assign(payload.headers, payload.response.headers);
    delete payload.response.headers;
  }
  return payload;
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
