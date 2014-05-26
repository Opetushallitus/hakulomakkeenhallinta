'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
    .factory('ASForms',[ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.serviceRootUri+'/:_id/:_aoid/:_eid/:_qid/',
            {_id: '@_id', _aoid: '@_aoid', _eid: '@_eid', _qid: '@_qid'}, {}
        );
    }]);
