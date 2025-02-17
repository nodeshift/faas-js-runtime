const { start } = require('..');
const test = require('tape');
const request = require('supertest');

const errHandler = t => err => {
    t.error(err);
    t.end();
};

test('Provides HTTP POST string as string parameter', t => {
  const body = 'This is a string';
  t.plan(2);
  start((context, receivedBody) => {
    t.equal(receivedBody, body);
    return receivedBody;
  })
  .then(server => {
    request(server)
      .post('/')
      .send(body)
      .set({'Content-Type': 'text/plain'})
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST string as string parameter and rawBody', t => {
  const body = 'This is a string';
  t.plan(3);
  start((context, receivedBody) => {
    t.equal(receivedBody, body);
    t.equal(context.rawBody, body);
    return receivedBody;
  }, {includeRaw: true})
  .then(server => {
    request(server)
      .post('/')
      .send(body)
      .set({'Content-Type': 'text/plain'})
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST JSON as object parameter', t => {
  const body = '{"lunch": "pizza"}';
  t.plan(2);
  start((context, receivedBody) => {
    t.deepEqual(receivedBody, JSON.parse(body));
    return receivedBody;
  })
  .then(server => {
    request(server)
      .post('/')
      .send(body)
      .set({'Content-Type': 'application/json'})
      .expect('Content-Type', /json/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST JSON as object parameter with correct rawBody', t => {
  const body = '{"lunch": "pizza"}';
  t.plan(3);
  start((context, receivedBody) => {
    t.deepEqual(receivedBody, JSON.parse(body));
    t.equal(context.rawBody, body);
    return receivedBody;
  }, {includeRaw: true})
  .then(server => {
    request(server)
      .post('/')
      .send(body)
      .set({'Content-Type': 'application/json'})
      .expect('Content-Type', /json/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST empty body as empty string parameter', t => {
  const body = '';
  t.plan(2);
  start((context, receivedBody) => {
    t.deepEqual(receivedBody, body);
    return receivedBody;
  })
  .then(server => {
    request(server)
      .post('/')
      .send(body)
      .set({'Content-Type': 'text/plain'})
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST empty body as empty string parameter and rawBody', t => {
  const body = '';
  t.plan(3);
  start((context, receivedBody) => {
    t.equal(receivedBody, body);
    t.equal(context.rawBody, body);
    return receivedBody;
  }, {includeRaw: true})
  .then(server => {
    request(server)
      .post('/')
      .send(body)
      .set({'Content-Type': 'text/plain'})
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Rejects HTTP POST exceeding bodyLimit', t => {
  const largeBody = 'x'.repeat(1048576 + 1);
  t.plan(2);
  start((_, receivedBody) => receivedBody, { bodyLimit: 1048576 })
    .then(server => {
      request(server)
        .post('/')
        .send(largeBody)
        .set({ 'Content-Type': 'text/plain' })
        .expect(413)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.status, 413, 'Should reject payload larger than limit');
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Accepts HTTP POST within bodyLimit', t => {
  const body = 'x'.repeat(1048576);
  t.plan(2);
  start((_, receivedBody) => {
    t.equal(receivedBody, body);
    return receivedBody;
  }, { bodyLimit: 1048576 })
    .then(server => {
      request(server)
        .post('/')
        .send(body)
        .set({ 'Content-Type': 'text/plain' })
        .expect('Content-Type', /plain/)
        .expect(200)
        .end((err, _) => {
          t.error(err, 'No error');
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Rejects payload exceeding environment variable bodyLimit', t => {
  const bodyLimit = 1048576;
  const largeBody = 'x'.repeat(bodyLimit + 1);
  process.env.FUNC_BODY_LIMIT = bodyLimit;
  t.plan(2);
  start((_, receivedBody) => receivedBody)
    .then(server => {
      request(server)
        .post('/')
        .send(largeBody)
        .set({ 'Content-Type': 'text/plain' })
        .expect(413)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.status, 413, 'Should reject payload larger than env var limit');
          delete process.env.FUNC_BODY_LIMIT;
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Accepts payload within environment variable bodyLimit', t => {
  const bodyLimit = 524288;
  const body = 'x'.repeat(bodyLimit);
  process.env.FUNC_BODY_LIMIT = bodyLimit;
  t.plan(2);
  start((_, receivedBody) => {
    t.equal(receivedBody, body);
    return receivedBody;
  })
    .then(server => {
      request(server)
        .post('/')
        .send(body)
        .set({ 'Content-Type': 'text/plain' })
        .expect('Content-Type', /plain/)
        .expect(200)
        .end((err, _) => {
          t.error(err, 'No error');
          delete process.env.FUNC_BODY_LIMIT;
          t.end();
          server.close();
        });
    }, errHandler(t));
});