const realTypeOf = require('realtypeof');
const { createNamespace } = require('../utils');
const store = require('./store');
const controller = require('./controller');

const makeHandler = namespace => ({
  set(target, key, value) {
    console.log('@O-S', 'k:', key, 'v:', value);
    store.del(createNamespace(namespace, key));
    return controller
      .storeValueBasedOnType(
        createNamespace(namespace, key),
        value,
        realTypeOf(value),
      );
  },
  get(target, key) {
    console.log('@O-G', 'k:', key, 'np:', namespace);
    const {
      value,
      descriptor,
    } = store.get(createNamespace(namespace, key));
    return descriptor && controller
      .convertValueBasedOnType(
        createNamespace(namespace, key),
        value,
        descriptor.type,
      );
  },
  deleteProperty(target, key) {
    console.log('@O-DP', createNamespace(namespace, key));
    store.del(createNamespace(namespace, key));
    return true;
  },
  has(target, key) {
    console.log('@H', key);
    const { descriptor } = store.get(createNamespace(namespace, key));
    return !!descriptor;
  },
  ownKeys(target) {
    console.log('@OK', namespace);
    return store.getKeysStartWith(namespace);
  },
  getOwnPropertyDescriptor(target, key) {
    console.log('@PD', key);
    const { descriptor } = store.get(createNamespace(namespace, key));
    return descriptor;
  },
});

exports.create = (namespace, value) => {
  console.log('@O-C');
  if (value) {
    const descriptor = {
      type: 'object',
      configurable: true,
      enumerable: true,
      writable: true,
    };
    store.set(namespace, descriptor);
    Object
      .entries(value)
      .forEach(([k, v]) => controller
        .storeValueBasedOnType(
          createNamespace(namespace, k), v, realTypeOf(v)
        )
      );
  }
  return new Proxy({}, makeHandler(namespace));
};

exports.convert = exports.create;
