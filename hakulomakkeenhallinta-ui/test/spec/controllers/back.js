'use strict';

describe('Controller: BackCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp.controllers'));

  var BackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BackCtrl = $controller('BackCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
