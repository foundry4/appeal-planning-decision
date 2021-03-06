const pinsYup = require('./pins-yup');

describe('pins-yup', () => {
  it('should have a pinsYup.date().isInThePast method defined', () => {
    expect(typeof pinsYup.date().isInThePast).toEqual('function');
  });

  it('should have a pinsYup.date().isWithinDeadlinePeriod method defined', () => {
    expect(typeof pinsYup.date().isWithinDeadlinePeriod).toEqual('function');
  });
});
