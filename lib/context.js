class Context {
  constructor(request) {
    for (const [key, value] of Object.entries(request.query)) this[key] = value;
  }
}

module.exports = Context;
