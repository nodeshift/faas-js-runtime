const { start } = require('..');
const test = require('tape');
const request = require('supertest');

const errHandler = t => err => {
    t.error(err);
    t.end();
};

test('Exposes a /metrics endpoint', async t => {
  const server = await start(_ => _);
  try {
    await callEndpointNoError(server, '/metrics', t);
  } finally {
    server.close();
  }
});

test('Provides an invocation count', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_invocations counter'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides execution latency', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_queue_latency histogram'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides error count', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_errors counter'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides cold start latency', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_cold_start_latency histogram'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides queue latency', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_queue_latency histogram'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides CPU utilization', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_cpu_utilization gauge'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides memory utilization', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_mem_utilization gauge'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Provides network I/O utilization', t => {
  t.plan(2);
  start(_ => _)
  .then(server => {
    request(server)
      .get('/metrics')
      .end((err, got) => {
        t.ok(got.text.includes('# TYPE faas_netio_utilization gauge'));
        t.error(err, 'No error');
        t.end();
        server.close();
      });
  }, errHandler(t));
});

test('Only cacluates metrics for calls to /', async t => {
  const metric = 'faas_invocations{faas_name="anonymous",faas_id="",faas_instance="",faas_runtime="Node.js"}';
  const expected = `${metric} 1`;
  const server = await start(_ => _);
  try {
    await callEndpointNoError(server, '/', t);
    await requestMetricsAndValidate(server, t, expected);
    await callEndpointNoError(server, '/health/readiness', t);
    await requestMetricsAndValidate(server, t, expected);
    await callEndpointNoError(server, '/', t);
    // We've now called the function twice
    await requestMetricsAndValidate(server, t, `${metric} 2`);
  } finally {
    server.close();
  }
});

async function requestMetricsAndValidate(server, t, expected) {
  return request(server)
    .get('/metrics')
    .then(got => {
      t.ok(got.text.includes(expected));
    })
    .catch(t.error);
}

async function callEndpointNoError(server, endpoint, t) {
  return request(server).get(endpoint).catch(t.error);
}
