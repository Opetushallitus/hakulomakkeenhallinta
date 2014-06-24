'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateAdditionalQuestionCtrl',[ '$scope', '$rootScope', '$location', '$routeParams', 'FormEditor', 'ThemeQuestions', 'QuestionData', 'AlertMsg',
        function ($scope, $rootScope, $location, $routeParams, FormEditor, ThemeQuestions, QuestionData, AlertMsg ) {
            $rootScope.LOGS('CreateAdditionalQuestionCtrl');
            $scope.languages = [];
            $scope.theme = {};
            $scope.question = {};
            $scope.questionType = {};
            $scope.editFlag = false;
            $scope.validators = [];

            FormEditor.getLanguages().then(
                function(data){
                    $scope.languages = data;
                });
            /**
             * selaimen refresh tapauksessa luodaan lisäkysymys uudestaan
             */
            if($routeParams.themeId !== undefined && QuestionData.getApplicationSystemId() === undefined){
                QuestionData.newAdditionalQuestion();
            }
            QuestionData.setApplicatioSystemId($routeParams.id);
            QuestionData.setLearningOpportunityId($routeParams.hakuOid);
            QuestionData.setThemeId($routeParams.themeId);
            QuestionData.setQuestionType($routeParams.qtype);
            QuestionData.setEditFlag(false);
            $scope.question = QuestionData.getQuestion();
            QuestionData.getTheme().then(
                function(data){
                    $scope.theme = data;
                });

            QuestionData.getType($routeParams.qtype).then(function(data){
                $scope.questionType =  data;
            });
            $scope.editFlag = QuestionData.getEditFlag();
            $scope.validators = QuestionData.getQuestionTypeValidators();
            /**
             * paluu takaisin edelliselle sivulle
             */
            $scope.back = function() {
                $rootScope.LOGS('CreateAdditionalQuestionCtrl ','back()');
                QuestionData.setEditFlag(false);
                $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
            };
            /**
             *Tallentaan uusi lisäkysymys HH:n taustajärjestelmään
             */
            $scope.tallennaUusi = function() {
                $rootScope.LOGS('CreateAdditionalQuestionCtrl ','tallennaUusi()');
                ThemeQuestions.createNewQuestion( $routeParams.id, $routeParams.hakuOid, $routeParams.themeId, $scope.question).then(
                    function(data){
                        QuestionData.setQuestion(data);
                        AlertMsg($scope, 'success','kysymyksen.tallennus.ok');
                        $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
                    });

            };

            $scope.esikatselu = function(){
                $rootScope.LOGS('CreateAdditionalQuestionCtrl ','ei vielä toteutettu !!!!');
            };

        }]);
