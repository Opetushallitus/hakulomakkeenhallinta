'use strict';

describe('Controller: SelectthemeandquestiontypeCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  var SelectthemeandquestiontypeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SelectthemeandquestiontypeCtrl = $controller('SelectthemeandquestiontypeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
