'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
  .factory('ElementTypes', [ '$resource', 'Props', function ($resource, Props) {
        console.log('****** ElementTypes service factory ***');
        return $resource(Props.serviceRootUri+'/type/:id', {id:'@id'}, {});
  }]);
