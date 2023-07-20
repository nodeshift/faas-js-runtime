// This is a simple Function that illustrates the structure of a Function object.
// Run this Function from the root directory with the following command:
// `node bin/cli.js sample/index.js`

const Fn = {
  // Handle incoming requests. This just echos the request body back to the caller.
  handle: (context, receivedBody) => {
    process.stdout.write(`In handle. Received:\n${receivedBody}\n`);
    return receivedBody;
  },

  // Optional initialization function. This is called once when the Function is
  // started up but before it begins handling requests. This should be a
  // synchronous function.
  init: () => {
    process.stdout.write('In init\n');
  },

  // Optional shutdown function. This is called once when the Function is shut
  // down. This should be a synchronous function.
  shutdown: () => {
    process.stdout.write('In shutdown\n');
  },

  // Optional liveness function. This is called periodically to determine if the
  // Function is still alive. The endpoint is exposed at /alive, which can be
  // changed by setting the path property on the function.
  liveness: () => {
    process.stdout.write('In liveness\n');
    return 'OK from liveness';
  },

  // Optional readiness function. This is called periodically to determine if the
  // Function is ready to handle requests. The endpoint is exposed at /ready,
  // which can be changed by setting the path property on the function.
  readiness: () => {
    process.stdout.write('In readiness\n');
    return 'OK from readiness';
  },
};

// Optional path property. This can be used to change the path at which the
// the liveness endpoint can be reached.
Fn.liveness.path = '/alive';

// Optional path property. This can be used to change the path at which the
// the readiness endpoint can be reached.
Fn.readiness.path = '/ready';

module.exports = Fn;
