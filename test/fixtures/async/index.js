module.exports = async function testFunc(context) {
  const ret = 'This is the test function for Node.js FaaS. Success.';
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      resolve(ret);
    }, 500);
  });
};
