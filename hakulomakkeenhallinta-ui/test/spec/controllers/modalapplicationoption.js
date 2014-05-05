'use strict';

describe('Controller: ModalapplicationoptionCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp.controllers'));

  var ModalapplicationoptionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalapplicationoptionCtrl = $controller('ModalapplicationoptionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
