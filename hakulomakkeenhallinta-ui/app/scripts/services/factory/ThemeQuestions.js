'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ThemeQuestions',[ '$rootScope','$resource', 'Props','$q', function ($rootScope, $resource, Props, $q) {
        var themeQuestion = {};

        var ThemeQuestion = $resource(Props.themeQuestionUri+'/:_id/:_aoid/:_themeId',
            {_id: '@_id', _aoid: '@_aoid', _themeId: '@_themeId'},{
                getThemeQuestionListByOrgId: {
                    method: 'GET',
                    isArray: true,
                    url: Props.themeQuestionUri + '/list/:_id/.',
                    params:{_id: '@_id'}
                },
                reorderThemeQuestions: {
                    method: 'POST',
                    isArray: false,
                    url: Props.themeQuestionUri + '/reorder/:_lopId/:_themeId',
                    params: { _lopId: '@_lopId', _themeId: '@_themeId' }
                }

            }
        );
        /**
         * Palauttaa hakulomakkeeseen tehdyt teema kysymykset hakulomakkeen id:llä
         * ja käyttäjän organisaation perusteella
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
                function success (data) {
                    $rootScope.LOGS('ThemeQuestions', 'createNewQuestion()', data);
                    deferred.resolve(data);
            }, function error (resp) {
                    console.log('**** ERROR --> ', resp);
                    deferred.reject(resp);
                });
            return deferred.promise;
        };
        /**
         * Tallenetaan muokattu lisäkysymys HH:n taustajärjestelmään
         * @param questionId kysymyksen id
         * @param questionData kysymys data
         * @returns {promise} palauttaa tallennetu kysymyksen
         */
        themeQuestion.saveModifiedQuestion = function(questionId, questionData){
            $rootScope.LOGS('ThemeQuestions', 'saveModifiedQuestion()');
            var deferred = $q.defer();
            ThemeQuestion.save( { '_id': questionId }, questionData).$promise.then(
                function(data){
                    $rootScope.LOGS('ThemeQuestions', 'saveModifiedQuestion()', data);
                    deferred.resolve(data);
            });
            return deferred.promise;
        };
        /**
         * Asetaan lisäkysmys deleted tilaan HH:n taustajärjestelmässä
         * @param questionId
         * @returns {promise}
         */
        themeQuestion.deleteQuestion = function(questionId){
            $rootScope.LOGS('ThemeQuestions', 'deleteQuestion()');
            var deferred = $q.defer();
            ThemeQuestion.delete( {'_id': questionId }).$promise.then(
                function(data){
                    $rootScope.LOGS('ThemeQuestions', 'deleteQuestion()', data);
                    deferred.resolve(data);
            });
            return deferred.promise;
        };
        /**
         * Tallentaan teemassa olevien kysymysten järjestyksen kantaan
         * @param learningOportunityId hakukohde id
         * @param themeId teeman id
         * @param questionOrdinals kysymysten järjestys objekti
         * @returns {promise}
         */
        themeQuestion.reorderThemeQuestions = function(learningOportunityId, themeId, ordinals){
            $rootScope.LOGS('ThemeQuestions', 'reorderThemeQuestions()', ordinals );
            var deferred = $q.defer();
            ThemeQuestion.reorderThemeQuestions( { _lopId: learningOportunityId, _themeId: themeId  }, ordinals).$promise.then(
                function(data){
                    $rootScope.LOGS('ThemeQuestions', 'reorderThemeQuestions()', data);
                    deferred.resolve(data);
                });
            return deferred.promise;
        };


        return themeQuestion;
    }]);