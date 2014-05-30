'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ThemeQuestions',[ '$resource', 'Props', function ($resource, Props) {
        return $resource(Props.themeQuestionUri+'/:_id/:_aoid/:_themeId',
            {_id: '@_id', _aoid: '@_aoid', _themeId: '@_themeId'},{
                getList: {
                    method: 'GET',
                    isArray: true,
                    url: Props.themeQuestionUri+'/list/:_id/.',
                    params:{_id: '@_id'}
                }

            }
        );
    }]);