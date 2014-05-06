'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
  .factory('Mallipohjat', ['$resource', function ($resource) {
        console.log('****** Mallipohjat service factory ***');
        return {
            haeMallipohjat: $resource('http://localhost:8080/hakulomakkeenhallinta-temporary/form/_id', {}, {
                get: {method: 'GET', isArray: true}
            })
        };
  }]);
