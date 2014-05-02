'use strict';

describe('Directive: appVersion', function () {

  // load the directive's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<app-version></app-version>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the appVersion directive');
  }));
});
