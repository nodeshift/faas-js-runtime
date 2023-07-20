const { start } = require('..');
const test = require('tape');
const request = require('supertest');

const errHandler = (t) => (err) => {
  t.error(err);
  t.end();
};

test('Provides HTTP request headers with the context parameter', (t) => {
  t.plan(2);
  start((context) => {
    t.equal(typeof context.headers, 'object');
  }).then((server) => {
    request(server)
      .post('/')
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP request body with the context parameter', (t) => {
  t.plan(2);
  start((context) => {
    t.deepEqual(context.body, { lunch: 'tacos' });
  }).then((server) => {
    request(server)
      .post('/')
      .send('lunch=tacos')
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP request rawBody with the context parameter', (t) => {
  t.plan(3);
  start(
    (context) => {
      t.deepEqual(context.body, { lunch: 'tacos' });
      t.equal(context.rawBody, 'lunch=tacos');
    },
    { includeRaw: true },
  ).then((server) => {
    request(server)
      .post('/')
      .send('lunch=tacos')
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP request query parameters with the context parameter', (t) => {
  const func = require(`${__dirname}/fixtures/query-params/`);
  start(func).then((server) => {
    t.plan(3);
    request(server)
      .get('/?lunch=tacos&supper=burgers')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body.lunch, 'tacos');
        t.equal(res.body.supper, 'burgers');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP method information with the context parameter', (t) => {
  t.plan(2);
  let context;
  start((c) => {
    context = c;
  }).then((server) => {
    request(server)
      .get('/')
      .end((err, _) => {
        t.error(err, 'No error');
        t.equal(context.method, 'GET');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides HTTP version information with the context parameter', (t) => {
  t.plan(4);
  let context;
  start((c) => {
    context = c;
  }).then((server) => {
    request(server)
      .get('/')
      .end((err, _) => {
        t.error(err, 'No error');
        t.equal(context.httpVersion, '1.1');
        t.equal(context.httpVersionMajor, 1);
        t.equal(context.httpVersionMinor, 1);
        t.end();
        server.close();
      });
  }, errHandler(t));
});
