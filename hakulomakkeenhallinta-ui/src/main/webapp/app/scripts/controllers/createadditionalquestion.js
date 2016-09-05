'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateAdditionalQuestionCtrl', [ '$scope', '$rootScope', '$location', '$routeParams', 'FormEditor', 'ThemeQuestions', 'QuestionData', 'AlertMsg', '$filter', '_', 'JatkokysymysService', 'TarjontaAPI', 'Organisaatio',
        function ($scope, $rootScope, $location, $routeParams, FormEditor, ThemeQuestions, QuestionData, AlertMsg, $filter, _, JatkokysymysService, TarjontaAPI, Organisaatio) {
            $rootScope.LOGS('CreateAdditionalQuestionCtrl');
            $scope.languages = [];
            $scope.theme = {};
            $scope.question = {};
            $scope.questionType = {};
            $scope.editFlag = false;
            $scope.validators = [];
            $scope.hakukohde = {};
            $scope.applicationSystem = {};
            $scope.haunNimi = '';
            $scope.hakukohdeNimi = '';
            $scope.haunHakuajat = [];
            $scope.teema = '';
            $scope.kysymysTyyppi = '';
            $scope.tallennaClicked = false;
            var luodaaJatkoKysymys = undefined;

            if (JatkokysymysService.getParentQuestion() !== undefined) {
                luodaaJatkoKysymys = JatkokysymysService.getParentQuestion();
            }

            FormEditor.getLanguages().then(
                function (data) {
                    $scope.languages = data;
                }
            );
            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function (data) {
                    $scope.applicationSystem = data;
                    $scope.haunNimi = $filter('i18n')($scope.applicationSystem, 'name', $scope.userLang);
                }
            );
            /**
             * Haetaan haun hakuajat
             */
            FormEditor.getApplicationSystemFormApplicationPeriods($routeParams.id).then(
                function (data) {
                    $scope.haunHakuajat = data;
                }
            );
            TarjontaAPI.fetchHakukohdeInfo($routeParams.hakuOid).then(
                function (data) {
                    $scope.hakukohde = data;
                    $scope.hakukohdeNimi = $filter('hakukohdeNimi')($scope.hakukohde, $scope.userLang);
                    if (data === 'NOT_FOUND') {
                        haeHakukohdeRyhma();
                    }
                }
            );

            function haeHakukohdeRyhma() {
                Organisaatio.getOrganisationData($routeParams.hakuOid).then(
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

            /**
             * selaimen refresh tapauksessa luodaan lisäkysymys uudestaan
             */
            if ($routeParams.themeId !== undefined && QuestionData.getApplicationSystemId() === undefined) {
                QuestionData.newAdditionalQuestion();
            }
            QuestionData.setApplicatioSystemId($routeParams.id);
            QuestionData.setLearningOpportunityId($routeParams.hakuOid);
            QuestionData.setThemeId($routeParams.themeId);
            QuestionData.setQuestionType($routeParams.qtype);
            QuestionData.setEditFlag(false);
            $scope.question = QuestionData.getQuestion();
            QuestionData.getTheme().then(
                function (data) {
                    $scope.theme = data;
                    $scope.teema = $filter('i18n')($scope.theme, 'name', $scope.userLang);
                }
            );

            QuestionData.getType($routeParams.qtype).then(
                function (data) {
                    $scope.questionType = data;
                    $scope.kysymysTyyppi = $filter('i18n')($scope.questionType, 'name', $scope.userLang);
                }
            );

            $scope.editFlag = QuestionData.getEditFlag();
            $scope.validators = QuestionData.getQuestionTypeValidators();
            /**
             * paluu takaisin edelliselle sivulle
             */
            $scope.back = function () {
                $rootScope.LOGS('CreateAdditionalQuestionCtrl ', 'back()');
                QuestionData.setEditFlag(false);
                if (luodaaJatkoKysymys !== undefined) {
                    JatkokysymysService.setJatkokysymysObj(undefined);
                    JatkokysymysService.setParentQuestion(undefined);
                }
                $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
            };
            /**
             *Tallentaan uusi lisäkysymys HH:n taustajärjestelmään
             */
            $scope.tallennaUusi = function () {
                $rootScope.LOGS('CreateAdditionalQuestionCtrl ', 'tallennaUusi()');

                if ($scope.kysymys.validationFn) {
                    $scope.kysymys.$setValidity('required', $scope.kysymys.validationFn());
                }
                else {
                    $scope.kysymys.otsikko.$setValidity('required', $scope.tarkistaPakollisuus($scope.question.messageText.translations));
                }
                if (luodaaJatkoKysymys !== undefined) {
                    $scope.question.parentId = JatkokysymysService.getParentQuestion().parentId;
                    $scope.question.followupCondition = JatkokysymysService.getParentQuestion().followupCondition;
                }
                if ($scope.kysymys.$valid) {
                    ThemeQuestions.createNewQuestion($routeParams.id, $routeParams.hakuOid, $routeParams.themeId, $scope.question).then(
                        function success (data) {
                            QuestionData.setQuestion(data);
                            if (luodaaJatkoKysymys !== undefined) {
                                JatkokysymysService.setJatkokysymysObj(undefined);
                                JatkokysymysService.setParentQuestion(undefined);
                            }
                            AlertMsg($scope, 'success', 'kysymyksen.tallennus.ok');
                            $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
                        },
                        function error (resp) {
                            $rootScope.LOGS('CreateAdditionalQuestionCtrl', 'tallennaUusi()', resp.statusText, resp.status);
                            AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                        }
                    );
                }
                $scope.tallennaClicked = true;
            };


            $scope.isBeforeFirstHakuaika = function() {
                return new Date() < _.min(_.map($scope.haunHakuajat, function(ha) {return ha.start}));
            };

            $scope.isHakuaikaGoing = function() {
                const now = new Date();
                return _.some($scope.haunHakuajat, function(ha) {return ha.start <= now && now <= ha.end})
            };

            $scope.isKysymyksenMuokkausSallittu = function() {
                return $scope.isRekisterinpitaja || $scope.isBeforeFirstHakuaika();
            };

            $scope.isKysymyksenLisaysSallittu = function() {
                return $scope.isRekisterinpitaja || !$scope.isHakuaikaGoing();
            };

            $scope.isTallennusSallittu = function() {
                return $scope.editFlag ? $scope.isKysymyksenMuokkausSallittu() : $scope.isKysymyksenLisaysSallittu();
            };
        }]);
