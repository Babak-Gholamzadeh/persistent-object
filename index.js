const path = require('path');
const { ensureDir } = require('./utils');
const controller = require('./lib/controller');

const makePersistentData = storePath => {
  ensureDir(storePath);
  const namespace = path.join(storePath, ' ').trimEnd();
  return controller.storeValue({
    namespace,
    descriptor: { type: 'object' },
  });
};

module.exports = makePersistentData;
