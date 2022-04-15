// dataTypes =
// + 'permitive'  =>  any permitive value
//   'string'     =>  iterable char[] which works as a stream
// + 'array'      =>  array proxy
// + 'object'     =>  object proxy

const realTypeOf = require('realtypeof');
const {
  permitive,
  array,
  object,
} = require('./data-types');

exports.storeValue = ({ namespace, value, descriptor = {} }) => {
  const type = descriptor.type || realTypeOf(value);
  const create = {
    // string: string.create,
    array: array.create,
    object: object.create,
  };
  create[type] || (create[type] = permitive.create);
  return create[type](namespace, value, descriptor);
};

exports.convertValue = ({ namespace, value, type }) => {
  const convert = {
    // string: string.convert,
    array: array.convert,
    object: object.convert,
  };
  convert[type] || (convert[type] = permitive.convert);
  return convert[type](namespace, value);
};
