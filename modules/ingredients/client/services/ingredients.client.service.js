//Ingredients service used to communicate Ingredients REST endpoints
(function () {
  'use strict';

  angular
    .module('ingredients')
    .factory('IngredientsService', IngredientsService);

  IngredientsService.$inject = ['$resource'];

  function IngredientsService($resource) {
    return $resource('api/ingredients/:ingredientId', {
      ingredientId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
