'use strict';

const framework = require('..');
const test = require('tape');
const request = require('supertest');

// paackage.json handling
const { existsSync, readdirSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

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


test('Loads a user function with dependencies', t => {
  const func = require(`${__dirname}/fixtures/http-get/`);
  framework(func, server => {
    t.plan(2);
    request(server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        console.log(res.body)
        t.error(err, 'No error');
        t.equal(res.body, 'This is the test function for Node.js FaaS. Success.');
        t.end();
        server.close();
      });
    });
});

test('Can respond via an async function', t => {
  const func = require(`${__dirname}/fixtures/async/`);
  framework(func, server => {
    t.plan(2);
    request(server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body,
          'This is the test function for Node.js FaaS. Success.');
        t.end();
        server.close();
      });
    });
});

test('Accepts HTTP POST requests', t => {
  const func = require(`${__dirname}/fixtures/http-post/`);
  framework(func, server => {
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
  });
});

test('Responds to cloud events', t => {
  const func = require(`${__dirname}/fixtures/cloud-event/`);
  framework(func, server => {
    request(server)
      .post('/')
      .send({ message: 'hello' })
      .set('Ce-id', '1')
      .set('Ce-source', 'integration-test')
      .set('Ce-type', 'dev.knative.example')
      .set('Ce-specversion', '0.2')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body, 'hello');
        t.end();
        server.close();
      });
  });
});

test('Passes query parameters to the function', t => {
  const func = require(`${__dirname}/fixtures/query-params/`);
  framework(func, server => {
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
    });
});

test('Respects response code set by the function', t => {
  const func = require(`${__dirname}/fixtures/response-code/`);
  framework(func, server => {
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
    });
});

test('Responds HTTP 204 if response body has no content', t => {
  const func = require(`${__dirname}/fixtures/no-content/`);
  framework(func, server => {
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
    });
});

test('Sends CORS headers in HTTP response', t => {
  const func = require(`${__dirname}/fixtures/no-content/`);
  framework(func, server => {
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
    });
});

test('Respects headers set by the function', t => {
  const func = require(`${__dirname}/fixtures/response-header/`);
  framework(func, server => {
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
    });
});

test('Respects content type set by the function', t => {
  const func = require(`${__dirname}/fixtures/content-type/`);
  framework(func, server => {
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
    });
});

test('Accepts application/json content via HTTP post', t => {
  const func = require(`${__dirname}/fixtures/json-input/`);
  framework(func, server => {
    t.plan(2);
    request(server)
      .post('/')
      .send({ lunch: 'tacos' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body, 'tacos');
        t.end();
        server.close();
      });
  });
});

test('Accepts x-www-form-urlencoded content via HTTP post', t => {
  const func = require(`${__dirname}/fixtures/json-input/`);
  framework(func, server => {
    t.plan(2);
    request(server)
      .post('/')
      .send('lunch=tacos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body, 'tacos');
        t.end();
        server.close();
      });
  });
});

test('Exposes OpenWhisk compatible context properties', t => {
  const func = require(`${__dirname}/fixtures/openwhisk-properties/`);
  framework(func, server => {
    t.plan(7);
    request(server)
      .get('/?lunch=tacos')
      .expect(200)
      .expect('Content-type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body.__ow_user, '');
        t.equal(res.body.__ow_method, 'GET');
        t.equal(typeof res.body.__ow_headers, 'object');
        t.equal(res.body.__ow_path, '');
        t.equal(typeof res.body.__ow_query, 'object');
        t.equal(res.body.__ow_body, 'null');
        t.end();
        server.close();
      });
    });
});

test('Exposes readiness URL', t => {
  framework(_ => { }, server => {
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
    });
});

test('Exposes liveness URL', t => {
  framework(_ => { }, server => {
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
    });
});

test('Returns HTTP error code if a caught error has one', t => {
  framework(_ => {
    const error = new Error('Unavailable for Legal Reasons');
    error.code = 451;
    throw error;
  }, server => {
      request(server)
        .get('/')
        .expect(451)
        .expect('Content-type', /json/)
        .end((err, res) => {
          t.error(err, 'No error');
          t.end();
          server.close();
        });
  });
});