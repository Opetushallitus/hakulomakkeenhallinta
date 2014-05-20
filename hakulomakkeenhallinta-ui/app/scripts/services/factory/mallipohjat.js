'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
  .factory('Mallipohjat', ['$resource', 'Props', function ($resource, Props) {
        return $resource(Props.serviceRootUri+'/form/:_id', {_id:'@_id'}, {
            update: { method: 'PUT' }
        });
    }]);
