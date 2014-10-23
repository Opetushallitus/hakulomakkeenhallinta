'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$rootScope','$scope', '$modal', '$location', '_', '$routeParams', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions', 'Organisaatio', '$filter', 'TarjontaAPI', '$q', 'AlertMsg',
        function($rootScope, $scope, $modal, $location, _, $routeParams, FormEditor, FormWalker, QuestionData, ThemeQuestions, Organisaatio, $filter, TarjontaAPI, $q, AlertMsg ) {
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
            /**
             * heataan hakulomakkeen lisäkysymykset halomamekkeen id:llä ja valitulla organisaation id:llä
             */
            ThemeQuestions.hakukohdeKohtaisetKysymykset($routeParams.id, $routeParams.oid).then(function (data) {
                $scope.themes = data;
            });
            /**
             * avataan dialogit uuden kysymyksen hakukohteen ja tyypin alustamiseksi
             * @param theme
             */
            $scope.addQuestion = function(theme) {
                $modal.open({
                    templateUrl: 'partials/dialogs/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystem: function(){
                            return $scope.applicationSystem;
                        },
                        theme: function(){
                            return theme;
                        }
                    }
                }).result.then(function(data){
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
                if (hakukohde.kayttoryhmat) {
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

            /**
             * takaisin edelliselle sivulle
             */
            $scope.back = function () {
                $location.path('/');
            };

            $scope.lisaaSaanto = function (hkKysymysLista) {
                console.log('Tähän avataan dialogi säännöille ');
                console.log(hkKysymysLista);
                $modal.open({
                    templateUrl: 'partials/dialogs/lisaa-saanto.html',
                    controller: 'addRuleCtrl',
                    resolve:{
                        hkKysymysLista: function () {
                            return hkKysymysLista;
                        }
                    }
                }).result.then(function (data) {
                        console.log('##', data);
                        hkKysymysLista = data;
                    });

            }
        }]);