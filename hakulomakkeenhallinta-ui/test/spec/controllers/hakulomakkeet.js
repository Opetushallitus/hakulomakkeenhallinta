'use strict';

describe('Controller: HakulomakkeetCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp.controllers'));

  var HakulomakkeetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HakulomakkeetCtrl = $controller('HakulomakkeetCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
