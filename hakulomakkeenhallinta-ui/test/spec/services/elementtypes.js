'use strict';

describe('Service: elementtypes', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  // instantiate service
  var elementtypes;
  beforeEach(inject(function (_elementtypes_) {
    elementtypes = _elementtypes_;
  }));

  it('should do something', function () {
    expect(!!elementtypes).toBe(true);
  });

});
