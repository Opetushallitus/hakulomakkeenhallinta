'use strict';

describe('Controller: CreateapplicationsystemformCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  var CreateapplicationsystemformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateapplicationsystemformCtrl = $controller('CreateapplicationsystemformCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
