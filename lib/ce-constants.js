const { CONSTANTS } = require('cloudevents');

const Spec = {
  version: CONSTANTS.CE_HEADERS.SPEC_VERSION,
  type: CONSTANTS.CE_HEADERS.TYPE,
  id: CONSTANTS.CE_HEADERS.ID,
  source: CONSTANTS.CE_HEADERS.SOURCE,
  ceJsonContentType: CONSTANTS.MIME_CE_JSON
};

module.exports = {
  Spec
};
