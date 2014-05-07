'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
  .factory('Mallipohjat', ['$resource', 'Props', function ($resource, Props) {
        console.log('****** Mallipohjat service factory ***');
        return {
            haeMallipohjat: $resource(Props.envUrl+'/hakulomakkeenhallinta-temporary/form', {}, {
                get: {method: 'GET', isArray: true}
            }),
            malliPohjaId: $resource(Props.envUrl+'/hakulomakkeenhallinta-temporary/form/:id', {id:'@id'}, {
                get: {method: 'GET', isArray: false}
            })
        };
  }]);
