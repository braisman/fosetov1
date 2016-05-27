(function () {
  'use strict';

  angular
    .module('orders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Orden',
      state: 'orders',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'orders', {
      title: 'Lista de ordenes',
      state: 'orders.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'orders', {
      title: 'Crear una roden',
      state: 'orders.create',
      roles: ['user', 'admin']
    });
  }
})();
