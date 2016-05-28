(function () {
  'use strict';

  angular
    .module('comentarios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('comentarios', {
        abstract: true,
        url: '/comentarios',
        template: '<ui-view/>'
      })
      .state('comentarios.list', {
        url: '',
        templateUrl: 'modules/comentarios/client/views/list-comentarios.client.view.html',
        controller: 'ComentariosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Comentarios List'
        }
      })
/*      .state('comentarios.create', {
        url: '/create',
        templateUrl: 'modules/comentarios/client/views/form-comentario.client.view.html',
        controller: 'ComentariosController',
        controllerAs: 'vm',
        resolve: {
          comentarioResolve: newComentario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Comentarios Create'
        }
      })*/
      .state('home', {
        url: '/',
        templateUrl: 'modules/comentarios/client/views/form-comentario.client.view.html',
        controller: 'ComentariosController',
        controllerAs: 'vm',
        resolve: {
          comentarioResolve: newComentario
        },
        data: {
          //roles: ['user', 'admin'],
          pageTitle : 'Comentarios Create'
        }
      })
      .state('comentarios.edit', {
        url: '/:comentarioId/edit',
        templateUrl: 'modules/comentarios/client/views/form-comentario.client.view.html',
        controller: 'ComentariosController',
        controllerAs: 'vm',
        resolve: {
          comentarioResolve: getComentario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Comentario {{ comentarioResolve.name }}'
        }
      })
      .state('comentarios.view', {
        url: '/:comentarioId',
        templateUrl: 'modules/comentarios/client/views/view-comentario.client.view.html',
        controller: 'ComentariosController',
        controllerAs: 'vm',
        resolve: {
          comentarioResolve: getComentario
        },
        data:{
          pageTitle: 'Comentario {{ articleResolve.name }}'
        }
      });
  }

  getComentario.$inject = ['$stateParams', 'ComentariosService'];

  function getComentario($stateParams, ComentariosService) {
    return ComentariosService.get({
      comentarioId: $stateParams.comentarioId
    }).$promise;
  }

  newComentario.$inject = ['ComentariosService'];

  function newComentario(ComentariosService) {
    return new ComentariosService();
  }
})();
