'use strict';

describe('Filter: without', function () {

  // load the filter's module
  beforeEach(module('hakulomakkeenhallintaUiApp.filters'));

  // initialize a new instance of the filter before each test
  var without;
  beforeEach(inject(function ($filter) {
    without = $filter('without');
  }));

  it('should return the input prefixed with "without filter:"', function () {
    var text = 'angularjs';
    expect(without(text)).toBe('without filter: ' + text);
  });

});
