'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
  .factory('ElementTypes', [ '$resource', 'Props', function ($resource, Props) {
        console.log('****** ElementTypes service factory ***');
        return {
            haeElementTypes: $resource(Props.envUrl+'/hakulomakkeenhallinta-temporary/type', {}, {
                get: {method: 'GET', isArray: true}
            }),
            elementTypeId: $resource(Props.envUrl+'/hakulomakkeenhallinta-temporary/type/:id', {id:'@id'}, {
                get: {method: 'GET', isArray: false}
            })
        };
  }]);
