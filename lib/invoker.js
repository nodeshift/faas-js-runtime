'use strict';
const { CloudEvent, HTTP } = require('cloudevents');

module.exports = function invoker(func) {
  return async function invokeFunction(context, log) {
    // Default payload values
    const payload = {
      code: 200,
      response: undefined,
      headers: {
        'content-type': 'application/json; charset=utf8',
        'access-control-allow-methods':
          'OPTIONS, GET, DELETE, POST, PUT, HEAD, PATCH',
        'access-control-allow-origin': '*'
      }
    };

    const scope = Object.freeze({});
    try {
      if (context.cloudevent) {
        // If there is a cloud event, provide the data
        // as the first parameter
        payload.response = await func.bind(scope)(context, context.cloudevent);
      } else {
        // Invoke with context
        // TODO: Should this actually just get the Node.js request object?
        payload.response = await func.bind(scope)(context);
      }
    } catch (err) {
      payload.response = handleError(err, log);
    }

    // Return 204 No Content if the function returns
    // null, undefined or empty string
    if (!payload.response) {
      payload.code = 204;
      return payload;
    }

    // Check for user defined headers
    if (typeof payload.response.headers === 'object') {
      const headers = {};
      // normalize the headers as lowercase
      for (const header in payload.response.headers) {
        headers[header.toLocaleLowerCase()] = payload.response.headers[header];
      }
      payload.headers = { ...payload.headers, ...headers };
      delete payload.response.headers;
    }

    // If the response is a CloudEvent, we need to convert it
    // to a Message first and respond with the headers/body
    if (payload.response instanceof CloudEvent) {
      try {
        const message = HTTP.binary(payload.response);
        payload.headers = {...payload.headers, ...message.headers};
        payload.response = message.body;  
      } catch (err) {
        payload.response = handleError(err, log);
        return payload;
      }
    }

    // Check for user defined status code
    if (payload.response.statusCode) {
      payload.code = payload.response.statusCode;
      delete payload.response.statusCode;
    }

    // Check for user supplied body
    if (payload.response.body !== undefined) {
      payload.response = payload.response.body;
      delete payload.response.body;
    }
    return payload;
  };
};

function handleError(err, log) {
  log.error(err);
  return {
    statusCode: err.code ? err.code : 500,
    statusMessage: err.message
  };
}
