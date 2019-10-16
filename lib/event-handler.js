'use strict';

const cldeventsv02 = require('cloudevents-sdk/v02');
const cldeventsv03 = require('cloudevents-sdk/v03');

async function eventHandler(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');

    req.on('data', chunk => {
      data += chunk;
      if (data.length === parseInt(req.headers['content-length'], 10)) {
        // Event 'end' is not emmited at the end of every request,
        // we have to do that explicitly
        req.emit('end');
      }
    });

    req.on('end', _ => {
      let unmarshaller;
      const version = req.headers['ce-specversion'];
      if (version === '0.2') {
        unmarshaller = new cldeventsv02.HTTPUnmarshaller();
      } else if (version === '0.3') {
        unmarshaller = new cldeventsv03.HTTPUnmarshaller();
      } else {
        reject(new Error(`Unknown cloud event version detected: ${version}`));
        return;
      }

      unmarshaller.unmarshall(data, req.headers)
        .then(cldevent => {
          resolve(cldevent.format());
        }).catch(err => {
          reject(err);
        });
    });
  });
}

module.exports = exports = eventHandler;
