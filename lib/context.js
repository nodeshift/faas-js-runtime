class Context {
  constructor(request) {
    for (const [key, value] of Object.entries(request.query)) this[key] = value;
    this.__ow_user = 'unknown';
    this.__ow_method = request.raw.method;
    this.__ow_headers = request.headers;
    this.__ow_path = '';
    this.__ow_query = request.query;
    this.__ow_body = JSON.stringify(request.body);
  }
}

module.exports = Context;
