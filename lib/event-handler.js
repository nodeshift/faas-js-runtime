const { HTTP } = require('cloudevents');

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
    return HTTP.isEvent(this);
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
