const { start } = require('..');
const test = require('tape');
const request = require('supertest');

const defaults = { logLevel: 'silent' };

test('Enforces the handle function to exist', async t => {
  t.plan(1);
  try {
    await start({}, defaults);
  } catch (err) {
    t.ok(err.message.includes('handle'), 'handle function is required');
  }
});

test('Calls init before the server has started', async t => {
  t.plan(1);
  let initCalled = false;
  const server = await start(
    {
      init: () => {
        initCalled = true;
      },
      handle: () => {},
    },
    defaults
  );
  t.ok(initCalled, 'init was called');
  server.close();
});

test('Calls async init before the server has started', async t => {
  t.plan(1);
  let initCalled = false;
  const server = await start(
    {
      init: () =>
        new Promise(() => {
          initCalled = true;
        }),
      handle: () => {},
    },
    defaults
  );
  t.ok(initCalled, 'init was called');
  server.close();
});

test('Bubbles up any exceptions thrown by init()', t => {
  t.plan(1);
  start(
    {
      init: () => {
        throw new Error('init failed');
      },
      handle: () => {},
    },
    defaults
  )
    .then(() => t.fail('should not have resolved'))
    .catch(err => t.ok(err.message.includes('init failed'), 'init failed'));
});

test('Calls shutdown after the server has stopped', async t => {
  t.plan(1);
  let shutdownCalled = false;
  const server = await start(
    {
      handle: () => {},
      shutdown: _ => {
        shutdownCalled = true;
      },
    },
    defaults
  );
  t.ok(!shutdownCalled, 'shutdown was not called before server.close()');
  return new Promise(resolve => {
    // TODO: It would be nice to check for the shutdown call here
    // but it's not clear how to do that if we are only hooking on
    // signal interrupts.
    server.close(resolve);
  });
});

test('Calls async shutdown after the server has stopped', async t => {
  t.plan(1);
  let shutdownCalled = false;
  const server = await start(
    {
      handle: () => {},
      shutdown: _ =>
        new Promise(_ => {
          shutdownCalled = true;
        }),
    },
    defaults
  );
  t.ok(!shutdownCalled, 'shutdown was not called before server.close()');
  return new Promise(resolve => {
    // TODO: It would be nice to check for the shutdown call here
    // but it's not clear how to do that if we are only hooking on
    // signal interrupts.
    server.close(resolve);
  });
});

test('Liveness endpoint can be provided', t => {
  start({
    handle: _ => 'OK',
    liveness: _ => 'I am alive',
  }).then(server => {
    t.plan(2);
    request(server)
      .get('/health/liveness')
      .expect(200)
      .expect('Content-type', /text/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.text, 'I am alive');
        t.end();
        server.close();
      });
  });
});

test('Liveness route can be provided', t => {
  function liveness() {
    return 'I am alive';
  }
  liveness.path = '/alive';
  start({
    handle: _ => 'OK',
    liveness,
  }).then(server => {
    t.plan(2);
    request(server)
      .get('/alive')
      .expect(200)
      .expect('Content-type', /text/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.text, 'I am alive');
        t.end();
        server.close();
      });
  });
});

test('Readiness endpoint can be provided', t => {
  start({
    handle: _ => 'OK',
    readiness: _ => 'I am ready',
  }).then(server => {
    t.plan(2);
    request(server)
      .get('/health/readiness')
      .expect(200)
      .expect('Content-type', /text/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.text, 'I am ready');
        t.end();
        server.close();
      });
  });
});

test('Readiness route can be provided', t => {
  function readiness() {
    return 'I am ready';
  }
  readiness.path = '/ready';
  start({
    handle: _ => 'OK',
    readiness,
  }).then(server => {
    t.plan(2);
    request(server)
      .get('/ready')
      .expect(200)
      .expect('Content-type', /text/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.text, 'I am ready');
        t.end();
        server.close();
      });
  });
});
