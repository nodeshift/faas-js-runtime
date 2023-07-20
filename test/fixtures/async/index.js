module.exports = async function testFunc(_) {
  const ret = {
    message: 'This is the test function for Node.js FaaS. Success.',
  };
  return new Promise((resolve, reject) => {
    setTimeout((_) => {
      resolve(ret);
    }, 500);
  });
};
