'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
  .factory('Hakulomakkeet',[ '$resource', function ($resource) {
    console.log('****** Hakulomakkeet service factory ***');
     return {
      haeLomakkeet: $resource('http://localhost:8080/hakulomakkeenhallinta-temporary/application-system-form/_id', {}, {
          get: {method: 'GET', isArray: true}
      })
    };
  }]);
