'use strict';

describe('Service: ApplicationSystemResource', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp.services.provider'));

  // instantiate service
  var ApplicationSystemResource;
  beforeEach(inject(function (_ApplicationSystemResource_) {
    ApplicationSystemResource = _ApplicationSystemResource_;
  }));

  it('should do something', function () {
    expect(!!ApplicationSystemResource).toBe(true);
  });

});
