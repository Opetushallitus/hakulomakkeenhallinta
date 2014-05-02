'use strict';

describe('Controller: ModalquestionCtrl', function () {

  // load the controller's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  var ModalquestionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalquestionCtrl = $controller('ModalquestionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
