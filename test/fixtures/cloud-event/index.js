module.exports = function testFunc(context, event) {
  if (context.cloudevent) return { message: event.data.message };
  else return new Error('No cloud event received');
};
