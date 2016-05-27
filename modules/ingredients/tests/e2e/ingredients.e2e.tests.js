'use strict';

describe('Ingredients E2E Tests:', function () {
  describe('Test Ingredients page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ingredients');
      expect(element.all(by.repeater('ingredient in ingredients')).count()).toEqual(0);
    });
  });
});
