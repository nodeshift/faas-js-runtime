'use strict';

module.exports = context => {
  const ret = {};
  ['__ow_user', '__ow_method', '__ow_headers', '__ow_path', '__ow_query', '__ow_body']
    .map(v => ret[v] = context[v]);
  return ret;
};
