//Comentarios service used to communicate Comentarios REST endpoints
(function () {
  'use strict';

  angular
    .module('comentarios')
    .factory('ComentariosService', ComentariosService);

  ComentariosService.$inject = ['$resource'];

  function ComentariosService($resource) {
    return $resource('api/comentarios/:comentarioId', {
      comentarioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
