'use strict';

const framework = require('..');
const test = require('tape');
const request = require('supertest');

// paackage.json handling
const { existsSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure fixture dependencies are installed
const fixtureDir = path.join(__dirname, 'fixtures');
const fixtures = fs.readdirSync(fixtureDir);
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
        t.error(err, 'No error');
        t.equal(res.body.payload,
          'This is the test function for Node.js FaaS. Success.');
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
        t.equal(res.body.payload,
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
      .send('Message body')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err);
        t.equal(res.body.payload, 'Message body');
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
        t.equal(res.body.payload, 'hello');
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
