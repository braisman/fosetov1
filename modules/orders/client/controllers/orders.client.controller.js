(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$scope', '$state', 'Authentication', 'orderResolve', 'IngredientsService'];

  function OrdersController ($scope, $state, Authentication, order, IngredientsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.order = order;
    vm.ingredients = IngredientsService.query();
    vm.error = null;
    vm.form = {};
    vm.radio = [];
    vm.added = [];
    vm.remove = remove;
    vm.save = save;
    vm.addTopping = addTopping;
    vm.updateTopping = updateTopping;
    vm.removeTopping = removeTopping;
    vm.validateIngr = validateIngr;

    if(!vm.order._id){
      vm.order.toppings = [];
      vm.order.cost = 0;
    }

    // Remove existing Order
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.order.$remove($state.go('orders.list'));
      }
    }

    // Save Order
    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.orderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.order._id) {
        vm.order.$update(successCallback, errorCallback);
      }
      else {

        for(var i = 0; i < vm.order.toppings.length; i++){
          var topid = vm.order.toppings[i].ingredient;
          for(var j = 0; j < vm.ingredients.length; j++){
            var ingred = vm.ingredients[j];
            if(ingred._id === topid){
              ingred.statistic = ingred.statistic + 1;
              ingred.$update();
            }
          }
        }

        vm.order.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('orders.view', {
          orderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function addTopping(topping, index) {

      if(vm.radio[index] === 'mucho'){
        vm.order.cost = vm.order.cost + (topping.cost * 3);
      }
      else if(vm.radio[index] === 'mediano'){
        vm.order.cost = vm.order.cost + (topping.cost * 2);
      }
      else{
        vm.order.cost = vm.order.cost + topping.cost;
      }

      // agrega el objeto de prueba
      vm.order.toppings.push({ ingredient: topping._id, quantity: vm.radio[index] });
      //fue agregado
      vm.added[index] = true;
    }

    function updateTopping(topping, index){

      if(!vm.order._id) {
        vm.order.toppings.some = function(topping, length, array, nradio, cost) {
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
        vm.order.toppings.some = function(topping, length, array, nradio, cost) {
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

      vm.order.cost = vm.order.toppings.some(topping, vm.order.toppings.length,
        vm.order.toppings, vm.radio[index], vm.order.cost);

    }

    function removeTopping(topping, index) {
      // se le agrega fucion
      if(!vm.order._id){
        vm.order.toppings.some = function(topping, length, array) {
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
        vm.order.toppings.some = function(topping, length, array) {
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

      vm.order.cost -= vm.order.toppings.some(topping, vm.order.toppings.length, vm.order.toppings);

      vm.added[index] = false;
    }

    function validateIngr(id, index) {
      //crear
      if(!vm.order._id){

        vm.radio[index] = 'poco';

        vm.added[index] = false;
      }
      //editar
      else{
        //se agrega función
        vm.order.toppings.some = function (idTop, length, array) {
          for(var i = 0; i < length; i++){
            if(array[i].ingredient._id === idTop){
              return i;
            }
          }
          return -1;
        };

          //si esta en el arreglo
        var toppingIndex = vm.order.toppings.some(id, vm.order.toppings.length, vm.order.toppings);

        if(toppingIndex !== -1){
          vm.added[index] = true;

          vm.radio[index] = vm.order.toppings[toppingIndex].quantity;
        }
        else{
          vm.added[index] = false;

          vm.radio[index] = 'poco';
        }
      }
    }
  }
})();
