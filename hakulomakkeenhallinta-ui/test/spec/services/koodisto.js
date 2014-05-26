'use strict';

describe('Service: Koodisto', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp.services.service'));

  // instantiate service
  var Koodisto;
  beforeEach(inject(function (_Koodisto_) {
    Koodisto = _Koodisto_;
  }));

  it('should do something', function () {
    expect(!!Koodisto).toBe(true);
  });

});
