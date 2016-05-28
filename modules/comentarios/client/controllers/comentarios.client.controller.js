/*(function () {
  'use strict';

  // Comentarios controller
  angular
    .module('comentarios')
    .controller('ComentariosController', ComentariosController);

  ComentariosController.$inject = ['$scope', '$state', 'Authentication', 'comentarioResolve'];

  function ComentariosController ($scope, $state, Authentication, comentario) {
    var vm = this;

    vm.authentication = Authentication;
    vm.comentario = comentario;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Comentario
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.comentario.$remove($state.go('comentarios.list'));
      }
    }

    // Save Comentario
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.comentarioForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.comentario._id) {
        vm.comentario.$update(successCallback, errorCallback);
      } else {
        vm.comentario.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('comentarios.view', {
          comentarioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
*/


(function () {
  'use strict';

  // Comentarios controller
  angular
    .module('comentarios')
    .controller('ComentariosController', ComentariosController);

  ComentariosController.$inject = ['$scope', '$state', 'Authentication', 'comentarioResolve', 'ComentariosService'];

  function ComentariosController ($scope, $state, Authentication, comentario, ComentariosService, Google) {
    var vm = this;
    vm.comentarioHechos = ComentariosService.query();
    vm.authentication = Authentication;
    vm.comentario = comentario;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    // Remove existing Comentario
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.comentario.$remove($state.go('home'));
      }
    }

    // Save Comentario
    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.comentarioForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.comentario._id) {
        vm.comentario.$update(successCallback, errorCallback);
      } else {
        vm.comentario.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.comentarioHechos = ComentariosService.query();
        vm.comentario.name = '';
        $state.reload('home');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
