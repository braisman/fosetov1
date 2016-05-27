'use strict';

describe('Suborders E2E Tests:', function () {
  describe('Test Suborders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/suborders');
      expect(element.all(by.repeater('suborder in suborders')).count()).toEqual(0);
    });
  });
});
