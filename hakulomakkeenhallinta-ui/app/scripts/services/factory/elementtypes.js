'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
  .factory('ElementTypes', [ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.serviceRootUri+'/type/:id', {id:'@id'}, {});
  }]);
