'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
    .factory('ASForms',[ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.serviceRootUri+'/application-system-form/:_id/:_eid/:_addQuestions/:_qid',
            {_id: '@_id', _eid: '@_eid', _addQuestions: '@_addQuestions', _qid:'@_qid'},
            { update: { method: 'PUT' }
        });
    }]);
