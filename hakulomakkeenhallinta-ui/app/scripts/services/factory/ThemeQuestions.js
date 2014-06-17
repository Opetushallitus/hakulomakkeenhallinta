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
        };
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
        };
        /**
         * Tallentaa uuden lisäkysymyksen HH:n taustajärjestelmään
         * @param applicationSystemId hakukohteen Id
         * @param hakuOid hakukohteen id
         * @param themeId kysymys teeman id
         * @param questionData kysymys data
         * @returns {promise} palauttaa tallennetun kysymyksen
         */
        themeQuestion.createNewQuestion = function(applicationSystemId, hakuOid, themeId, questionData){
            $rootScope.LOGS('ThemeQuestions', 'createNewQuestion()');
            var deferred = $q.defer();
            ThemeQuestion.save( { _id: applicationSystemId, '_aoid': hakuOid , '_themeId': themeId  }, questionData).$promise.then(
                function(data){
                    $rootScope.LOGS('ThemeQuestions', 'createNewQuestion()', data);
                    deferred.resolve(data);
            });
            return deferred.promise;
        };

        return themeQuestion;
    }]);