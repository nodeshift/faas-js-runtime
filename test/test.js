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
const fixtures = fs.readdirSync(`${__dirname}/fixtures`);
fixtures.forEach(installDependenciesIfExist);

function installDependenciesIfExist(functionPath) {
  if (path.extname(functionPath) !== '') {
    functionPath = path.dirname(functionPath);
  }
  if (existsSync(path.join(functionPath, 'package.json'))) {
    execSync('npm install --production', { cwd: functionPath });
  }
}


test('Loads a user function with dependencies', t => {
  const func = require(`${__dirname}/fixtures/simple-http/`);
  framework(func, server => {
    t.plan(2);
    request(server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body.message,
          'This is the test function for Node.js FaaS. Success.');
        t.end();
        server.close();
      });
    });
});

test('Executes an async function', t => {
  const func = require(`${__dirname}/fixtures/async/`);
  framework(func, server => {
    t.plan(2);
    request(server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.error(err, 'No error');
        t.equal(res.body.message,
          'This is the test function for Node.js FaaS. Success.');
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
        // console.log(res);
        t.equal(res.body.message, 'hello');
        t.end();
        server.close();
      });
  });
});