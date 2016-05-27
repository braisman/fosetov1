(function () {
  'use strict';

  describe('Ingredients Route Tests', function () {
    // Initialize global variables
    var $scope,
      IngredientsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _IngredientsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      IngredientsService = _IngredientsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ingredients');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ingredients');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          IngredientsController,
          mockIngredient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ingredients.view');
          $templateCache.put('modules/ingredients/client/views/view-ingredient.client.view.html', '');

          // create mock Ingredient
          mockIngredient = new IngredientsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ingredient Name'
          });

          //Initialize Controller
          IngredientsController = $controller('IngredientsController as vm', {
            $scope: $scope,
            ingredientResolve: mockIngredient
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ingredientId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ingredientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ingredientId: 1
          })).toEqual('/ingredients/1');
        }));

        it('should attach an Ingredient to the controller scope', function () {
          expect($scope.vm.ingredient._id).toBe(mockIngredient._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ingredients/client/views/view-ingredient.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          IngredientsController,
          mockIngredient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ingredients.create');
          $templateCache.put('modules/ingredients/client/views/form-ingredient.client.view.html', '');

          // create mock Ingredient
          mockIngredient = new IngredientsService();

          //Initialize Controller
          IngredientsController = $controller('IngredientsController as vm', {
            $scope: $scope,
            ingredientResolve: mockIngredient
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ingredientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ingredients/create');
        }));

        it('should attach an Ingredient to the controller scope', function () {
          expect($scope.vm.ingredient._id).toBe(mockIngredient._id);
          expect($scope.vm.ingredient._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ingredients/client/views/form-ingredient.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          IngredientsController,
          mockIngredient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ingredients.edit');
          $templateCache.put('modules/ingredients/client/views/form-ingredient.client.view.html', '');

          // create mock Ingredient
          mockIngredient = new IngredientsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ingredient Name'
          });

          //Initialize Controller
          IngredientsController = $controller('IngredientsController as vm', {
            $scope: $scope,
            ingredientResolve: mockIngredient
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ingredientId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ingredientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ingredientId: 1
          })).toEqual('/ingredients/1/edit');
        }));

        it('should attach an Ingredient to the controller scope', function () {
          expect($scope.vm.ingredient._id).toBe(mockIngredient._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ingredients/client/views/form-ingredient.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
