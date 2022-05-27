
const { start } = require('..');
const test = require('tape');
const request = require('supertest');

function declaredFunction() {
  return {
    hasGlobal: this.global !== undefined,
    isFrozenThis: Object.isFrozen(this)
  };
}
const arrowFunction = () => ({
    hasGlobal: this.global !== undefined,
    isFrozenThis: Object.isFrozen(this)
  });

const errHandler = t => err => {
  t.error(err);
  t.end();
};

const tests = {
  arrowFunctionTests: [
    {
      test: 'Does not have a global object',
      func: checkHasGlobal,
      expect: false
    },
    {
      test: 'Has unfrozen this',
      func: checkIsFrozen,
      expect: false
    }
  ],
  declaredFunctionTests: [
    {
      test: 'Does not have a global object',
      func: checkHasGlobal,
      expect: false
    },
    {
      test: 'Has frozen this',
      func: checkIsFrozen,
      expect: true
    }
  ]
};

for (const tt of tests.declaredFunctionTests) {
  test(tt.test, t => {
    start(declaredFunction)
      .then(s => tt.func(s, t, tt.expect), errHandler(t));
  });
}

for (const tt of tests.arrowFunctionTests) {
  test(tt.test, t => {
    start(arrowFunction)
      .then(s => tt.func(s, t, tt.expect), errHandler(t));
  });
}

function checkHasGlobal(server, t, expected) {
  request(server)
  .get('/')
  .expect(200)
  .end((err, res) => {
    t.error(err, 'No error');
    t.equal(res.body.hasGlobal, expected);
    t.end();
    server.close();
  });
}

function checkIsFrozen(server, t, expected) {
  request(server)
  .get('/')
  .expect(200)
  .end((err, res) => {
    t.error(err, 'No error');
    t.equal(res.body.isFrozenThis, expected);
    t.end();
    server.close();
  });
}
