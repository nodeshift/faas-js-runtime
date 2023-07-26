module.exports = function() {
  return {
    headers: {
      'Content-Type': 'image/jpeg'
    },
    body: Buffer.from([0xd8, 0xff, 0xe0, 0xff, 0x10, 0x00, 0x46]),
    statusCode: 201,
  };
};
