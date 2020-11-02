module.exports = function testFunc(context, data) {
  if (context.cloudevent) return { message: data.message };
  else return new Error('No cloud event received');
};
