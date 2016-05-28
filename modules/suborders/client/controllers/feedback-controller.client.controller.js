(function() {
  'use strict';

  angular
    .module('suborders')
    .controller('FeedbackController', FeedbackController);

  FeedbackController.$inject = ['$scope', '$state', 'Authentication', 'suborderResolve'];

  function FeedbackController($scope, $state, Authentication, suborder) {
    var vm = this;

    vm.authentication = Authentication;
    vm.suborder = suborder;
    
  }
})();
