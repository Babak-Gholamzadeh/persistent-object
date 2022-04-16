const makePersistentData = require('../');
const {
  cleanData,
  constants: {
    DIR_PATH
  },
} = require('./helpers');

describe(':: ARRAY ::', () => {
  let persistentData;

  beforeEach(() => {
    cleanData();
    persistentData = makePersistentData(DIR_PATH);
  });

  afterAll(cleanData);

  it('Should store a one level ARRAY with PERMITIVE values and then retrieve the values via their index', () => {

  });

});
