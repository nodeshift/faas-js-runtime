const path = require('path');

// This is the way to import es modules inside a CJS module
const dynamicImport = new Function('modulePath', 'return import(modulePath)');

async function loadFunction(filePath) {
  if (isESM(filePath)) {
    code = await dynamicImport(filePath);
  } else {
    code = require(filePath);
  }

  return code;
}

// https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#determining-module-system
// An ESM module can be determined 2 ways
// 1. has the mjs file extention
// 2. type=module in the package.json
function isESM(filePath) {
  const pathParsed = path.parse(filePath);

  if (pathParsed.ext === '.mjs') {
    return true;
  }

  // find the functions package.json and see if it has a type field
  const functionPkg = require(path.join(pathParsed.dir, 'package.json'));
  if (functionPkg.type === 'module') {
    return true;
  }

  // Should default to CJS
  return false;
}


module.exports = exports = { loadFunction };
