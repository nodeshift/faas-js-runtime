const framework = require('..');
const test = require('tape');
const request = require('supertest');

test('Provides HTTP request headers with the context parameter', t => {
  t.plan(2);
  framework(context => {
    t.equal(typeof context.headers, 'object');
  }, server => {
    request(server)
      .post('/')
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, { log: false });
});

test('Provides HTTP request body with the context parameter', t => {
  t.plan(2);
  framework(context => {
    t.deepEqual(context.body, { lunch: 'tacos' });
  }, server => {
    request(server)
      .post('/')
      .send('lunch=tacos')
      .end((err, _) => {
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, { log: false });
});

test('Provides HTTP request query parameters with the context parameter', t => {
  const func = require(`${__dirname}/fixtures/query-params/`);
  framework(func, server => {
    t.plan(3);
    request(server)
      .get('/?lunch=tacos&supper=burgers')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body.query.lunch, 'tacos');
        t.equal(res.body.query.supper, 'burgers');
        t.end();
        server.close();
      });
    }, { log: false });
});

test('Provides HTTP method information with the context parameter', t => {
  t.plan(2);
  let context;
  framework(c => context = c, server => request(server)
  .get('/')
  .end((err, _) => {
    t.error(err, 'No error');
    t.equal(context.method, 'GET');
    t.end();
    server.close();
  }), { log: false });
});

test('Provides HTTP version information with the context parameter', t => {
  t.plan(4);
  let context;
  framework(c => context = c, server => request(server)
  .get('/')
  .end((err, _) => {
    t.error(err, 'No error');
    t.equal(context.httpVersion, '1.1');
    t.equal(context.httpVersionMajor, 1);
    t.equal(context.httpVersionMinor, 1);
    t.end();
    server.close();
  }), { log: false });
});

