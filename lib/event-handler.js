const { HTTP } = require('cloudevents');
const Spec = require('./ce-constants.js').Spec;

// Adds a content type parser for cloudevents, decorates
// the request object with an isCloudEvent() function, and
// parses any CloudEvent that is part of the request,
// attaching it to the request's fcontext.
module.exports = exports = function use(fastify) {
  fastify.addContentTypeParser('application/cloudevents+json',
    { parseAs: 'string' }, function(req, body, done) {
      done(null, body);
    });

  fastify.decorateRequest('isCloudEvent', function() {
    return isEvent(this.raw.headers);
  });

  fastify.addHook('preHandler', function(request, reply, done) {
    if (request.isCloudEvent()) {
      try {
        request.fcontext.cloudevent = HTTP.toEvent(request);
        request.fcontext.cloudevent.validate();
      } catch (err) {
        if (err.message.startsWith('invalid spec version')) {
          reply.code(406);
        }
        done(err);
      }
    }
    done();
  });
};

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
