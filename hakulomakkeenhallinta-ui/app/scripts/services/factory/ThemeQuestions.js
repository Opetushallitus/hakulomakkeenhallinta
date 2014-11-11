'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ThemeQuestions', [ '$rootScope', '$resource', 'Props', '$q', 'FormEditor', '_',
        function ($rootScope, $resource, Props, $q, FormEditor, _) {
            var themeQuestion = {};

            var ThemeQuestion = $resource(Props.themeQuestionUri + '/:_id/:_aoid/:_themeId',
                {_id: '@_id', _aoid: '@_aoid', _themeId: '@_themeId'},
                {
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
                    },
                    getThemeQuestionListByThemeAndLearningOpportunity: {
                        method: 'GET',
                        isArray: true,
                        url: Props.themeQuestionUri + '/list/:_id',
                        params:{_id: '@_id', aoId: '_aoId', themeId: '_themId', orgId: '_orgId'}
                    }

                }
            );
            /**
             * Palauttaa hakulomakkeeseen tehdyt teema kysymykset hakulomakkeen id:llä
             * ja käyttäjän organisaation perusteella
             * @param applicationSystemId
             * @returns {promise}
             */
            themeQuestion.getThemeQuestionListByOrgId = function (applicationSystemId, organisationId) {
                $rootScope.LOGS('ThemeQuestions', 'getThemeQuestionListByOrgId()', applicationSystemId);
                var deferred = $q.defer();
                ThemeQuestion.getThemeQuestionListByOrgId({'_id': applicationSystemId, orgId: organisationId}).$promise.then(
                    function (data) {
                        deferred.resolve(data);
                    }
                );
                return deferred.promise;
            };
            /**
             * Palautaa lisäkysymyksen sen id:llä
             * @param questionId kysymyksen id
             * @returns {promise}
             */
            themeQuestion.getThemeQuestionById = function (questionId) {
                $rootScope.LOGS('ThemeQuestions', 'getThemeQuestionById()', questionId);
                var deferred = $q.defer();
                ThemeQuestion.get({'_id': questionId}).$promise.then(
                    function (data) {
                        deferred.resolve(data);
                    }
                );
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
            themeQuestion.createNewQuestion = function (applicationSystemId, hakuOid, themeId, questionData) {
                $rootScope.LOGS('ThemeQuestions', 'createNewQuestion()');
                var deferred = $q.defer();
                ThemeQuestion.save({'_id': applicationSystemId, '_aoid': hakuOid, '_themeId': themeId  }, questionData).$promise.then(
                    function success(data) {
                        $rootScope.LOGS('ThemeQuestions', 'createNewQuestion()', data);
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        $rootScope.LOGS('ThemeQuestions', 'createNewQuestion()', 'ERROR', resp);
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * Tallenetaan muokattu lisäkysymys HH:n taustajärjestelmään
             * @param questionId kysymyksen id
             * @param questionData kysymys data
             * @returns {promise} palauttaa tallennetu kysymyksen
             */
            themeQuestion.saveModifiedQuestion = function (questionId, questionData) {
                $rootScope.LOGS('ThemeQuestions', 'saveModifiedQuestion()');
                var deferred = $q.defer();
                ThemeQuestion.save({'_id': questionId }, questionData).$promise.then(
                    function success(data) {
                        $rootScope.LOGS('ThemeQuestions', 'saveModifiedQuestion()', data);
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        $rootScope.LOGS('ThemeQuestions', 'saveModifiedQuestion()', 'ERROR', resp);
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * Asetaan lisäkysmys deleted tilaan HH:n taustajärjestelmässä
             * @param questionId
             * @returns {promise}
             */
            themeQuestion.deleteQuestion = function (questionId) {
                $rootScope.LOGS('ThemeQuestions', 'deleteQuestion()');
                var deferred = $q.defer();
                ThemeQuestion.delete({'_id': questionId }).$promise.then(
                    function success(data) {
                        $rootScope.LOGS('ThemeQuestions', 'deleteQuestion()', data);
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        $rootScope.LOGS('ThemeQuestions', 'deleteQuestion()', 'ERROR', resp);
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * Tallentaan teemassa olevien kysymysten järjestyksen kantaan
             * @param learningOportunityId hakukohde id
             * @param themeId teeman id
             * @param questionOrdinals kysymysten järjestys objekti
             * @returns {promise}
             */
            themeQuestion.reorderThemeQuestions = function (learningOportunityId, themeId, ordinals) {
                $rootScope.LOGS('ThemeQuestions', 'reorderThemeQuestions()', ordinals);
                var deferred = $q.defer();
                ThemeQuestion.reorderThemeQuestions({ _lopId: learningOportunityId, _themeId: themeId }, ordinals).$promise.then(
                    function success(data) {
                        $rootScope.LOGS('ThemeQuestions', 'reorderThemeQuestions()', data);
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        $rootScope.LOGS('ThemeQuestions', 'reorderThemeQuestions()', 'ERROR', resp);
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * Haetaan lisäkysmys lista hakulomakkeen, teeman, hakukohteen ja organisaation id:llä
             * @param applicationSystemId hakulomakeen Id
             * @param learningOppId hakukohteen Id
             * @param themeId teeman Id
             * @param orgId organisaation Id
             * @returns {promise}
             */
            themeQuestion.getThemeQuestionByThemeLop = function (applicationSystemId, learningOppId, themeId, orgId) {
                $rootScope.LOGS('ThemeQuestions', 'getThemeQuestionByThemeLop()');
                var deferred = $q.defer();
                ThemeQuestion.getThemeQuestionListByThemeAndLearningOpportunity({_id: applicationSystemId, aoId: learningOppId, themeId: themeId, orgId: orgId}).$promise.then(
                    function success(data) {
                        $rootScope.LOGS('ThemeQuestions', 'getThemeQuestionByThemeLop()', data);
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        $rootScope.LOGS('ThemeQuestions', 'getThemeQuestionByThemeLop()', 'ERROR', resp);
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * heataan hakulomakkeen hakukohde kohtaiset lisäkysymykset hakulomamekkeen - ja organisaation id:llä
             * ja asetetaan ne käyttöliittymään oikean teeman ja hakukohteen alle
             * @param applicationSystemId hakulomakkeen Id
             * @param organisationId organisaation Id
             * @returns {promise}
             */
            themeQuestion.hakukohdeKohtaisetKysymykset = function (applicationSystemId, organisationId) {
                $rootScope.LOGS('ThemeQuestions', 'hakukohdeKohtaisetKysymykset()');
                var deferred = $q.defer();
                FormEditor.getApplicationSystemFormThemes(applicationSystemId).then(
                    function (themes) {
                        themeQuestion.getThemeQuestionListByOrgId(applicationSystemId, organisationId).then(
                            function (themeQues) {
                                _.each(themes, function (teema, indx) {
                                        themes[indx].hkkohde = [];
                                        var teemanKysymykset = _.where(themeQues, {theme: teema.id}),
                                            teemanHakukohteet = _.uniq( _.map(teemanKysymykset, function (lopIds) { return lopIds.learningOpportunityId; }));

                                        _.each(teemanHakukohteet, function(lopId, indx2) {
                                                themes[indx].hkkohde[indx2] = {};
                                                themes[indx].hkkohde[indx2].aoid = lopId;
                                                themes[indx].hkkohde[indx2].additionalQuestions = _.where(themeQues, {theme: teema.id, learningOpportunityId: lopId});

                                                var jatkoQarray = _.filter(themes[indx].hkkohde[indx2].additionalQuestions, function (jatkoQ) {
                                                    if (jatkoQ.parentId !== undefined) {
                                                        return jatkoQ;
                                                    }
                                                });

                                                if (jatkoQarray.length  > 0) {
                                                    themes[indx].hkkohde[indx2].additionalQuestions = _.difference(themes[indx].hkkohde[indx2].additionalQuestions, jatkoQarray);
                                                    _.each(themes[indx].hkkohde[indx2].additionalQuestions, function (question, indx3) {
                                                            _.each(jatkoQarray, function (jatQ) {
                                                                if (jatQ.parentId === question._id) {
                                                                    _.each(question.options, function (option, indx4) {
                                                                            if (option.id === jatQ.followupCondition) {
                                                                                if (themes[indx].hkkohde[indx2].additionalQuestions[indx3].options[indx4].questions === undefined) {
                                                                                    themes[indx].hkkohde[indx2].additionalQuestions[indx3].options[indx4].questions = [];
                                                                                }
                                                                                themes[indx].hkkohde[indx2].additionalQuestions[indx3].options[indx4].questions.push(jatQ);
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            });

                                                        }
                                                    );
                                                }
                                            }
                                        );
                                    }
                                );
                                deferred.resolve(themes);
                            }
                        );
                    }
                );
                return deferred.promise;
            };

            return themeQuestion;
        }]);