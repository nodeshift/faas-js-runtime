const Constants = require('cloudevents/dist/constants').default;

const Spec = {
  version: Constants.CE_HEADERS.SPEC_VERSION,
  type: Constants.CE_HEADERS.TYPE,
  id: Constants.CE_HEADERS.ID,
  source: Constants.CE_HEADERS.SOURCE,
  ceJsonContentType: Constants.MIME_CE_JSON
};

module.exports = {
  Spec
};
