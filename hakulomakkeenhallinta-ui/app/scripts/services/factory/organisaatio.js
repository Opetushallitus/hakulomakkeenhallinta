'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('Organisaatio',[ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.organisaatioService+'/rest/organisaatio/:_oid',
            {_oid:'@_oid'}, {}
        );
    }]);


