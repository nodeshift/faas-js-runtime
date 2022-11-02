// const path = require('path');
// const async = require(path.join(__dirname, '..', 'test', 'fixtures', 'async'));
const f = (context, receivedBody) => receivedBody;

require('..').start(f);
