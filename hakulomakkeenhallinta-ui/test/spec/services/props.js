'use strict';

describe('Service: Props', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp.services.provider'));

  // instantiate service
  var Props;
  beforeEach(inject(function (_Props_) {
    Props = _Props_;
  }));

  it('should do something', function () {
    expect(!!Props).toBe(true);
  });

});
