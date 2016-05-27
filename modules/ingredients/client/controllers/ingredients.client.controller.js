(function () {
  'use strict';

  // Ingredients controller
  angular
    .module('ingredients')
    .controller('IngredientsController', IngredientsController);

  IngredientsController.$inject = ['$scope', '$state', 'Authentication', 'ingredientResolve'];

  function IngredientsController ($scope, $state, Authentication, ingredient) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ingredient = ingredient;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ingredient
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.ingredient.$remove($state.go('ingredients.list'));
      }
    }

    // Save Ingredient
    function save(isValid) {
      vm.ingredient.statistic = 0;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ingredientForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ingredient._id) {
        vm.ingredient.$update(successCallback, errorCallback);
      } else {
        vm.ingredient.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ingredients.view', {
          ingredientId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
