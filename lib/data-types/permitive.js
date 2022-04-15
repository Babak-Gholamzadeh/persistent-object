const realTypeOf = require('realtypeof');
const store = require('../store');

exports.create = (namespace, value, descriptorOption = {}) => {
  const descriptor = {
    type: realTypeOf(value),
    configurable: true,
    enumerable: true,
    writable: true,
    ...descriptorOption,
  };
  return store.set({ namespace, value, descriptor });
};

exports.convert = value => value;
