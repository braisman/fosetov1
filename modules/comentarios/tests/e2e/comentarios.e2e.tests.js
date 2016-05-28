'use strict';

describe('Comentarios E2E Tests:', function () {
  describe('Test Comentarios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/comentarios');
      expect(element.all(by.repeater('comentario in comentarios')).count()).toEqual(0);
    });
  });
});
