'use strict';

describe('Service: FormResource', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp.services.provider'));

  // instantiate service
  var FormResource;
  beforeEach(inject(function (_FormResource_) {
    FormResource = _FormResource_;
  }));

  it('should do something', function () {
    expect(!!FormResource).toBe(true);
  });

});
