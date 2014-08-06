'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateAdditionalQuestionCtrl', [ '$scope', '$rootScope', '$location', '$routeParams', 'FormEditor', 'ThemeQuestions', 'QuestionData', 'AlertMsg', '$filter',
        function ($scope, $rootScope, $location, $routeParams, FormEditor, ThemeQuestions, QuestionData, AlertMsg, $filter) {
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
            $scope.teema = '';
            $scope.kysymysTyyppi = '';
            $scope.tallennaClicked = false;

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
            QuestionData.getHakukohdeInfo($routeParams.hakuOid).then(
                function (data) {
                    $scope.hakukohde = data;
                    $scope.hakukohdeNimi = $filter('hakukohdeNimi')($scope.hakukohde, $scope.userLang);
                }
            );
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
                    $scope.questionType =  data;
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
                $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
            };
            /**
             *Tallentaan uusi lisäkysymys HH:n taustajärjestelmään
             */
            $scope.tallennaUusi = function () {
                $rootScope.LOGS('CreateAdditionalQuestionCtrl ', 'tallennaUusi()');
                if ($scope.kysymys.$valid) {
                    ThemeQuestions.createNewQuestion($routeParams.id, $routeParams.hakuOid, $routeParams.themeId, $scope.question).then(
                        function success (data) {
                            QuestionData.setQuestion(data);
                            AlertMsg($scope, 'success', 'kysymyksen.tallennus.ok');
                            $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
                        },
                        function error (resp) {
                            $rootScope.LOGS('CreateAdditionalQuestionCtrl', 'tallennaUusi()', resp.statusText, resp.status);
                            AlertMsg($scope, 'warning', 'error.tallennus.epaonnistui');
                        }
                    );
                }
                $scope.tallennaClicked = true;
            };

            $scope.esikatselu = function () {
                $rootScope.LOGS('CreateAdditionalQuestionCtrl ', 'ei vielä toteutettu !!!!');
            };

        }]);
