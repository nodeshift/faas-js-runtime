'use strict';

const { start } = require('..');
const test = require('tape');
const request = require('supertest');
const Spec = require('../lib/ce-constants.js').Spec;

// package.json handling
const { existsSync, readdirSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const { CloudEvent, HTTP } = require('cloudevents');

// Ensure fixture dependencies are installed
const fixtureDir = path.join(__dirname, 'fixtures');
const fixtures = readdirSync(fixtureDir);
fixtures.forEach(installDependenciesIfExist);

function installDependenciesIfExist(functionPath) {
  if (path.extname(functionPath) !== '') {
    functionPath = path.dirname(functionPath);
  }
  functionPath = path.join(fixtureDir, functionPath);
  if (existsSync(path.join(functionPath, 'package.json'))) {
    // eslint-disable-next-line
    console.log(`Installing dependencies for ${functionPath}`);
    execSync('npm install --production', { cwd: functionPath });
  }
}

const errHandler = t => err => {
  t.error(err);
  t.end();
};

test('Loads a user function with dependencies', t => {
  const func = require(`${__dirname}/fixtures/http-get/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(typeof res.body, 'object');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Can respond via an async function', t => {
  const func = require(`${__dirname}/fixtures/async/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body,
            { message: 'This is the test function for Node.js FaaS. Success.' });
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Accepts HTTP POST requests', t => {
  const func = require(`${__dirname}/fixtures/http-post/`);
  start(func)
    .then(server => {
      request(server)
        .post('/')
        .send('message=Message body')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err);
          t.equal(res.body.message, 'Message body');
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Responds to 0.3 binary cloud events', t => {
  const func = require(`${__dirname}/fixtures/cloud-event/`);
  start(func)
    .then(server => {
      request(server)
        .post('/')
        .send({ message: 'hello' })
        .set(Spec.id, '1')
        .set(Spec.source, 'integration-test')
        .set(Spec.type, 'dev.knative.example')
        .set(Spec.version, '0.3')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body, { message: 'hello' });
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Responds with 0.3 binary cloud event', t => {
  const func = require(`${__dirname}/fixtures/cloud-event/with-response.js`);
  start(func)
    .then(server => {
      request(server)
        .post('/')
        .send({ message: 'hello' })
        .set(Spec.id, '1')
        .set(Spec.source, 'integration-test')
        .set(Spec.type, 'dev.knative.example')
        .set(Spec.version, '0.3')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.body.message, 'hello');
          t.equal(res.headers[Spec.type], 'dev.ocf.js.type');
          t.equal(res.headers[Spec.source], 'dev/ocf/js/service');
          t.equal(res.headers[Spec.id], 'dummyid');
          t.equal(res.headers[Spec.version], '0.3');
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Responds to 1.0 binary cloud events', t => {
  const func = require(`${__dirname}/fixtures/cloud-event/`);
  start(func)
    .then(server => {
      request(server)
        .post('/')
        .send({ message: 'hello' })
        .set(Spec.id, '1')
        .set(Spec.source, 'integration-test')
        .set(Spec.type, 'dev.knative.example')
        .set(Spec.version, '1.0')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body, { message: 'hello' });
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Responds to 1.0 structured cloud events', t => {
  const func = require(`${__dirname}/fixtures/cloud-event/`);
  start(func)
    .then(server => {
      request(server)
        .post('/')
        .send({
          id: '1',
          source: 'http://integration-test',
          type: 'com.redhat.faas.test',
          specversion: '1.0',
          data: {
            message: 'hello'
          }
        })
        .set('Content-type', 'application/cloudevents+json; charset=utf-8')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body, {message: 'hello'});
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Handles 1.0 CloudEvent responses', t => {
  start(_ => new CloudEvent({
      source: 'test',
      type: 'test-type',
      data: 'some data',
      datacontenttype: 'text/plain'
    }))
    .then(server => {
      request(server)
      .post('/')
      .send({ message: 'hello' })
      .set(Spec.id, '1')
      .set(Spec.source, 'integration-test')
      .set(Spec.type, 'dev.knative.example')
      .set(Spec.version, '1.0')
      .expect(200)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.text, 'some data');
        t.end();
        server.close();
      });
    }, errHandler(t));
});

test('Handles 1.0 CloudEvent Message responses', t => {
  start(_ => HTTP.binary(new CloudEvent({
      source: 'test',
      type: 'test-type',
      data: 'some data',
      datacontenttype: 'text/plain'
    })))
    .then(server => {
      request(server)
      .post('/')
      .send({ message: 'hello' })
      .set(Spec.id, '1')
      .set(Spec.source, 'integration-test')
      .set(Spec.type, 'dev.knative.example')
      .set(Spec.version, '1.0')
      .expect(200)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.text, 'some data');
        t.end();
        server.close();
      });
    }, errHandler(t));
});

test('Extracts event data as the second parameter to a function', t => {
  const data = {
    lunch: 'tacos',
  };

  start((context, menu) => {
    t.equal(menu.lunch, data.lunch);
    return menu;
    })
    .then(server => {
      request(server)
        .post('/')
        .send({
          id: '1',
          source: 'http://integration-test',
          type: 'com.redhat.faas.test',
          specversion: '1.0',
          data
        })
        .set('Content-type', 'application/cloudevents+json; charset=utf-8')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body, data);
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Successfully handles events with no data', t => {
  start((context, data) => {
    t.ok(!data);
    t.true(context.cloudevent instanceof CloudEvent);
    return { status: 'done' };
  })
  .then(server => {
    request(server)
      .post('/')
      .set(Spec.id, '1')
      .set(Spec.type, 'test')
      .set(Spec.source, 'test')
      .set(Spec.version, '1.0')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.deepEqual(res.body, { status: 'done' });
        t.end();
        server.close();
      });
  }, errHandler(t));
});

// @see https://github.com/cloudevents/sdk-javascript/issues/332
// test('Responds with 406 Not Acceptable to unknown cloud event versions', t => {
//   const func = require(`${__dirname}/fixtures/cloud-event/`);
//   framework(func)
//     .then(server => {
//       request(server)
//         .post('/')
//         .send({ message: 'hello' })
//         .set(Spec.id, '1')
//         .set(Spec.source, 'integration-test')
//         .set(Spec.type, 'dev.knative.example')
//         .set(Spec.version, '11.0')
//         .expect(406)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           t.error(err, 'No error');
//           t.equal(res.body.statusCode, 406);
//           t.equal(res.body.message, 'invalid spec version 11.0');
//           t.end();
//           server.close();
//         });
//     });
// });

test('Respects response code set by the function', t => {
  const func = require(`${__dirname}/fixtures/response-code/`);
  start(func)
    .then(server => {
      t.plan(1);
      request(server)
        .get('/')
        .expect(451)
        .expect('Content-Type', /json/)
        .end(err => {
          t.error(err, 'No error');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Responds HTTP 204 if response body has no content', t => {
  const func = require(`${__dirname}/fixtures/no-content/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .get('/')
        .expect(204)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.body, '');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Sends CORS headers in HTTP response', t => {
  const func = require(`${__dirname}/fixtures/no-content/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .get('/')
        .expect(204)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Allow-Methods',
          'OPTIONS, GET, DELETE, POST, PUT, HEAD, PATCH')
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.body, '');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Respects headers set by the function', t => {
  const func = require(`${__dirname}/fixtures/response-header/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .get('/')
        .expect(200)
        .expect('X-announce-action', 'Saying hello')
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.body.message, 'Well hello there');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Respects content type set by the function', t => {
  const func = require(`${__dirname}/fixtures/content-type/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.text, '{"message":"Well hello there"}');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Accepts application/json content via HTTP post', t => {
  const func = require(`${__dirname}/fixtures/json-input/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .post('/')
        .send({ lunch: 'tacos' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body, { lunch: 'tacos' });
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Accepts x-www-form-urlencoded content via HTTP post', t => {
  const func = require(`${__dirname}/fixtures/json-input/`);
  start(func)
    .then(server => {
      t.plan(2);
      request(server)
        .post('/')
        .send('lunch=tacos')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          t.error(err, 'No error');
          t.deepEqual(res.body, { lunch: 'tacos' });
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Exposes readiness URL', t => {
  start(_ => '')
    .then(server => {
      t.plan(2);
      request(server)
        .get('/health/readiness')
        .expect(200)
        .expect('Content-type', /text/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.text, 'OK');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Exposes liveness URL', t => {
  start(_ => '')
    .then(server => {
      t.plan(2);
      request(server)
        .get('/health/liveness')
        .expect(200)
        .expect('Content-type', /text/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.text, 'OK');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

test('Returns HTTP error code if a caught error has one', t => {
  start(_ => {
    const error = new Error('Unavailable for Legal Reasons');
    error.code = 451;
    throw error;
  })
  .then(server => {
      t.plan(1);
      request(server)
        .get('/')
        .expect(451)
        .expect('Content-type', /json/)
        .end((err, _) => {
          t.error(err, 'No error');
          t.end();
          server.close();
        });
  }, errHandler(t));
});

test('Function accepts destructured parameters', t => {
  start(function({ lunch }) { return { message: `Yay ${lunch}` }; })
    .then(server => {
      t.plan(2);
      request(server)
        .get('/?lunch=tacos')
        .expect(200)
        .expect('Content-type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equals(res.body.message, 'Yay tacos');
          t.end();
          server.close();
        });
  }, errHandler(t));
});

test('Provides logger with appropriate log level configured', t => {
  var loggerProvided = false;
  const logLevel = 'error';
  start(context => {
    loggerProvided = (context.log && 
      typeof context.log.info === 'function' && 
      typeof context.log.warn === 'function' &&
      typeof context.log.debug === 'function' &&
      typeof context.log.trace === 'function' &&
      typeof context.log.fatal === 'function' &&
      context.log.level === logLevel);
  }, { logLevel })
    .then(server => {
      request(server)
        .get('/')
        .end((err, _) => {
          t.error(err, 'No error');
          t.assert(loggerProvided, 'Logger provided');
          t.end();
          server.close();
        });
    }, errHandler(t)); // enable but squelch
});

test('Provides logger in context when logging is disabled', t => {
  var loggerProvided = false;
  start(context => {
    loggerProvided = (context.log && typeof context.log.info === 'function');
  })
    .then(server => {
      request(server)
        .get('/')
        .end((err, _) => {
          t.error(err, 'No error');
          t.assert(loggerProvided, 'Logger provided');
          t.end();
          server.close();
        });
    }, errHandler(t));
});

test('Accepts CloudEvents with content type of text/plain', t => {
  start(_ => new CloudEvent({
    source: 'test',
    type: 'test-type',
    data: 'some data',
    datacontenttype: 'text/plain'
  }))
    .then(server => {
      request(server)
        .post('/')
        .send('hello')
        .set(Spec.id, '1')
        .set(Spec.source, 'integration-test')
        .set(Spec.type, 'dev.knative.example')
        .set(Spec.version, '1.0')
        .set('ce-datacontenttype', 'text/plain')
        .set('content-type', 'text/plain')
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.equal(res.text, 'some data');
          t.end();
          server.close();
        });
      }, errHandler(t));
});

