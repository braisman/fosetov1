(function () {
  'use strict';

  angular
    .module('ingredients')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ingredients', {
        abstract: true,
        url: '/ingredients',
        template: '<ui-view/>'
      })
      .state('ingredients.list', {
        url: '',
        templateUrl: 'modules/ingredients/client/views/list-ingredients.client.view.html',
        controller: 'IngredientsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ingredients List'
        }
      })
      .state('ingredients.create', {
        url: '/create',
        templateUrl: 'modules/ingredients/client/views/form-ingredient.client.view.html',
        controller: 'IngredientsController',
        controllerAs: 'vm',
        resolve: {
          ingredientResolve: newIngredient
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Ingredients Create'
        }
      })
      .state('ingredients.edit', {
        url: '/:ingredientId/edit',
        templateUrl: 'modules/ingredients/client/views/form-ingredient.client.view.html',
        controller: 'IngredientsController',
        controllerAs: 'vm',
        resolve: {
          ingredientResolve: getIngredient
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Ingredient {{ ingredientResolve.name }}'
        }
      })
      .state('ingredients.view', {
        url: '/:ingredientId',
        templateUrl: 'modules/ingredients/client/views/view-ingredient.client.view.html',
        controller: 'IngredientsController',
        controllerAs: 'vm',
        resolve: {
          ingredientResolve: getIngredient
        },
        data:{
          pageTitle: 'Ingredient {{ articleResolve.name }}'
        }
      });
  }

  getIngredient.$inject = ['$stateParams', 'IngredientsService'];

  function getIngredient($stateParams, IngredientsService) {
    return IngredientsService.get({
      ingredientId: $stateParams.ingredientId
    }).$promise;
  }

  newIngredient.$inject = ['IngredientsService'];

  function newIngredient(IngredientsService) {
    return new IngredientsService();
  }
})();
