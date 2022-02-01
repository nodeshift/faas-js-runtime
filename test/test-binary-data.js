'use strict';
const fs = require('fs');
const { start } = require('..');
const test = require('tape');
const request = require('supertest');
const { CloudEvent, HTTP } = require('cloudevents');

const errHandler = t => err => {
  t.error(err);
  t.end();
};

const testCases = [
  { content: 'image/png', file: `${__dirname}/fixtures/knative.png` },
  { content: 'image/jpg', file: `${__dirname}/fixtures/knative.jpg` },
  { content: 'image/gif', file: `${__dirname}/fixtures/taco.gif` },
];

for (const tc of testCases) {
  test(`Handles CloudEvents with ${tc.content} data`, t => {
    const data = fs.readFileSync(tc.file);
    const func = require(`${__dirname}/fixtures/cloud-event/binary.js`);
    const event = new CloudEvent({
      source: 'test',
      type: 'test',
      datacontenttype: tc.content,
      data
    });
  
    const message = HTTP.binary(event);
    start(func)
      .then(server => {
      request(server)
        .post('/')
        .send(message.body)
        .set(message.headers)
        .expect(200)
        .expect('Content-Type', tc.content)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body, data);
          t.end();
          server.close();
        });
      }, errHandler(t));
  });  
}
