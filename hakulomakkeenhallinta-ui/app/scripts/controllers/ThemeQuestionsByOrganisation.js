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
            /**
             * heataan hakulomakkeen lisäkysymykset halomamekkeen id:llä ja valitulla organisaation id:llä
             */
            ThemeQuestions.hakukohdeKohtaisetKysymykset($routeParams.id, $routeParams.oid).then(
                function (data) {
//                    console.log('##1 ',data);
                    $scope.themes = data;
//                    console.log('##2 ', _.uniq(_.map(data, function(teema) { return teema.id; })));

                    _.each(data, function (d) {
                            _.each(d.hkkohde, function (hk) {
//                                    console.log('*', hk);
//                                    console.log(hk.aoid, $scope.hakukohteittain[hk.aoid]);
                                    if ($scope.hakukohteittain[hk.aoid] === undefined) {
//                                        console.log('luodaan uusi');
                                        $scope.hakukohteittain[hk.aoid] = {};
                                        console.log(hk.additionalQuestions[0].theme);
                                        if ($scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] === undefined) {
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = [];
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = hk.additionalQuestions;
                                        } else {
//                                            console.log('model exist lisätään kysymykset ')
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme].push(hk.additionalQuestions);
                                        }

                                    } else {
//                                        console.log('lisätään olemassa olevaan ');
                                        if ($scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] === undefined) {
//                                            console.log( 'lisätään teema ');
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = [];
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme] = hk.additionalQuestions;
                                        } else {
//                                            console.log('model exist')
                                            $scope.hakukohteittain[hk.aoid][hk.additionalQuestions[0].theme].push(hk.additionalQuestions);
                                        }
                                    }
                                }
                            );
                        }
                    );

                    if (JatkokysymysService.getJatkokysymysObj() !== undefined) {
                        var jatkoK = JatkokysymysService.getJatkokysymysObj();
                        console.log('----> ', _.where(_.where($scope.themes, {id: jatkoK.teema.id})[0].hkkohde, {aoid: jatkoK.hakukohde.aoid})[0].additionalQuestions);
                        jatkoK.kysymykset = _.where(_.where($scope.themes, {id: jatkoK.teema.id})[0].hkkohde, {aoid: jatkoK.hakukohde.aoid})[0].additionalQuestions;
                        jatkoK.scope = $scope;
                        JatkokysymysService.lisaaJatkokysymys(jatkoK);
                    }
//                    console.log('##', $scope.hakukohteittain);
                }
            );
            /**
             * avataan dialogit uuden kysymyksen hakukohteen ja tyypin alustamiseksi
             * @param theme
             */
            $scope.addQuestion = function (theme) {
                $modal.open({
                    templateUrl: 'partials/dialogs/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl',
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
                console.log('%%%% ', hakukohde);
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
                        console.log('DSFGDFgh ', data);
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


            $scope.lisaaJatkokysymys = function (hkKysymysLista, hakukohde, theme, question, option){
                console.log('ThemeQuestionByOrganisationCtrl ', 'lisaaJatkokysymys()');
                console.log('Hakukohde: ', hakukohde);
                console.log('Teema: ', theme);
                console.log('Kysymys: ', question);
                console.log('Vastaus: ', option);

                JatkokysymysService.lisaaJatkokysymys({ kysymykset: hkKysymysLista, hakukohde: hakukohde, teema: theme, scope: $scope, kysymys: question, vastaus:option });
            };


        }]);