'use strict';

module.exports = function invoker(func) {
  return async function invokeFunction(context, log) {
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
      if (context.cloudevent && context.cloudevent.data) {
        // If there is a cloud event, provide the data
        // as the first parameter
        payload.response = await func(context.cloudevent.data, context);
      } else {
        // Invoke with context
        // TODO: Should this actually just get the Node.js request object?
        payload.response = await func(context);
      }
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
  };
};
