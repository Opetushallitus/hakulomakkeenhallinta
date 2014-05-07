'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
  .factory('ASForms',[ '$resource', 'Props', function ($resource, Props) {
    console.log('****** ASForms service factory ***');
     return {
      haeHakulomakkeet: $resource(Props.envUrl+'/hakulomakkeenhallinta-temporary/application-system-form', {}, {
          get: {method: 'GET', isArray: true}
      }),
     haeHakulomakeId: $resource(Props.envUrl+'/hakulomakkeenhallinta-temporary/application-system-form/:id', {id:'@id'}, {
         get: {method: 'GET', isArray: false}
     })
    };
  }]);
