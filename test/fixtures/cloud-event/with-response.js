module.exports = function testFunc(data, context) {
  if (context.cloudevent) {
    const response = {
      message: data.message
    };
    return context.cloudEventResponse(response).version('0.3')
                                               .id('dummyid')
                                               .type('dev.ocf.js.type')
                                               .source('dev/ocf/js/service')
                                               .response();
  }
  else {
    return new Error('No cloud event received');
  }
};
