const realTypeOf = require('realtypeof');
const { createNamespace } = require('../../utils');
const store = require('../store');
const controller = require('../controller');

const LENGTH = 'length';

const setArrayLength = (namespace, value) =>
  controller.storeValue({
    namespace: createNamespace(namespace, LENGTH),
    value,
    descriptor: {
      configurable: false,
      enumerable: false,
    },
  });

const handleArrayLength = (namespace, key, value) => {
  const {
    value: currLen = 0
  } = store.get(createNamespace(namespace, LENGTH));
  if (key === LENGTH) {
    for (let i = value; i < currLen; i++)
      store.del(createNamespace(namespace, i));
  } else {
    if (key >= currLen) {
      setArrayLength(namespace, +key + 1);
    }
  }
};

const prototype = namespace => ({
  push(...items) {
    let { value: length = 0 } = store
      .get(createNamespace(namespace, LENGTH));
    for (const item of items)
      controller
        .storeValue({
          namespace: createNamespace(namespace, length++),
          value: item,
        });
    setArrayLength(namespace, length);
    return length;
  },
  pop() {
    let { value: length = 0 } = store
      .get(createNamespace(namespace, LENGTH));
    if (!length)
      return;
    length--;
    const valueOf = getValueOf(createNamespace(namespace, length));
    handleArrayLength(namespace, LENGTH, length);
    return valueOf;
  },
  unshift(...items) {
    let { value: length = 0 } = store
      .get(createNamespace(namespace, LENGTH));
    store
      .getKeysStartWith(namespace)
      .filter(n => Number.isInteger(+n))
      .sort((a, b) => b - a)
      .forEach(index => store
        .renameKey({
          namespace,
          oldKey: index,
          newKey: (+index + items.length).toString(),
        }));
    for (let i = 0; i < items.length; i++) {
      const value = items[i];
      controller
        .storeValue({
          namespace: createNamespace(namespace, i),
          value,
        });
      length++;
    }
    setArrayLength(namespace, length);
    return length;
  },
  shift() {
    let { value: length = 0 } = store
      .get(createNamespace(namespace, LENGTH));
    if (!length)
      return;
    const valueOf = getValueOf(createNamespace(namespace, '0'));
    store.del(createNamespace(namespace, '0'));
    store
      .getKeysStartWith(namespace)
      .filter(n => Number.isInteger(+n))
      .sort((a, b) => a - b)
      .forEach(index => store
        .renameKey({
          namespace,
          oldKey: index,
          newKey: (index - 1).toString(),
        }));
    length--;
    setArrayLength(namespace, length);
    return valueOf;
  }
});

const getValueOf = namespace => {
  const {
    value,
    descriptor: { type },
  } = store.get(namespace);
  if (!['array', 'object'].includes(type))
    return value;
  let initValue = {};
  if (type === 'array') {
    const { value: length } = store
      .get(createNamespace(namespace, LENGTH));
    initValue = Array.from({ length });
  }
  return store
    .getKeysStartWith(namespace)
    .reduce((acc, k) => {
      acc[k] = getValueOf(createNamespace(namespace, k));
      return acc;
    }, initValue);
};

const makeHandler = namespace => ({
  set(target, key, value) {
    console.log('@A-S', 'k:', key, 'v:', value);
    handleArrayLength(namespace, key, value);
    store.del(createNamespace(namespace, key));
    return controller
      .storeValue({
        namespace: createNamespace(namespace, key),
        value,
      });
  },
  get(target, key) {
    console.log('@A-G', 'k:', key, 'np:', namespace);
    const {
      value,
      descriptor,
    } = store.get(createNamespace(namespace, key));
    if (realTypeOf.isUndefined(descriptor))
      return prototype(namespace)[key];
    return controller
      .convertValue({
        namespace: createNamespace(namespace, key),
        value,
        type: descriptor.type,
      });
  },
  deleteProperty(target, key) {
    console.log('@A-DP', createNamespace(namespace, key));
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

exports.create = (namespace, value, descriptorOption = {}) => {
  console.log('@A-C');
  if (value) {
    const descriptor = {
      type: 'array',
      configurable: true,
      enumerable: true,
      writable: true,
      ...descriptorOption,
    };
    store.set({ namespace, descriptor });
    setArrayLength(namespace, value.length);
    for (let i = 0; i < value.length; i++) {
      controller.storeValue({
        namespace: createNamespace(namespace, i),
        value: value[i],
      });
    }
  }
  return new Proxy([], makeHandler(namespace));
};

exports.convert = exports.create;
