'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
    .factory('ASForms',[ '$resource', 'Props', function ($resource, Props) {
        console.log('****** ASForms service factory ***');
        return $resource(Props.envUrl+'/hakulomakkeenhallinta-temporary/application-system-form/:_id', {_id: '@_id'},{
                update: { method: 'PUT' }
            });
    }]);
