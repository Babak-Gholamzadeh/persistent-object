// dataType =
// + 'number'   =>  permitive number value
// + 'boolean'  =>  permitive boolean value
//   'null'     =>  permitive null value
// - 'date'     =>  permitive date value
//   'string'   =>  iterable char[] which works as a stream
//   'array'    =>  array proxy
// + 'object'   =>  object proxy

const number = require('./number');
const boolean = require('./boolean');
const object = require('./object');
const array = require('./array');

exports.storeValueBasedOnType = (namespace, value, type) => {
  const create = {
    number: number.create,
    boolean: boolean.create,
    // null: createNull,
    // string: createString,
    array: array.create,
    object: object.create,
  };
  return create[type](namespace, value);
};

exports.convertValueBasedOnType = (namespace, value, type) => {
  const convert = {
    number: number.convert,
    boolean: boolean.convert,
    // null: createNull,
    // string: createString,
    array: array.convert,
    object: object.convert,
  };
  return convert[type](namespace, value);
};
