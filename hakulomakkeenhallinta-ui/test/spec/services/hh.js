'use strict';

describe('Service: Hh', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp.services.service'));

  // instantiate service
  var Hh;
  beforeEach(inject(function (_Hh_) {
    Hh = _Hh_;
  }));

  it('should do something', function () {
    expect(!!Hh).toBe(true);
  });

});
