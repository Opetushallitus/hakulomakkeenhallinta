'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ThemeQuestions',[ '$rootScope','$resource', 'Props','$q', function ($rootScope, $resource, Props, $q) {
        var themeQuestion = {};

        var ThemeQuestion = $resource(Props.themeQuestionUri+'/:_id/:_aoid/:_themeId',
            {_id: '@_id', _aoid: '@_aoid', _themeId: '@_themeId'},{
                getThemeQuestionListByOrgId: {
                    method: 'GET',
                    isArray: true,
                    url: Props.themeQuestionUri+'/list/:_id/.',
                    params:{_id: '@_id'}
                }

            }
        );
        /**
         * Palauttaa hakulomakkeeseen tehdyt teema kysymykset hakulomakkeen id:llä
         * @param applicationSystemId
         * @returns {promise}
         */
        themeQuestion.getThemeQuestionListByOrgId = function(applicationSystemId, organisationId){
            $rootScope.LOGS('ThemeQuestions', 'getThemeQuestionListByOrgId()', applicationSystemId);
            var deferred = $q.defer();
            ThemeQuestion.getThemeQuestionListByOrgId({'_id':applicationSystemId, orgId: organisationId}).$promise.then(
                function(data){
                deferred.resolve(data);
                });
            return deferred.promise;
        }
        /**
         * Palautaa lisäkysymyksen sen id:llä
         * @param questionId kysymyksen id
         * @returns {promise}
         */
        themeQuestion.getThemeQuestionById = function(questionId){
            $rootScope.LOGS('ThemeQuestions', 'getThemeQuestionById()', questionId);
            var deferred = $q.defer();
            ThemeQuestion.get({'_id': questionId}).$promise.then(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        return themeQuestion;
    }]);