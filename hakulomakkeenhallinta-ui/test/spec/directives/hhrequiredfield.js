'use strict';

describe('Directive: hhRequiredfield', function () {

  // load the directive's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hh-requiredfield></hh-requiredfield>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the hhRequiredfield directive');
  }));
});
