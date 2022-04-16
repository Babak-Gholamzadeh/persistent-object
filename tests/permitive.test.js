const fs = require('fs');
const makePersistentData = require('../');

const DIR_PATH = '.test.data';

const cleanData = () =>
  fs.existsSync(DIR_PATH) &&
  fs.rmSync(
    DIR_PATH,
    { recursive: true, force: true }
  );


describe(':: Permitive ::', () => {
  let persistentData;

  beforeEach(() => {
    cleanData();
    persistentData = makePersistentData(DIR_PATH);
  });

  afterAll(cleanData);

  it('Should store NUMBER value and then retrieve it', () => {
    const num = 456.45;
    persistentData.myNumber = 456.45;
    expect(persistentData.myNumber).toBe(num);
  });

  it('Should store BOOLEAN value and then retrieve it', () => {
    const bool1 = true;
    const bool2 = false;
    persistentData.myBool1 = bool1;
    persistentData.myBool2 = bool2;
    expect(persistentData.myBool1).toBe(bool1);
    expect(persistentData.myBool2).toBe(bool2);
  });

  it('Should store NULL value and then retrieve it', () => {
    persistentData.myNull = null;
    expect(persistentData.myNull).toBe(null);
  });

});
