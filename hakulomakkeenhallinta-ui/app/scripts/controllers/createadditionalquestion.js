'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateAdditionalQuestionCtrl',[ '$scope', '$rootScope', '$location', '$routeParams', 'FormEditor', 'ThemeQuestions', 'QuestionData', 'AlertMsg',
        function ($scope, $rootScope, $location, $routeParams, FormEditor, ThemeQuestions, QuestionData, AlertMsg ) {
            $rootScope.LOGS('CreateAdditionalQuestionCtrl');
            $scope.languages = [];
            FormEditor.getLanguages().then(
                function(data){
                    $scope.languages = data;
                });

            $scope.question = QuestionData.getQuestion();
            $scope.element = QuestionData.getElement();
            $scope.questionType = QuestionData.getQuestionType();
            $scope.editFlag = QuestionData.getEditFlag();
            $scope.validators = QuestionData.getQuestionTypeValidators();

            $rootScope.LOGS('CreatAdditionalQuestionCtrl','themeId:',$routeParams.themeId);
            $rootScope.LOGS('CreatAdditionalQuestionCtrl','QuestionId:', $routeParams.questionId );
            $rootScope.LOGS('CreatAdditionalQuestionCtrl','applicationSystemId:', QuestionData.getApplicationSystemId() );
            /**
             * selaimen refresh tapauksessa luodaan lisäkysymys uudestaan
             */
            if($routeParams.themeId !== undefined && QuestionData.getApplicationSystemId() === undefined){
                QuestionData.newAdditionalQuestion();
                QuestionData.setElement($routeParams.themeId);
                QuestionData.setQuestionType($routeParams.qtype);
                QuestionData.setApplicatioSystemId($routeParams.id);
                QuestionData.setEditFlag(false);
                QuestionData.setType($routeParams.qtype);
                QuestionData.setLearningOpportunityId($routeParams.oid);
                $scope.question = QuestionData.getQuestion();
                $scope.element = QuestionData.getElement();
                $scope.questionType = QuestionData.getQuestionType();
                $scope.editFlag = QuestionData.getEditFlag();
                $scope.validators = QuestionData.getQuestionTypeValidators();
            }
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
                if($scope.question.messageText.translations.fi === ''){

                }
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
