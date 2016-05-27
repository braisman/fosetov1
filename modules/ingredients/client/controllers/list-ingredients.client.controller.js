(function () {
  'use strict';

  angular
    .module('ingredients')
    .controller('IngredientsListController', IngredientsListController);

  IngredientsListController.$inject = ['IngredientsService'];

  function IngredientsListController(IngredientsService) {
    var vm = this;

    vm.ingredients = IngredientsService.query();
  }
})();
