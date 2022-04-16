const fs = require('fs');
const { DIR_PATH } = require('./constants');

const cleanData = () =>
  fs.existsSync(DIR_PATH) &&
  fs.rmSync(
    DIR_PATH,
    { recursive: true, force: true }
  );

module.exports = cleanData;
