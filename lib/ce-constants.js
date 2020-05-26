const { Constants } = require('cloudevents-sdk');

const Spec = {
  version: Constants.BINARY_HEADERS_1.SPEC_VERSION,
  type: Constants.BINARY_HEADERS_1.TYPE,
  id: Constants.BINARY_HEADERS_1.ID,
  source: Constants.BINARY_HEADERS_1.SOURCE,
  ceJsonContentType: Constants.MIME_CE_JSON
};

module.exports = {
  Spec
};
