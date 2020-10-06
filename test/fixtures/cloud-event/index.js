module.exports = function testFunc(data, context) {
  if (context.cloudevent) return { message: data.message };
  else return new Error('No cloud event received');
};
