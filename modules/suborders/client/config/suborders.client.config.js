(function () {
  'use strict';

  angular
    .module('suborders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Suborden',
      state: 'suborders',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'suborders', {
      title: 'listado de subordenes',
      state: 'suborders.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'suborders', {
      title: 'Crear Subordenes',
      state: 'suborders.create',
      roles: ['user', 'admin']
    });
  }
})();
