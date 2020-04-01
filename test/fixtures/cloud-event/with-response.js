module.exports = function testFunc(context) {
  if (context.cloudevent) {
    const response = {
      message: context.cloudevent.data.message
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
