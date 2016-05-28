(function () {
  'use strict';

  // Suborders controller
  angular
    .module('suborders')
    .controller('SubordersController', SubordersController);

  SubordersController.$inject = ['$scope', '$state', 'Authentication', 'suborderResolve', 'IngredientsService'];

  function SubordersController ($scope, $state, Authentication, suborder, IngredientsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.suborder = suborder;
    vm.ingredients = IngredientsService.query();
    vm.error = null;
    vm.form = {};
    vm.radio = [];
    vm.added = [];
    vm.letters = ['A','B','C','D','E','F'];
    vm.remove = remove;
    vm.save = save;
    vm.addTopping = addTopping;
    vm.updateTopping = updateTopping;
    vm.removeTopping = removeTopping;
    vm.validateIngr = validateIngr;
    vm.generatePass = generatePass;
    vm.toFeedback = toFeedback;

    if(!vm.suborder._id){
      vm.suborder.toppings = [];
      vm.suborder.cost = 0;
    }

    // Remove existing Suborder
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.suborder.$remove($state.go('suborders.list'));
      }
    }

    // Save Suborder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.suborderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.suborder._id) {
        vm.suborder.$update(successCallback, errorCallback);
      } else {

        for(var i = 0; i < vm.suborder.toppings.length; i++){
          var topid = vm.suborder.toppings[i].ingredient;
          for(var j = 0; j < vm.ingredients.length; j++){
            var ingred = vm.ingredients[j];
            if(ingred._id === topid){
              ingred.statistic = ingred.statistic + 1;
              ingred.$update();
            }
          }
        }

        vm.suborder.orderpass = generatePass();

        vm.suborder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('suborders.view', {
          suborderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function addTopping(topping, index) {

      if(vm.radio[index] === 'mucho'){
        vm.suborder.cost = vm.suborder.cost + (topping.cost * 3);
      }
      else if(vm.radio[index] === 'mediano'){
        vm.suborder.cost = vm.suborder.cost + (topping.cost * 2);
      }
      else{
        vm.suborder.cost = vm.suborder.cost + topping.cost;
      }

      // agrega el objeto de prueba
      vm.suborder.toppings.push({ ingredient: topping._id, quantity: vm.radio[index] });
      //fue agregado
      vm.added[index] = true;
    }

    function updateTopping(topping, index){

      if(!vm.suborder._id) {
        vm.suborder.toppings.some = function(topping, length, array, nradio, cost) {
          for(var i = 0; i < length; i++){
            if(array[i].ingredient === topping._id){

              var pradio = array[i].quantity;

              var toppingCost = topping.cost;

              if(pradio === 'mediano'){
                toppingCost = toppingCost*2;
              }
              else if(pradio === 'mucho'){
                toppingCost = toppingCost*3;
              }

              array[i].quantity = nradio;

              cost = cost - toppingCost;

              if(nradio === 'poco'){
                toppingCost = topping.cost;
              }
              else if(nradio === 'mediano'){
                toppingCost = topping.cost*2;
              }
              else if(nradio === 'mucho'){
                toppingCost = topping.cost*3;
              }

              cost = cost + toppingCost;

              return cost;
            }
          }
          return cost;
        };
      }
      else{
        vm.suborder.toppings.some = function(topping, length, array, nradio, cost) {
          for(var i = 0; i < length; i++){
            if(array[i].ingredient._id === topping._id){
              var pradio = array[i].quantity;
              var toppingCost = topping.cost;

              if(pradio === 'mediano'){
                toppingCost = toppingCost*2;
              }
              else if(pradio === 'mucho'){
                toppingCost = toppingCost*3;
              }

              array[i].quantity = nradio;

              cost = cost - toppingCost;

              if(nradio === 'poco'){
                toppingCost = topping.cost;
              }
              else if(nradio === 'mediano'){
                toppingCost = topping.cost*2;
              }
              else if(nradio === 'mucho'){
                toppingCost = topping.cost*3;
              }

              cost = cost + toppingCost;

              return cost;
            }
          }
          return cost;
        };
      }

      vm.suborder.cost = vm.suborder.toppings.some(topping, vm.suborder.toppings.length,
        vm.suborder.toppings, vm.radio[index], vm.suborder.cost);
    }

    function removeTopping(topping, index) {
      // se le agrega fucion
      if(!vm.suborder._id){
        vm.suborder.toppings.some = function(topping, length, array) {
          for(var i = 0; i < length; i++){
            if(array[i].ingredient === topping._id){
              var radio = array[i].quantity;
              var cost = topping.cost;
              if(radio === 'mediano'){
                cost = cost*2;
              }
              else if(radio === 'mucho'){
                cost = cost*3;
              }
              array.splice(i,1);
              return cost;
            }
          }
          return 0;
        };
      }
      else{
        vm.suborder.toppings.some = function(topping, length, array) {
          for(var i = 0; i < length; i++){
            if(array[i].ingredient._id === topping._id){
              var radio = array[i].quantity;
              var cost = topping.cost;
              if(radio === 'mediano'){
                cost = cost*2;
              }
              else if(radio === 'mucho'){
                cost = cost*3;
              }
              array.splice(i,1);
              return cost;
            }
          }
          return 0;
        };
      }

      vm.suborder.cost -= vm.suborder.toppings.some(topping, vm.suborder.toppings.length, vm.suborder.toppings);

      vm.added[index] = false;
    }

    function validateIngr(id, index) {
      //crear
      if(!vm.suborder._id){

        vm.radio[index] = 'poco';

        vm.added[index] = false;
      }
      //editar
      else{
        //se agrega función
        vm.suborder.toppings.some = function (idTop, length, array) {
          for(var i = 0; i < length; i++){
            if(array[i].ingredient._id === idTop){
              return i;
            }
          }
          return -1;
        };

          //si esta en el arreglo
        var toppingIndex = vm.suborder.toppings.some(id, vm.suborder.toppings.length, vm.suborder.toppings);

        if(toppingIndex !== -1){
          vm.added[index] = true;

          vm.radio[index] = vm.suborder.toppings[toppingIndex].quantity;
        }
        else{
          vm.added[index] = false;

          vm.radio[index] = 'poco';
        }
      }
    }

    function generatePass(){
      var intPart = Math.round(Math.random() * 10000);

      var strPart = '';

      for(var i = 0; i < 4; i++){
        var index = Math.round(Math.random() * 10) % vm.letters.length;
        strPart = strPart.concat(vm.letters[index]);
      }

      strPart = strPart.concat(intPart.toString());

      return strPart;
    }

    function toFeedback(){
      vm.suborder.state = 'en proceso';
      vm.suborder.$update();

      $state.go('suborders.feedback', {
        suborderId: vm.suborder._id
      });
    }

  }
})();
