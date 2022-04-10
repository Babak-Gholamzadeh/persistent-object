const realTypeOf = require('realtypeof');
const { createNamespace } = require('../utils');
const store = require('./store');
const controller = require('./controller');

const makeHandler = namespace => ({
  set(target, key, value) {
    console.log('@A-S', 'k:', key, 'v:', value);
    store.del(createNamespace(namespace, key));
    return controller
      .storeValueBasedOnType(
        createNamespace(namespace, key),
        value,
        realTypeOf(value),
      );
  },
  get(target, key) {
    console.log('@A-G', 'k:', key, 'np:', namespace);
    const {
      value,
      descriptor,
    } = store.get(createNamespace(namespace, key));
    if(realTypeOf.isUndefined(descriptor))
      return target[key];
    return controller
      .convertValueBasedOnType(
        createNamespace(namespace, key),
        value,
        descriptor.type,
      );
  },
  deleteProperty(target, key) {
    console.log('@A-DP', createNamespace(namespace, key));
    store.del(createNamespace(namespace, key));
    return true;
  },
  has(target, key) {
    console.log('@H', key);
    // const { descriptor } = store.get(createNamespace(namespace, key));
    // return !!descriptor;
  },
  ownKeys(target) {
    console.log('@OK', namespace);
    // return store.getKeysStartWith(namespace);
  },
  getOwnPropertyDescriptor(target, key) {
    console.log('@PD', key);
    // const { descriptor } = store.get(createNamespace(namespace, key));
    // return descriptor;
  },
});

exports.create = (namespace, value) => {
  console.log('@A-C');
  if (value) {
    const descriptor = {
      type: 'array',
      configurable: true,
      enumerable: true,
      writable: true,
    };
    store.set(namespace, descriptor);
    controller.storeValueBasedOnType(
      createNamespace(namespace, 'length'),
      value.length,
      realTypeOf(value.length),
    );
    for (let i = 0; i < value.length; i++) {
      controller.storeValueBasedOnType(
        createNamespace(namespace, i.toString()),
        value[i],
        realTypeOf(value[i]),
      );
    }
  }
  return new Proxy([], makeHandler(namespace));
};

exports.convert = exports.create;
