'use strict';

const framework = require('..');
const test = require('tape');
const request = require('supertest');


test('Loads a user function with dependencies', t => {
  framework(`${__dirname}/fixtures/simple-http/`, server => {
    t.plan(2);
    request(server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body.body,
          'This is the test function for Node.js FaaS. Success.');
        t.end();
        server.close();
      });
    });
});

test('Executes an async function', t => {
  framework(`${__dirname}/fixtures/async/`, server => {
    t.plan(2);
    request(server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body.body,
          'This is the test function for Node.js FaaS. Success.');
        t.end();
        server.close();
      });
    });
});
