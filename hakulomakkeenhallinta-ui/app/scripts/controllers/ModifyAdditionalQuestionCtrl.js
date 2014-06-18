'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ModifyAdditionalQuestionCtrl',[ '$scope', '$rootScope', '$location', '$routeParams', 'FormEditor', 'ThemeQuestions', 'QuestionData', 'AlertMsg',
        function ($scope, $rootScope, $location, $routeParams, FormEditor, ThemeQuestions, QuestionData, AlertMsg ) {
            $rootScope.LOGS('ModifyAdditionalQuestionCtrl');
            $scope.languages = [];
            FormEditor.getLanguages().then(
                function(data){
                    $scope.languages = data;
                });
            /**
             * selaimen refresh haetaan kysmyksen data uudestaan HH:n taustajärjestelmästä
             */
            if($routeParams.questionId !== undefined){
                QuestionData.setQuestionData($routeParams.questionId);
            }
            $scope.question = QuestionData.getQuestion();
            $scope.theme;
            QuestionData.getTheme().then(
                function(data){
                    $scope.theme = data;
                });
            $scope.questionType;
            QuestionData.getType().then(function(data){
                $scope.questionType = data;
            });
            QuestionData.setEditFlag(true);
            $scope.editFlag = QuestionData.getEditFlag();
            $scope.validators = QuestionData.getQuestionTypeValidators();

            $rootScope.LOGS('CreatAdditionalQuestionCtrl','themeId:',$routeParams.themeId);
            $rootScope.LOGS('CreatAdditionalQuestionCtrl','QuestionId:', $routeParams.questionId );
            $rootScope.LOGS('CreatAdditionalQuestionCtrl','applicationSystemId:', QuestionData.getApplicationSystemId() );

            /**
             * paluu takaisin edelliselle sivulle
             */
            $scope.back = function() {
                $rootScope.LOGS('ModifyAdditionalQuestionCtrl','back()');
                QuestionData.setEditFlag(false);
                $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
            };
            /**
             * Tallentaan kysymyksen muokkaus HH:n taustajärjestelmään
             */
            $scope.tallennaMuokkaus = function(){
                $rootScope.LOGS('ModifyAdditionalQuestionCtrl','tallennaMuokkaus()');
                QuestionData.setEditFlag(false);
                ThemeQuestions.saveModifiedQuestion($scope.question._id, $scope.question).then(
                    function(data){
                        AlertMsg($scope, 'success','kysymyksen.tallennus.ok');
                        $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
                    });
            };
            /**
             * Asetetaan kysymys deleted tilaan HH:n taustajärjestelmässä
             */
            $scope.poistaKysymys = function(){
                $rootScope.LOGS('ModifyAdditionalQuestionCtrl','poistaKysymys()');
                QuestionData.setEditFlag(false);
                ThemeQuestions.deleteQuestion($scope.question._id).then(
                    function(data){
                        AlertMsg($scope, 'success','kysymyksen.poisto.ok');
                        $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
                    });

            };

            $scope.esikatselu = function(){
                $rootScope.LOGS('ModifyAdditionalQuestionCtrl','ei vielä toteutettu !!!!');
            };

        }]);

