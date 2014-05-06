'use strict';

describe('Service: TarjontaAPI', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  // instantiate service
  var TarjontaAPI;
  beforeEach(inject(function (_TarjontaAPI_) {
    TarjontaAPI = _TarjontaAPI_;
  }));

  it('should do something', function () {
    expect(!!TarjontaAPI).toBe(true);
  });

});
