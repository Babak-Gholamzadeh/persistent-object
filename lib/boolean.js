const store = require('./store');

exports.create = (namespace, value) => {
  const descriptor = {
    type: 'boolean',
    configurable: true,
    enumerable: true,
    writable: true,
  };
  return store.set(namespace, descriptor, value);
};

exports.convert = (namespace, value) => Boolean(value);
