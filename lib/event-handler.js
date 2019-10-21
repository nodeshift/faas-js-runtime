'use strict';

const v02 = require('cloudevents-sdk/v02');
const v03 = require('cloudevents-sdk/v03');

async function eventHandler(request) {
  let unmarshaller;
  const version = request.headers['ce-specversion'];
  if (version === '0.2') {
    unmarshaller = new v02.HTTPUnmarshaller();
  } else if (version === '0.3') {
    unmarshaller = new v03.HTTPUnmarshaller();
  } else {
    // eslint-disable-next-line
    request.context.message = `Unknown cloud event version detected: ${version}`;
    request.context.error = new Error(request.context.message);
    return Promise.reject(request.context.error);
  }

  return unmarshaller.unmarshall(request.body, request.headers)
    .then(cloudevent => (request.context.cloudevent = cloudevent.format()));
}

module.exports = exports = eventHandler;
