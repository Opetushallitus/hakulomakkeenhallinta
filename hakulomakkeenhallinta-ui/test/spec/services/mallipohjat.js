'use strict';

describe('Service: Mallipohjat', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  // instantiate service
  var Mallipohjat;
  beforeEach(inject(function (_Mallipohjat_) {
    Mallipohjat = _Mallipohjat_;
  }));

  it('should do something', function () {
    expect(!!Mallipohjat).toBe(true);
  });

});
