(function () {
  'use strict';

  angular
    .module('comentarios')
    .controller('ComentariosListController', ComentariosListController);

  ComentariosListController.$inject = ['ComentariosService'];

  function ComentariosListController(ComentariosService) {
    var vm = this;

    vm.comentarios = ComentariosService.query();
  }
})();
