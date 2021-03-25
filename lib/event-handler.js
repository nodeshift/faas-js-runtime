const { HTTP } = require('cloudevents');
const Spec = require('./ce-constants.js').Spec;

function use(fastify, opts, done) {
  fastify.addContentTypeParser('application/cloudevents+json',
    { parseAs: 'string' }, function(req, body, _done) {
      _done(null, body);
    });

  fastify.decorateRequest('isCloudEvent', function() {
    return isEvent(this.raw.headers);
  });

  fastify.addHook('preHandler', function(request, reply, _done) {
     if (request.isCloudEvent()) {
      try {
        request.fcontext.cloudevent = HTTP.toEvent(request);
      } catch (err) {
        if (err.message.startsWith('invalid spec version')) {
          reply.code(406);
        }
        _done(err);
      }
    }
    _done();
  });

  done();
}

function isEvent(headers) {
  return isStructuredEvent(headers) || isBinaryEvent(headers);
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
