module.exports = function testFunc(context) {
  if (context.cloudevent) return context.cloudevent.data.message;
  else return new Error('No cloud event received');
};
