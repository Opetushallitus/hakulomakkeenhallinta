'use strict';

describe('Service: TypeResource', function () {

  // load the service's module
  beforeEach(module('hakulomakkeenhallintaUiApp'));

  // instantiate service
  var TypeResource;
  beforeEach(inject(function (_TypeResource_) {
    TypeResource = _TypeResource_;
  }));

  it('should do something', function () {
    expect(!!TypeResource).toBe(true);
  });

});
