'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ModifyAdditionalQuestionCtrl', [ '$scope', '$rootScope', '$location', '$routeParams', 'FormEditor', 'ThemeQuestions', 'QuestionData', 'AlertMsg', '$filter', '$modal', 'TarjontaAPI', 'Organisaatio', 'lisakysymysOikeudetService',
        function ($scope, $rootScope, $location, $routeParams, FormEditor, ThemeQuestions, QuestionData, AlertMsg, $filter, $modal, TarjontaAPI, Organisaatio, LisakysymysOikeudetService) {
            $rootScope.LOGS('ModifyAdditionalQuestionCtrl');
            $scope.languages = [];
            $scope.theme = {};
            $scope.questionType = {};
            $scope.question = {};
            $scope.editFlag = true;
            $scope.validators = [];
            $scope.hakukohde = {};
            $scope.applicationSystem = {};
            $scope.haunNimi = '';
            $scope.hakukohdeNimi = '';
            $scope.teema = '';
            $scope.kysymysTyyppi = '';
            $scope.tallennaClicked = false;
            $scope.LisakysymysOikeudetService = LisakysymysOikeudetService;

            FormEditor.getLanguages().then(
                function (data) {
                    $scope.languages = data;
                }
            );

            QuestionData.fetchQuestionData($routeParams.questionId).then(function () {
                $scope.question = QuestionData.getQuestion();
                QuestionData.setThemeId($scope.question.theme);
                QuestionData.setQuestionType($scope.question.type);
                QuestionData.setEditFlag(true);
                QuestionData.getTheme().then(
                    function (data) {
                        $scope.theme = data;
                        $scope.teema = $filter('i18n')($scope.theme, 'name', $scope.userLang);
                    }
                );

                QuestionData.getType($scope.question.type).then(
                    function (data) {
                        $scope.questionType = data;
                        $scope.kysymysTyyppi = $filter('i18n')($scope.questionType, 'name', $scope.userLang );
                    }
                );
                /**
                 * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
                 */
                FormEditor.fetchApplicationSystemForm(QuestionData.getApplicationSystemId()).then(
                    function (data) {
                        $scope.applicationSystem = data;
                        $scope.haunNimi = $filter('i18n')($scope.applicationSystem, 'name', $scope.userLang);
                    }
                );

                TarjontaAPI.fetchHakukohdeInfo(QuestionData.getLerningOpportunityId()).then(
                    function (data) {
                        $scope.hakukohde = data;
                        $scope.hakukohdeNimi = $filter('hakukohdeNimi')($scope.hakukohde, $scope.userLang);
                        if (data === 'NOT_FOUND') {
                            haeHakukohdeRyhma();
                        }
                    }
                );

                function haeHakukohdeRyhma() {
                    Organisaatio.getOrganisationData(QuestionData.getLerningOpportunityId()).then(
                        function (hkData) {
                            if ($scope.question.targetIsGroup === undefined) {
                                $scope.question.targetIsGroup = true;
                            }
                            QuestionData.setIsGroup(true);
                            $scope.hakukohde = hkData;
                            $scope.hakukohdeNimi = $filter('hakukohdeNimi')(hkData, $scope.userLang);
                        }
                    );
                };

                $scope.editFlag = QuestionData.getEditFlag();
                $scope.validators = QuestionData.getQuestionTypeValidators();
            });
            /**
             * paluu takaisin edelliselle sivulle
             */
            $scope.back = function () {
                $rootScope.LOGS('ModifyAdditionalQuestionCtrl', 'back()');
                QuestionData.setEditFlag(false);
                $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
            };
            /**
             * Tallentaan kysymyksen muokkaus HH:n taustajärjestelmään
             */
            $scope.tallennaMuokkaus = function () {
                $rootScope.LOGS('ModifyAdditionalQuestionCtrl', 'tallennaMuokkaus()');
                if ($scope.kysymys.validationFn) {
                    $scope.kysymys.$setValidity('required', $scope.kysymys.validationFn());
                }
                else {
                    $scope.kysymys.otsikko.$setValidity('required', $scope.tarkistaPakollisuus($scope.question.messageText.translations));
                }
                if ($scope.kysymys.$valid) {
                    QuestionData.setEditFlag(false);
                    ThemeQuestions.saveModifiedQuestion($scope.question._id, $scope.question).then(
                        function success (data) {
                            AlertMsg($scope, 'success', 'kysymyksen.tallennus.ok');
                            $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
                        },
                        function error (resp) {
                            $rootScope.LOGS('ModifyAdditionalQuestionCtrl', 'tallennaMuokkaus()', resp.messageText, resp.status);
                            AlertMsg($scope, 'warning', 'error.tallennus.epaonnistui');
                        }
                    );
                }
                $scope.tallennaClicked = true;
            };
            /**
             * Asetetaan kysymys deleted tilaan HH:n taustajärjestelmässä
             */
            $scope.poistaKysymys = function () {
                $rootScope.LOGS('ModifyAdditionalQuestionCtrl', 'poistaKysymys()');
                QuestionData.setEditFlag(false);
                $modal.open({
                    templateUrl: 'partials/dialogs/poista-kysymys-dialog.html',
                    controller: 'poistaKysymysDialogCtrl',
                    scope: $scope,
                    resolve: {
                        question: function () {
                            return $scope.question;
                        },
                        where: function () {
                            return 'modify';
                        }
                    }
                });
            };
        }]);

