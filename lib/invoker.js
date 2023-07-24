/**
 * The invoker module is responsible for invoking the user function.
 */
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

    let fnReturn;
    const scope = Object.freeze({});
    try {
      if (context.cloudevent) {
        // Invoke the function with the context and the CloudEvent
        fnReturn = await func.bind(scope)(context, context.cloudevent);

        // If the response is a CloudEvent, we need to convert it
        // to a Message first and respond with the headers/body
        if (fnReturn instanceof CloudEvent || fnReturn.constructor?.name === 'CloudEvent') {
          try {
            const message = HTTP.binary(fnReturn);
            payload.headers = {...payload.headers, ...message.headers};
            payload.response = message.body;
            // In this case, where the function is invoked with a CloudEvent
            // and returns a CloudEvent we don't need to continue processing the
            // response. Just return it using the HTTP.binary format.
            return payload;
          } catch (err) {
            return handleError(err, log);
          }
        }
      } else {
        // It's an HTTP function - extract the request body
        let body = context.body;
        if (context.contentType === 'application/json' && typeof body === 'string') {
          try {
            body = JSON.parse(body);
          } catch (err) {
            console.error('Error parsing JSON body', err);
          }
        }
        // Invoke with context and the raw body
        fnReturn = await func.bind(scope)(context, body);
      }
    } catch (err) {
      return handleError(err, log);
    }

    // Raw HTTP functions, and CloudEvent functions that return something
    // other than a CloudEvent, will end up here.

    // Return 204 No Content if the function returns
    // null, undefined or empty string
    if (!fnReturn) {
      payload.headers['content-type'] = 'text/plain';
      payload.code = 204;
      payload.response = '';
      return payload;
    }

    // If the function returns a string, set the content type to text/plain
    // and return it as the response
    if (typeof fnReturn === 'string') {
      payload.headers['content-type'] = 'text/plain; charset=utf8';
      payload.response = fnReturn;
      return payload;
    }

    // The function returned an object or an array, check for
    // user defined headers or datacontenttype
    if (typeof fnReturn?.headers === 'object') {
      const headers = {};
      // normalize the headers as lowercase
      for (const header in fnReturn.headers) {
        headers[header.toLocaleLowerCase()] = fnReturn.headers[header];
      }
      payload.headers = { ...payload.headers, ...headers };
    }

    // Check for user defined status code
    if (fnReturn.statusCode) {
      payload.code = fnReturn.statusCode;
    }

    // Check for user supplied body
    if (fnReturn.body !== undefined) {
      // Provide default content-type unless supplied by user
      if (!fnReturn.headers) {
        if (typeof fnReturn.body === 'string') {
          payload.headers['content-type'] = 'text/plain; charset=utf8';
        } else if (typeof fnReturn.body === 'object') {
          payload.headers['content-type'] = 'application/json; charset=utf8';
        }
      }
      payload.response = fnReturn.body;
    } else if (typeof fnReturn === 'object' && !fnReturn?.body) {
      // Finally, the user may have supplied a simple object response
      payload.headers['content-type'] = 'application/json; charset=utf8';
      payload.response = fnReturn;
    }
    return payload;
  };
};

function handleError(err, log) {
  log.error('Error processing user function', err);
  return {
    code: err.code ? err.code : 500,
    response: err.message
  };
}
