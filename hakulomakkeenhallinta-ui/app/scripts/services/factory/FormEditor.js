'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory', [])
    .factory('FormEditor',[ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.formEditorUri+'/:_path/:_id/:_oper',
            {_path: '@_path', _id: '@_id', _oper:'@_oper'}, {}
        );
    }]);

