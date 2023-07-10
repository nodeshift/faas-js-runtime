const { CloudEvent } = require('cloudevents');

class Context {
  constructor(request) {
    this.body = request.body;
    this.query = { ...request.query };
    this.headers = { ...request.headers };
    this.method = request.raw.method;
    this.httpVersion = request.raw.httpVersion;
    this.httpVersionMajor = request.raw.httpVersionMajor;
    this.httpVersionMinor = request.raw.httpVersionMinor;
    this.contentType = request.headers['content-type'];
    this.rawBody = request.rawBody;

    Object.assign(this, request.query);
    this.log = request.log;
  }

  cloudEventResponse(response) {
    return new CloudEventResponse(response);
  }
}

class CloudEventResponse {
  #response;

  constructor(response) {
    this.#response = { data: response };
  }

  version(version) {
    this.#response.specversion = version;
    return this;
  }

  id(id) {
    this.#response.id = id;
    return this;
  }

  type(type) {
    this.#response.type = type;
    return this;
  }

  source(source) {
    this.#response.source = source;
    return this;
  }

  response() {
    return new CloudEvent(this.#response);
  }
}

module.exports = Context;
