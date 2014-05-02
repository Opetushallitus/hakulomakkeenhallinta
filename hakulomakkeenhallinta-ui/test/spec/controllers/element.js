'use strict';

describe('Controller: ElementCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  var ElementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ElementCtrl = $controller('ElementCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
