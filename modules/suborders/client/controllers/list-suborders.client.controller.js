(function () {
  'use strict';

  angular
    .module('suborders')
    .controller('SubordersListController', SubordersListController);

  SubordersListController.$inject = ['SubordersService', 'Authentication'];

  function SubordersListController(SubordersService, Authentication) {
    var vm = this;

    vm.suborders = SubordersService.query();
    vm.user = Authentication.user;
  }
})();
