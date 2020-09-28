## FaaS Node.js Runtime Framework

[![Node.js CI](https://github.com/boson-project/faas-js-runtime/workflows/Node.js%20CI/badge.svg)](https://github.com/boson-project/faas-js-runtime/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster)

This module provides a Node.js framework for executing a function that
exists in a user provided directory path as an `index.js` file. The
directory may also contain an optional `package.json` file which can
be used to declare runtime dependencies for the function.

The function is loaded, and then invoked for incoming HTTP requests
at `localhost:8080`. The incoming request may be a
[Cloud Event](https://github.com/cloudevents/sdk-javascript#readme.) or
just a simple HTTP GET request. In either case, the function will receive
a `Context` object instance that has an `event` property. For a raw HTTP
request, the incoming request is converted to a Cloud Event.

The invoked user function can be `async` but that is not required.

TBD: What format should the function response be? Should it also be a Cloud
Event? But where is the event emitted? To some Knative Channel? Much is
still to be determined.

### Usage

In my current working directory, I have an `index.js` file like this.

```js
const framework = require('faas-js-runtime');

// My function directory is in ./function-dir
framework(require(`${__dirname}/function-dir/`), server => {
  // The server is now listening on localhost:8080
  // and the function will be invoked for each HTTP
  // request to this endpoint.
  console.log('Server listening');

  // Whenever you want to shutdown the framework
  server.close();
});
```

In `./function-dir`, there is an `index.js` file that looks
like this.

```js
module.exports = async function myFunction(context) {
  const ret = 'This is a test function for Node.js FaaS. Success.';
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      resolve(ret);
    }, 500);
  });
};
```

You can use `curl` to `POST` to the endpoint:
```console
$ curl -X POST -d 'hello=world' \
  -H'Content-type: application/x-www-form-urlencoded' http://localhost:8080
```

You can use `curl` to `POST` JSON data to the endpoint:
```console
$ curl -X POST -d '{"hello": "world"}' \
  -H'Content-type: application/json' \
  http://localhost:8080
```

You can use `curl` to `POST` an event to the endpoint:
```console
$ curl -X POST -d '{"hello": "world"}' \
  -H'Content-type: application/json' \
  -H'Ce-id: 1' \
  -H'Ce-source: cloud-event-example' \
  -H'Ce-type: dev.knative.example' \
  -H'Ce-specversion: 0.2' \
  http://localhost:8080
```

### Sample

You can see this in action, executing the function at `test/fixtures/async`
by running `node hack/run.js`.

### Tests

Just run `npm test`.
