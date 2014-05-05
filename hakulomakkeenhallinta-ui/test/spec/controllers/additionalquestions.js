'use strict';

describe('Controller: AdditionalquestionsCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp.controllers'));

  var AdditionalquestionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdditionalquestionsCtrl = $controller('AdditionalquestionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
