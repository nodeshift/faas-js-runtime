const { HTTPReceiver } = require('cloudevents-sdk');
const Spec = require('./ce-constants.js').Spec;

const receiver = new HTTPReceiver();

function use(fastify, opts, done) {
  fastify.addContentTypeParser('application/cloudevents+json',
    { parseAs: 'string' }, function(req, body, done) {
      done(null, body);
    });

  fastify.decorateRequest('isCloudEvent', function() {
    return isBinaryEvent(this.req.headers) || isStructuredEvent(this.req.headers);
  });

  fastify.addHook('preHandler', function(request, reply, done) {
    if (request.isCloudEvent()) {
      try {
        const event = receiver.accept(request.headers, request.body);
        request.context.cloudevent = event.format();
      } catch (err) {
        if (err.message === 'invalid spec version') {
          reply.code(406);
        }
        done(err);
      }
    }
    done();
  });

  done();
}

function isStructuredEvent(headers) {
  const contentType = headers['content-type'];
  const cloudEventType = escapeRegExp(Spec.ceJsonContentType);
  return contentType && contentType.match(new RegExp(cloudEventType));
}

function isBinaryEvent(headers) {
  return Spec.id in headers;
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

module.exports = exports = use;
