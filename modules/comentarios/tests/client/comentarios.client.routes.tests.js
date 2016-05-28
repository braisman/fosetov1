(function () {
  'use strict';

  describe('Comentarios Route Tests', function () {
    // Initialize global variables
    var $scope,
      ComentariosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ComentariosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ComentariosService = _ComentariosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('comentarios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/comentarios');
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
          ComentariosController,
          mockComentario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('comentarios.view');
          $templateCache.put('modules/comentarios/client/views/view-comentario.client.view.html', '');

          // create mock Comentario
          mockComentario = new ComentariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Comentario Name'
          });

          //Initialize Controller
          ComentariosController = $controller('ComentariosController as vm', {
            $scope: $scope,
            comentarioResolve: mockComentario
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:comentarioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.comentarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            comentarioId: 1
          })).toEqual('/comentarios/1');
        }));

        it('should attach an Comentario to the controller scope', function () {
          expect($scope.vm.comentario._id).toBe(mockComentario._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/comentarios/client/views/view-comentario.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ComentariosController,
          mockComentario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('comentarios.create');
          $templateCache.put('modules/comentarios/client/views/form-comentario.client.view.html', '');

          // create mock Comentario
          mockComentario = new ComentariosService();

          //Initialize Controller
          ComentariosController = $controller('ComentariosController as vm', {
            $scope: $scope,
            comentarioResolve: mockComentario
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.comentarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/comentarios/create');
        }));

        it('should attach an Comentario to the controller scope', function () {
          expect($scope.vm.comentario._id).toBe(mockComentario._id);
          expect($scope.vm.comentario._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/comentarios/client/views/form-comentario.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ComentariosController,
          mockComentario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('comentarios.edit');
          $templateCache.put('modules/comentarios/client/views/form-comentario.client.view.html', '');

          // create mock Comentario
          mockComentario = new ComentariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Comentario Name'
          });

          //Initialize Controller
          ComentariosController = $controller('ComentariosController as vm', {
            $scope: $scope,
            comentarioResolve: mockComentario
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:comentarioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.comentarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            comentarioId: 1
          })).toEqual('/comentarios/1/edit');
        }));

        it('should attach an Comentario to the controller scope', function () {
          expect($scope.vm.comentario._id).toBe(mockComentario._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/comentarios/client/views/form-comentario.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
