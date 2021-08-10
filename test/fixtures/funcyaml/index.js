// This is a test function that ensures a func.yaml file
// can set the port and log level

module.exports = function handle(context) {
  // See: https://github.com/pinojs/pino/issues/123
  if (context.log.level != 'info') {
    console.error(`Expected info but got ${context.log.level}`);
    return { statusCode: 417 };
  }
  context.log.warn(context.log);
};
