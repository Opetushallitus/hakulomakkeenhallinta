'use strict';

describe('Controller: FormtemplatesCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  var FormtemplatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormtemplatesCtrl = $controller('FormtemplatesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
