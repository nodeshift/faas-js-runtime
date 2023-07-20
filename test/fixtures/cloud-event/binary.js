const { CloudEvent } = require('cloudevents');

module.exports = function (context, event) {
  return new CloudEvent({
    source: 'image-func',
    type: 'response',
    datacontenttype: event.datacontenttype,
    data: event.data,
  });
};
