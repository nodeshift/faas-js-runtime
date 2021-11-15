const { start } = require('..');
const test = require('tape');
const request = require('supertest');

process.env.FAAS_ID = 'test';

const tests = [
  {test: 'Invocation count', expected: 'faas_invocations counter'},
  {test: 'Error count', expected: 'faas_errors counter'},
  {test: 'Cold start latency', expected: 'faas_cold_start_latency histogram'},
  {test: 'Execution latency', expected: 'faas_execution_latency histogram'},
  {test: 'Queue latency', expected: 'faas_queue_latency histogram'},
  {test: 'CPU utilization', expected: 'faas_cpu_utilization gauge'},
  {test: 'Memory utilization', expected: 'faas_mem_utilization gauge'},
  {test: 'Network I/O utilization', expected: 'faas_netio_utilization gauge'},
];

for (const tc of tests) {
  test(tc.test, async t => testMetricsInclude(`# TYPE ${tc.expected}`, t));
}


test('Exposes a /metrics endpoint', async t => {
  const server = await start(_ => _);
  try {
    await callEndpointNoError(server, '/metrics', t);
  } finally {
    server.close();
  }
});

test('Only cacluates metrics for calls to /', async t => {
  // eslint-disable-next-line max-len
  const metric = 'faas_invocations{faas_name="anonymous",faas_id="test",faas_instance="undefined",faas_runtime="Node.js"}';
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
  const got = await callEndpointNoError(server, '/metrics', t);
  t.ok(got.text.includes(expected), expected);
}

// A helper function that calls a server endpoint with a
// GET request and reports any error
async function callEndpointNoError(server, endpoint, t) {
  return request(server).get(endpoint).catch(t.error);
}

// A helper function that will test if the /metrics endpoint
// includes the expected metric in its response
async function testMetricsInclude(metric, t) {
  const server = await start(_ => _);
  try {
    const got = await callEndpointNoError(server, '/metrics', t);
    t.ok(got.text.includes(metric), metric);
  } finally {
    server.close();
  }
}
