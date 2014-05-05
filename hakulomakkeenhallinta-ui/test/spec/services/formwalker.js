'use strict';

describe('Service: Formwalker', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp.services.util'));

  // instantiate service
  var Formwalker;
  beforeEach(inject(function (_Formwalker_) {
    Formwalker = _Formwalker_;
  }));

  it('should do something', function () {
    expect(!!Formwalker).toBe(true);
  });

});
