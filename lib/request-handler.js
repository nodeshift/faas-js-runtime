'use strict';

const eventHandler = require('./event-handler');
const Context = require('./context');

function requestHandler(functionPath) {
  const func = require(functionPath);

  return function _requestHandler(req, res) {
    const context = new Context(req, res);

    if (('ce-type' in req.headers) &&
      req.headers['ce-type'].startsWith('dev.knative')) {
      eventHandler(req, res)
        .then(event => {
          context.cloudevent = event;
          res.end(func(context));
        })
        .catch(err => {
          // TODO: This should do some better error handling.
          console.error(err);
          res.end(err);
        });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const body = func(context);
      if (typeof body.then === 'function') {
        body.then(body => {
          res.end(JSON.stringify({ body }));
        });
      } else {
        res.end(JSON.stringify({ body }));
      }
    }
  };
}

module.exports = exports = requestHandler;
