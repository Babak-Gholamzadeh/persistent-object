const makePersistentData = require('../');
const {
  cleanData,
  constants: {
    DIR_PATH
  },
} = require('./helpers');

describe(':: PERMITIVE ::', () => {
  let persistentData;

  beforeEach(() => {
    cleanData();
    persistentData = makePersistentData(DIR_PATH);
  });

  afterAll(cleanData);

  it('Should store any NUMBER values and then retrieve them', () => {
    const intNum = 456;
    const floatNum = 456.45;
    const zeroNum = 0;
    const negIntNum = -456;
    const negFloatNum = -456.45;
    persistentData.intNum = intNum;
    persistentData.floatNum = floatNum;
    persistentData.zeroNum = zeroNum;
    persistentData.negIntNum = negIntNum;
    persistentData.negFloatNum = negFloatNum;

    expect(typeof persistentData.intNum).toBe('number');
    expect(persistentData.intNum).toBe(intNum);
    expect(typeof persistentData.floatNum).toBe('number');
    expect(persistentData.floatNum).toBe(floatNum);
    expect(typeof persistentData.zeroNum).toBe('number');
    expect(persistentData.zeroNum).toBe(zeroNum);
    expect(typeof persistentData.negIntNum).toBe('number');
    expect(persistentData.negIntNum).toBe(negIntNum);
    expect(typeof persistentData.negFloatNum).toBe('number');
    expect(persistentData.negFloatNum).toBe(negFloatNum);
  });

  it('Should store any BOOLEAN values and then retrieve them', () => {
    const trueBool = true;
    const falseBool = false;
    persistentData.trueBool = trueBool;
    persistentData.falseBool = falseBool;

    expect(typeof persistentData.trueBool).toBe('boolean');
    expect(persistentData.trueBool).toBe(trueBool);
    expect(typeof persistentData.falseBool).toBe('boolean');
    expect(persistentData.falseBool).toBe(falseBool);
  });

  it('Should store a NULL value and then retrieve it', () => {
    persistentData.nullValue = null;
    
    expect(typeof persistentData.nullValue).toBe('object');
    expect(persistentData.nullValue).toBe(null);
  });
});
