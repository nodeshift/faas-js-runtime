class Context {
  constructor(request) {
    this.__ow_user = '';
    this.__ow_method = request.raw.method;
    this.__ow_headers = request.headers;
    this.__ow_path = '';
    this.__ow_query = request.query;
    this.__ow_body = JSON.stringify(request.body);
    Object.assign(this, request.query);
  }
}

module.exports = Context;
