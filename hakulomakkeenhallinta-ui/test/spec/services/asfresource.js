'use strict';

describe('Service: ASFResource', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  // instantiate service
  var ASFResource;
  beforeEach(inject(function (_ASFResource_) {
    ASFResource = _ASFResource_;
  }));

  it('should do something', function () {
    expect(!!ASFResource).toBe(true);
  });

});
