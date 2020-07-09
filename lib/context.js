const Spec = require('../lib/ce-constants.js').Spec;

class Context {
  constructor(request) {
    this.query = { ...request.query };
    this.body = { ...request.body };
    this.headers = { ...request.headers };
    this.method = request.raw.method;
    this.httpVersion = request.raw.httpVersion;
    this.httpVersionMajor = request.raw.httpVersionMajor;
    this.httpVersionMinor = request.raw.httpVersionMinor;

    Object.assign(this, request.query);
    this.log = request.log;

    this.__ow_user = '';
    this.__ow_method = request.raw.method;
    this.__ow_headers = request.headers;
    this.__ow_path = '';
    this.__ow_query = request.query;
    this.__ow_body = JSON.stringify(request.body);
  }

  cloudEventResponse(response) {
    return new CloudEventResponse(response);
  }

}

class CloudEventResponse {
  #response;

  constructor(response) {
    this.#response = response;
    if (!this.#response.headers) {
      this.#response.headers = [];
    }
  }

  version(version) {
    this.#response.headers[Spec.version] = version;
    return this;
  }

  id(id) {
    this.#response.headers[Spec.id] = id;
    return this;
  }

  type(type) {
    this.#response.headers[Spec.type] = type;
    return this;
  }

  source(source) {
    this.#response.headers[Spec.source] = source;
    return this;
  }

  response() {
    return this.#response;
  }
}

module.exports = Context;
