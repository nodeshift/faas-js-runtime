'use strict';

const eventHandler = require('./event-handler');
const Context = require('./context');

function requestHandler(func) {
  return async function _requestHandler(req, res) {
    let responseBody;
    const context = new Context(req, res);
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if ('ce-type' in req.headers) {
      eventHandler(req, res)
        .then(async event => {
          context.cloudevent = event;
          responseBody = await func(context);
          res.end(JSON.stringify({ message: responseBody }));
        })
        .catch(err => {
          // TODO: This should do some better error handling.
          console.error(err);
          res.end(err);
        });
    } else {
      responseBody = await func(context);
      res.end(JSON.stringify({ message: responseBody }));
    }
  };
}

module.exports = exports = requestHandler;
