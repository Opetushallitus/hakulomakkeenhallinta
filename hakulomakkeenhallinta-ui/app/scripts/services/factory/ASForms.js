'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
    .factory('ASForms',[ '$resource', 'Props', function ($resource, Props) {
        console.log('****** ASForms service factory ***');
        return $resource(Props.serviceRootUri+'/application-system-form/:_id/:_eid', {_id: '@_id', _eid: '@_eid'},{
                update: { method: 'PUT' }
        });
    }]);
