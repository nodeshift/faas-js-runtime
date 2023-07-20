const fs = require('fs');
const path = require('path');

// This is the way to import es modules inside a CJS module
const dynamicImport = new Function('modulePath', 'return import(modulePath)');

async function loadFunction(filePath) {
  let _path = filePath;
  if (isESM(_path)) {
    if (process.platform === 'win32') {
      // Windows requires the file path to be a URL
      _path = `file:///${_path}`;
    }
    code = await dynamicImport(_path);
  } else {
    code = require(_path);
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
  // look in the parent directory if the function is in a subdirectory
  let dir = pathParsed.dir;
  const rootDir = path.parse(process.cwd()).root;
  while (!hasPackageJson(dir)) {
    if (dir === rootDir) return false;
    dir = path.dirname(dir);
  }

  // Load the package.json and check the type field
  // Put this in a try/catch in case the package.json is invalid
  const pkgPath = path.join(dir, 'package.json');
  try {
    const functionPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return functionPkg.type === 'module';
  } catch (e) {
    console.warn(e);
    return false;
  }
}

function hasPackageJson(dir) {
  const pkgPath = path.join(dir, 'package.json');
  return fs.existsSync(pkgPath);
}

module.exports = exports = { loadFunction };
