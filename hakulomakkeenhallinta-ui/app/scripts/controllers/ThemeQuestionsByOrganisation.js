'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$rootScope', '$scope', '$modal', '$location', '_', '$routeParams', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions', 'Organisaatio', '$filter', 'TarjontaAPI', '$q', 'AlertMsg', 'JatkokysymysService',
        function($rootScope, $scope, $modal, $location, _, $routeParams, FormEditor, FormWalker, QuestionData, ThemeQuestions, Organisaatio, $filter, TarjontaAPI, $q, AlertMsg, JatkokysymysService ) {
            $rootScope.LOGS('ThemeQuestionByOrganisationCtrl');

            $scope.haunNimi = '';
            $scope.organisationNimi = '';
            /**
             * haetaan valitun organisaation tiedot organisaatio palvelusta
             * valitun organisaation id:llä
             */
            Organisaatio.fetchOrganisation($routeParams.oid).then(
                function (data) {
                    $scope.organisationNimi = $filter('organisaatioNimi')(data, $scope.userLang);
                }
            );

            $scope.applicationSystem = {};
            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function (data) {
                    $scope.applicationSystem = data;
                    $scope.haunNimi = $filter('i18n')(data, 'name', $scope.userLang);
                }
            );
            $scope.themes = [];
            $scope.hakukohteittain = {};
            $scope.$emit('LOADPAGE');
            /**
             * heataan hakulomakkeen lisäkysymykset halomamekkeen id:llä ja valitulla organisaation id:llä
             */
            ThemeQuestions.hakukohdeKohtaisetKysymykset($routeParams.id, $routeParams.oid).then(
                function (data) {
                    $scope.themes = data;
                    $scope.$emit('LOADPAGEREADY');
                    _.each(data, function (d) {
                            _.each(d.hkkohde, function (hk) {
                                    if ($scope.hakukohteittain[hk.aoid] === undefined) {
                                        $scope.hakukohteittain[hk.aoid] = {};
                                        if ($scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] === undefined) {
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = [];
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = hk.additionalQuestions;
                                        } else {
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme].push(hk.additionalQuestions);
                                        }

                                    } else {
                                        if ($scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] === undefined) {
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = [];
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = hk.additionalQuestions;
                                        } else {
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme].push(hk.additionalQuestions);
                                        }
                                    }
                                }
                            );
                        }
                    );

                    if (JatkokysymysService.getJatkokysymysObj() !== undefined) {
                        var jatkoK = JatkokysymysService.getJatkokysymysObj();
                        jatkoK.kysymykset = _.where(_.where($scope.themes, {id: jatkoK.teema.id})[0].hkkohde, {aoid: jatkoK.hakukohde.aoid})[0].additionalQuestions;
                        jatkoK.scope = $scope;
                        JatkokysymysService.lisaaJatkokysymys(jatkoK);
                    }

                }
            );
            /**
             * avataan dialogit uuden kysymyksen hakukohteen ja tyypin alustamiseksi
             * @param theme
             */
            $scope.addQuestion = function (theme) {
                $modal.open({
                    templateUrl: 'partials/dialogs/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeDialogCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystem: function () {
                            return $scope.applicationSystem;
                        },
                        theme: function () {
                            return theme;
                        }
                    }
                }).result.then(function (data) {
                        $modal.open({
                            templateUrl: 'partials/dialogs/kysymystyypin-valinta.html',
                            controller: 'SelectQuestionTypeCtrl',
                            scope: $scope,
                            resolve: {
                                applicationSystem: function () {
                                    return data.applicationSystem;
                                },
                                theme: function () {
                                    return data.theme;
                                },
                                hakukohde: function () {
                                    return data.hakukohde;
                                }
                            }
                        }).result.then(function (data) {
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl','addQuestion()', data);
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setTheme(theme);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setEditFlag(false);
                                QuestionData.setLearningOpportunityId(QuestionData.getApplicationOption().oid);
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl', QuestionData.getQuestion() );
                                $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid + '/' + QuestionData.getApplicationOption().oid + '/' + theme.id + '/' + data.type.id);
                            }
                        );
                    }
                );
            };

            $scope.addQuestionAtHakukohde = function (theme, hakukohde) {
                if (hakukohde.kayttoryhmat !== undefined) {
                    QuestionData.setIsGroup(true);
                } else {
                    QuestionData.setIsGroup(false);
                }

                QuestionData.setApplicationOption(hakukohde);
                $modal.open({
                    templateUrl: 'partials/dialogs/kysymystyypin-valinta.html',
                    controller: 'SelectQuestionTypeCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystem: function () {
                            return $scope.applicationSystem;
                        },
                        theme: function () {
                            return theme;
                        },
                        hakukohde: function () {
                            return hakukohde;
                        },
                        jatkokysymysObj: function () {
                            return JatkokysymysService.getJatkokysymysObj();
                        }
                    }
                }).result.then( function (data) {
                        $rootScope.LOGS('ThemeQuestionByOrganisationCtrl','addQuestion()', data);
                        QuestionData.newAdditionalQuestion();
                        QuestionData.setQuestionType(data.type);
                        QuestionData.setTheme(theme);
                        QuestionData.setApplicatioSystemId($routeParams.id);
                        QuestionData.setEditFlag(false);
                        QuestionData.setLearningOpportunityId(hakukohde.aoid);
                        $rootScope.LOGS('ThemeQuestionByOrganisationCtrl', QuestionData.getQuestion() );
                        $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid + '/' + hakukohde.aoid + '/' + theme.id + '/' + data.type.id);
                    }, function (data) {
                        if (data.msg === 'jatkokysymys') {
                            JatkokysymysService.lisaaJatkokysymys(data.data);
                        }
                    }
                );
            };
            /**
             * takaisin edelliselle sivulle
             */
            $scope.back = function () {
                $location.path('/');
            };
            /**
             * Lisätään uusi jatkokysymys kysymyksen vastaukseen
             * @param kysymykset lista kysymyksiä
             * @param hakukohde johon kysymys liitetään
             * @param teema johon kysymys liitetään
             * @param kysymys johon kysymys liitetään
             * @param vastaus johon kysymys liitetään [optional]
             */
            $scope.lisaaJatkokysymys = function (kysymykset, hakukohde, teema, kysymys, vastaus){
                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ', 'lisaaJatkokysymys()');

                if(kysymys.type === 'TextQuestion') {
                    var jatko = {};
                    jatko.parentId = kysymys._id;
                    jatko.followupCondition = '';
                    JatkokysymysService.setParentQuestion(jatko);
                    $scope.addQuestionAtHakukohde(teema, hakukohde);

                } else {
                    JatkokysymysService.lisaaJatkokysymys({ kysymykset: kysymykset, hakukohde: hakukohde, teema: teema, scope: $scope, kysymys: kysymys, vastaus: vastaus });
                }


            };

        }]);