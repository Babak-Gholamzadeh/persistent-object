const fs = require('fs');
const path = require('path');
const { ensureDir, createNamespace } = require('../utils');
const realTypeOf = require('realtypeof');

const VALUE = 'value';
const DESCRIPTOR = 'descriptor';

const set = ({ namespace, value, descriptor }) => {
  ensureDir(namespace);
  fs.writeFileSync(
    path.join(namespace, DESCRIPTOR),
    JSON.stringify(descriptor)
  );
  !realTypeOf.isUndefined(value) &&
    fs.writeFileSync(
      path.join(namespace, VALUE),
      JSON.stringify(value)
    );
  return true;
};

const get = namespace => {
  if (!fs.existsSync(namespace))
    return {};
  const descriptor = JSON.parse(
    fs.readFileSync(
      path.join(namespace, DESCRIPTOR), 'utf-8'
    )
  );
  const value = fs
    .existsSync(
      path.join(namespace, VALUE)
    ) ?
    JSON.parse(
      fs.readFileSync(
        path.join(namespace, VALUE),
        'utf-8'
      )
    ) :
    undefined;
  return {
    descriptor,
    value,
  };
};

const del = namespace =>
  fs
    .readdirSync(
      path.dirname(namespace)
    )
    .filter(f => f
      .startsWith(
        path.basename(namespace)
      )
    )
    .forEach(f => fs.
      rmSync(
        path.join(
          path.dirname(namespace),
          f
        ),
        { recursive: true, force: true }
      )
    );

const getKeysStartWith = namespace => {
  const { dir, base } = splitDirBase(namespace);
  return fs
    .readdirSync(dir)
    .filter(f =>
      f.startsWith(base) &&
      (
        f.length === base.length ||
        f[base.length] === '.'
      )
    )
    .map(f => f.substring(base.length).split('.')[1])
    .reduce((acc, f, i, l) => {
      f && acc.add(f);
      if (i === l.length - 1)
        return [...acc];
      return acc;
    }, new Set());
};

const renameKey = ({ namespace, oldKey, newKey }) => {
  const { dir, base } = splitDirBase(namespace);
  fs
    .readdirSync(dir)
    .filter(f =>
      f.startsWith(createNamespace(base, oldKey)) &&
      (
        f.length === createNamespace(base, oldKey).length ||
        f[createNamespace(base, oldKey).length] === '.'
      )
    )
    .map(f => ({
      oldName: f,
      newName: createNamespace(
        base,
        newKey,
      ) + f.substring(base.length + oldKey.length + 1),
    }))
    .forEach(({ oldName, newName }) => fs
      .renameSync(
        path.join(dir, oldName),
        path.join(dir, newName),
      )
    )
};

const splitDirBase = namespace => ({
  dir: path.dirname(namespace) === '.' ? namespace : path.dirname(namespace),
  base: path.dirname(namespace) === '.' ? '' : path.basename(namespace),
});

module.exports = {
  set,
  get,
  del,
  getKeysStartWith,
  renameKey,
};
