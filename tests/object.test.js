const makePersistentData = require('../');
const {
  cleanData,
  constants: {
    DIR_PATH
  },
} = require('./helpers');

const obj = {
  intNum: 456,
  floatNum: 456.45,
  zeroNum: 0,
  negIntNum: -456,
  negFloatNum: -456.45,
  trueBool: true,
  falseBool: false,
  nullValue: null,
};

describe(':: OBJECT ::', () => {
  let persistentData;

  beforeEach(() => {
    cleanData();
    persistentData = makePersistentData(DIR_PATH);
  });

  afterAll(cleanData);

  it('Should store a one level OBJECT with PERMITIVE values and then retrieve the values via their key', () => {
    persistentData.obj = obj;

    expect(typeof persistentData.obj).toBe('object');
    expect(persistentData.obj).not.toBe(obj);
    expect(typeof persistentData.obj.intNum).toBe('number');
    expect(persistentData.obj.intNum).toBe(obj.intNum);
    expect(typeof persistentData.obj.floatNum).toBe('number');
    expect(persistentData.obj.floatNum).toBe(obj.floatNum);
    expect(typeof persistentData.obj.zeroNum).toBe('number');
    expect(persistentData.obj.zeroNum).toBe(obj.zeroNum);
    expect(typeof persistentData.obj.negIntNum).toBe('number');
    expect(persistentData.obj.negIntNum).toBe(obj.negIntNum);
    expect(typeof persistentData.obj.negFloatNum).toBe('number');
    expect(persistentData.obj.negFloatNum).toBe(obj.negFloatNum);
    expect(typeof persistentData.obj.trueBool).toBe('boolean');
    expect(persistentData.obj.trueBool).toBe(obj.trueBool);
    expect(typeof persistentData.obj.falseBool).toBe('boolean');
    expect(persistentData.obj.falseBool).toBe(obj.falseBool);
    expect(typeof persistentData.obj.nullValue).toBe('object');
    expect(persistentData.obj.nullValue).toBe(obj.nullValue);
  });

  it('Should store a copy of other objects', () => {
    persistentData.obj = obj;

    persistentData.obj.intNum = 798;
    persistentData.obj.floatNum = 798.79;
    persistentData.obj.zeroNum = NaN;
    persistentData.obj.negIntNum = -798;
    persistentData.obj.negFloatNum = -798.79;
    persistentData.obj.trueBool = false;
    persistentData.obj.falseBool = true;
    persistentData.obj.nullValue = 0;

    expect(persistentData.obj.intNum).not.toBe(obj.intNum);
    expect(persistentData.obj.floatNum).not.toBe(obj.floatNum);
    expect(persistentData.obj.zeroNum).not.toBe(obj.zeroNum);
    expect(persistentData.obj.negIntNum).not.toBe(obj.negIntNum);
    expect(persistentData.obj.negFloatNum).not.toBe(obj.negFloatNum);
    expect(persistentData.obj.trueBool).not.toBe(obj.trueBool);
    expect(persistentData.obj.falseBool).not.toBe(obj.falseBool);
    expect(persistentData.obj.nullValue).not.toBe(obj.nullValue);
  });

  it('Should return a ref object when using as RHS', () => {
    persistentData.obj = obj;

    const obj2 = persistentData.obj;
    obj2.intNum = 798;
    obj2.floatNum = 798.79;
    obj2.zeroNum = NaN;
    obj2.negIntNum = -798;
    obj2.negFloatNum = -798.79;
    obj2.trueBool = false;
    obj2.falseBool = true;
    obj2.nullValue = 0;

    expect(obj2.intNum).toBe(persistentData.obj.intNum);
    expect(obj2.floatNum).toBe(persistentData.obj.floatNum);
    expect(obj2.zeroNum).toBe(persistentData.obj.zeroNum);
    expect(obj2.negIntNum).toBe(persistentData.obj.negIntNum);
    expect(obj2.negFloatNum).toBe(persistentData.obj.negFloatNum);
    expect(obj2.trueBool).toBe(persistentData.obj.trueBool);
    expect(obj2.falseBool).toBe(persistentData.obj.falseBool);
    expect(obj2.nullValue).toBe(persistentData.obj.nullValue);
  });

  it('Should work properly with "Object.keys" method', () => {
    persistentData.obj = obj;

    const objKeys = Object.keys(obj);
    const persistentObjKeys = Object.keys(persistentData.obj);

    expect(persistentObjKeys.length).toBe(objKeys.length);
    expect(persistentObjKeys).toEqual(expect.arrayContaining(objKeys));
  });

  it('Should work properly with "Object.values" method', () => {
    persistentData.obj = obj;

    const objValues = Object.values(obj);
    const persistentObjValues = Object.values(persistentData.obj);

    expect(persistentObjValues.length).toBe(objValues.length);
    expect(persistentObjValues).toEqual(expect.arrayContaining(objValues));
  });

  it('Should work properly with "Object.entries" method', () => {
    persistentData.obj = obj;

    const objEntries = Object.entries(obj);
    const persistentObjEntries = Object.entries(persistentData.obj);
    const objEntriesSortedByKey = objEntries
      .sort(([k1], [k2]) => (k1 < k2) ? -1 : ((k1 > k2) ? 1 : 0));
    const persistentObjEntriesSortedByKey = objEntries
      .sort(([k1], [k2]) => (k1 < k2) ? -1 : ((k1 > k2) ? 1 : 0));

    expect(persistentObjEntries.length).toBe(objEntries.length);
    for (let i = 0; i < objEntriesSortedByKey.length; i++) {
      expect(persistentObjEntriesSortedByKey[i]).toEqual(objEntriesSortedByKey[i]);
    }
  });

  it('Should work properly with "Object.prototype.hasOwnProperty" operation', () => {
    persistentData.obj = obj;

    expect(persistentData.hasOwnProperty('obj')).toBe(true);
    expect(persistentData.hasOwnProperty('obj2')).toBe(false);
    expect(persistentData.obj.hasOwnProperty('intNum')).toBe(true);
    expect(persistentData.obj.hasOwnProperty('intNum2')).toBe(false);
  });

  it('Should work properly with "in" operation', () => {
    persistentData.obj = obj;

    expect('obj' in persistentData).toBe(true);
    expect('obj2' in persistentData).toBe(false);
    expect('intNum' in persistentData.obj).toBe(true);
    expect('intNum2' in persistentData.obj).toBe(false);
  });

  it('Should work properly with "delete" operation', () => {
    persistentData.obj = obj;

    delete persistentData.obj.intNum;
    expect(persistentData.obj.intNum).not.toBeDefined();
    expect(obj.intNum).toBeDefined();

    delete persistentData.obj;
    expect(persistentData.obj).not.toBeDefined();
    expect(obj).toBeDefined();
  });

  it('Should work properly with nested objects', () => {
    const nestedObj = {
      ...obj,
      obj: {
        ...obj,
      },
    };
    persistentData.nestedObj = nestedObj;

    const objKeys = Object.keys(obj);
    const nestedObjKeys = Object.keys(nestedObj);
    const persistentNestedObjKeys = Object.keys(persistentData.nestedObj);
    const persistentObjKeys = Object.keys(persistentData.nestedObj.obj);

    expect(typeof persistentData.nestedObj.obj).toBe('object');
    expect(persistentNestedObjKeys.length).toBe(nestedObjKeys.length);
    expect(persistentNestedObjKeys).toEqual(expect.arrayContaining(nestedObjKeys));
    expect(persistentObjKeys.length).toBe(objKeys.length);
    expect(persistentObjKeys).toEqual(expect.arrayContaining(objKeys));
  });
});
