'use strict';

describe('Service: AdditionalQuestion', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  // instantiate service
  var AdditionalQuestion;
  beforeEach(inject(function (_AdditionalQuestion_) {
    AdditionalQuestion = _AdditionalQuestion_;
  }));

  it('should do something', function () {
    expect(!!AdditionalQuestion).toBe(true);
  });

});
