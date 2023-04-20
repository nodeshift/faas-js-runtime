const { start } = require('..');
const test = require('tape');
const request = require('supertest');

const errHandler = t => err => {
  t.error(err);
  t.end();
};

test('Returns HTTP error code if a caught error has one', t => {
  t.plan(2);
  start(_ => {
    const error = new Error('Unavailable for Legal Reasons');
    error.code = 451;
    throw error;
  })
  .then(server => {
      request(server)
        .post('/')
        .expect(451)
        .expect('Content-type', /text/)
        .end((err, resp) => {
          t.error(err, 'No error');
          t.equal(resp.statusCode, 451, 'Status code');
          t.end();
          server.close();
        });
  }, errHandler(t));
});

test('Prints an error message when an exception is thrown', t => {
  t.plan(2);
  const func = _ => { throw new Error('This is the error message'); };
  start(func)
    .then(server => {
      request(server)
        .post('/')
        .expect(500)
        .end((err, resp) => {
          t.error(err, 'No error');
          t.equal(resp.text, 'This is the error message', 'Error message');
          t.end();
          server.close();
        });
      }, errHandler(t));
});
