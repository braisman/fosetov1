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

    vm.onClick = onClick;

    function onClick(suborder){
      if(suborder.state === 'en espera'){
        $state.go('suborders.view', {
          suborderId: suborder._id
        });
      }
      else if(suborder.state === 'en proceso'){
        $state.go('suborders.feedback', {
          suborderId: suborder._id
        });
      }
    }

  }
})();
