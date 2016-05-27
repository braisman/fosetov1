(function () {
  'use strict';

  angular
    .module('suborders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('suborders', {
        abstract: true,
        url: '/suborders',
        template: '<ui-view/>'
      })
      .state('suborders.list', {
        url: '',
        templateUrl: 'modules/suborders/client/views/list-suborders.client.view.html',
        controller: 'SubordersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Suborders List'
        }
      })
      .state('suborders.create', {
        url: '/create',
        templateUrl: 'modules/suborders/client/views/form-suborder.client.view.html',
        controller: 'SubordersController',
        controllerAs: 'vm',
        resolve: {
          suborderResolve: newSuborder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Suborders Create'
        }
      })
      .state('suborders.edit', {
        url: '/:suborderId/edit',
        templateUrl: 'modules/suborders/client/views/form-suborder.client.view.html',
        controller: 'SubordersController',
        controllerAs: 'vm',
        resolve: {
          suborderResolve: getSuborder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Suborder {{ suborderResolve.name }}'
        }
      })
      .state('suborders.view', {
        url: '/:suborderId',
        templateUrl: 'modules/suborders/client/views/view-suborder.client.view.html',
        controller: 'SubordersController',
        controllerAs: 'vm',
        resolve: {
          suborderResolve: getSuborder
        },
        data:{
          pageTitle: 'Suborder {{ articleResolve.name }}'
        }
      });
  }

  getSuborder.$inject = ['$stateParams', 'SubordersService'];

  function getSuborder($stateParams, SubordersService) {
    return SubordersService.get({
      suborderId: $stateParams.suborderId
    }).$promise;
  }

  newSuborder.$inject = ['SubordersService'];

  function newSuborder(SubordersService) {
    return new SubordersService();
  }
})();
