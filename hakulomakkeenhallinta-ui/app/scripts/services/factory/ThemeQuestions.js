'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ThemeQuestions',[ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.themeQuestionUri+'/:_id/:_aoid/:_themeId',
            {_id: '@_id', _aoid: '@_aoid', _themeId: '@_themeId'}, {}
        );
    }]);
