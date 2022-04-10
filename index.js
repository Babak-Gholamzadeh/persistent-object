const path = require('path');
const { ensureDir } = require('./utils');
const object = require('./lib/object');

const makePersistentData = storePath => {
  ensureDir(storePath);
  const namespace = path.join(storePath, ' ').trimEnd();
  return object.create(namespace);
};

module.exports = makePersistentData;
