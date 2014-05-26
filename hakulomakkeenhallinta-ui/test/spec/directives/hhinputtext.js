'use strict';

describe('Directive: hhInputtext', function () {

  // load the directive's module
  beforeEach(module('hakulomakkeenhallintaUiApp.directives'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hh-inputtext></hh-inputtext>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the hhInputtext directive');
  }));
});
