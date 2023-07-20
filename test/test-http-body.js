const { start } = require('..');
const test = require('tape');
const request = require('supertest');

const errHandler = (t) => (err) => {
  t.error(err);
  t.end();
};

test('Provides HTTP POST string as string parameter', (t) => {
  const body = 'This is a string';
  t.plan(2);
  start((context, receivedBody) => {
    t.equal(receivedBody, body);
    return receivedBody;
  }).then((server) => {
    request(server)
      .post('/')
      .send(body)
      .set({ 'Content-Type': 'text/plain' })
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST string as string parameter and rawBody', (t) => {
  const body = 'This is a string';
  t.plan(3);
  start(
    (context, receivedBody) => {
      t.equal(receivedBody, body);
      t.equal(context.rawBody, body);
      return receivedBody;
    },
    { includeRaw: true },
  ).then((server) => {
    request(server)
      .post('/')
      .send(body)
      .set({ 'Content-Type': 'text/plain' })
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST JSON as object parameter', (t) => {
  const body = '{"lunch": "pizza"}';
  t.plan(2);
  start((context, receivedBody) => {
    t.deepEqual(receivedBody, JSON.parse(body));
    return receivedBody;
  }).then((server) => {
    request(server)
      .post('/')
      .send(body)
      .set({ 'Content-Type': 'application/json' })
      .expect('Content-Type', /json/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST JSON as object parameter with correct rawBody', (t) => {
  const body = '{"lunch": "pizza"}';
  t.plan(3);
  start(
    (context, receivedBody) => {
      t.deepEqual(receivedBody, JSON.parse(body));
      t.equal(context.rawBody, body);
      return receivedBody;
    },
    { includeRaw: true },
  ).then((server) => {
    request(server)
      .post('/')
      .send(body)
      .set({ 'Content-Type': 'application/json' })
      .expect('Content-Type', /json/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST empty body as empty string parameter', (t) => {
  const body = '';
  t.plan(2);
  start((context, receivedBody) => {
    t.deepEqual(receivedBody, body);
    return receivedBody;
  }).then((server) => {
    request(server)
      .post('/')
      .send(body)
      .set({ 'Content-Type': 'text/plain' })
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP POST empty body as empty string parameter and rawBody', (t) => {
  const body = '';
  t.plan(3);
  start(
    (context, receivedBody) => {
      t.equal(receivedBody, body);
      t.equal(context.rawBody, body);
      return receivedBody;
    },
    { includeRaw: true },
  ).then((server) => {
    request(server)
      .post('/')
      .send(body)
      .set({ 'Content-Type': 'text/plain' })
      .expect('Content-Type', /plain/)
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});
