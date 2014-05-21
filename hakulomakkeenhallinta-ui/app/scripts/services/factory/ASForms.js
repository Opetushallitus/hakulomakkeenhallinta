'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
    .factory('ASForms',[ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.serviceRootUri+'/application-system-form/:_id/:_aoid/:_eid/:_qid/:_getAll',
            {_id: '@_id', _aoid: '@_aoid', _eid: '@_eid', _qid: '@_qid', _getAll: '@_getAll'},
            { update: { method: 'PUT' } }
        );
    }]);
