(function () {
  'use strict';

  angular
    .module('ingredients')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Ingredients',
      state: 'ingredients',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'ingredients', {
      title: 'List Ingredients',
      state: 'ingredients.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'ingredients', {
      title: 'Create Ingredient',
      state: 'ingredients.create',
      roles: ['admin']
    });
  }
})();
