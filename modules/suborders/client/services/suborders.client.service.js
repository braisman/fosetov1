//Suborders service used to communicate Suborders REST endpoints
(function () {
  'use strict';

  angular
    .module('suborders')
    .factory('SubordersService', SubordersService);

  SubordersService.$inject = ['$resource'];

  function SubordersService($resource) {
    return $resource('api/suborders/:suborderId', {
      suborderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
