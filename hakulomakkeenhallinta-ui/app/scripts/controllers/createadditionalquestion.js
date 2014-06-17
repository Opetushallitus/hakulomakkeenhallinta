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
        getQuestionTypeValidators();

        $rootScope.LOGS('CreatAdditionalQuestionCtrl','themeId:',$routeParams.themeId);
        $rootScope.LOGS('CreatAdditionalQuestionCtrl','QuestionId:', $routeParams.questionId );
        $rootScope.LOGS('CreatAdditionalQuestionCtrl','QuestionId:', QuestionData.getApplicationSystemId() );

        //browser refresh luodaan uusi lisäkysymys case
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
            getQuestionTypeValidators();
        }

        //browser refresh muokkaa kysymysta case
        if($routeParams.questionId !== undefined){
            QuestionData.setQuestionData($routeParams.questionId).then(
                function(){
                    $scope.question = QuestionData.getQuestion();
                    $scope.element = QuestionData.getElement();
                    $scope.questionType = QuestionData.getQuestionType();
                    QuestionData.setEditFlag(true);
                    $scope.editFlag = QuestionData.getEditFlag();
                    getQuestionTypeValidators();
                });

        }

        $scope.back = function() {
            $rootScope.LOGS('CreateAdditionalQuestionCtrl ','CQC back()');
            QuestionData.setEditFlag(false);
            $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
        };

        $scope.tallennaUusi = function() {
            if($scope.question.messageText.translations.fi === ''){

            }
            $rootScope.LOGS('CreateAdditionalQuestionCtrl ','CQC tallennaUusi()');
            ThemeQuestions.createNewQuestion( $routeParams.id, $routeParams.hakuOid, $routeParams.themeId, $scope.question).then(
                function(data){
                    QuestionData.setQuestion(data);
                    AlertMsg($scope, 'success','kysymyksen.tallennus.ok');
                    $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
                });
        };

       $scope.tallennaMuokkaus = function(){
           $rootScope.LOGS('CreateAdditionalQuestionCtrl ','CQC tallennaMuokkaus()');
           QuestionData.setEditFlag(false);
           ThemeQuestions.save({'_id': $scope.question._id }, $scope.question).$promise.then(
               function(){
                   $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
               });
       };

       $scope.poistaKysymys = function(){
           $rootScope.LOGS('CreateAdditionalQuestionCtrl ','CQC poistaKysymys');
           QuestionData.setEditFlag(false);
           ThemeQuestions.delete({'_id': $scope.question._id }).$promise.then(
               function(){
                   $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
               });

       };

       $scope.esikatselu = function(){
           $rootScope.LOGS('CreateAdditionalQuestionCtrl ','ei vielä toteutettu !!!!');
       };

       $scope.addCheckbox = function(question){
           var optionObj = {};
           var qIndx = question.options.length;
           optionObj.optionText = {}
           optionObj.optionText.translations = {};
           optionObj.id = 'option_'+qIndx;
           question.options[qIndx] = optionObj;
       };

       $scope.removeCheckbox = function(indx, question){
           if(question.options.length >1 ){
               question.options.splice(indx ,1);
           }
           for(var optionIndx in question.options){
                question.options[optionIndx].id = 'option_'+optionIndx;
           }
       };

       $scope.addRadio = function(question){
           var optionObj = {};
           var qIndx = question.options.length;
           optionObj.optionText = {};
           optionObj.optionText.translations = {};
           optionObj.id = 'option_'+qIndx;
           question.options[qIndx] = optionObj;

       };

       $scope.removeRadio = function(indx, question){
           if(question.options.length >2 ){
               question.options.splice(indx ,1);
           }
           for(var optionIndx in question.options){
               question.options[optionIndx].id = 'option_'+optionIndx;
           }
       };

       $scope.minValueValidator = function(question, value){
           if(question.validators === undefined){
                question.validators = [];
            }else{
                $rootScope.LOGS('createAdditionalQuestion', 134, $scope.validatorMin );
                $rootScope.LOGS('createAdditionalQuestion', 134, value );
                var min = {};
                min.min = value;
                question.validators[0] = min
            }
       };

        $scope.maxValueValidator = function(question, value){
            if(question.validators === undefined){
                question.validators = [];
            }else{
                var max = {};
                max.max = value;
                question.validators[1] = max;
            }
        };

        function getQuestionTypeValidators(){
            var question = QuestionData.getQuestion();
            var editFlag = QuestionData.getEditFlag();

            $rootScope.LOGS('CreateAdditionalQuestionCtrl ','getQuestionTypeValidators() ' , $scope.element , $scope.questionType );
            $rootScope.LOGS('CreateAdditionalQuestionCtrl ','getQuestionTypeValidators() ',question.type);
            switch(question.type){
                case 'TextQuestion':

                    $scope.validators = QuestionData.getTextQuestionValidators();
                    break;

                case 'CheckBox':

                    if(!editFlag){
                        question.options = [];
                        question.validators = {};
                        var optionObj = {};
                        optionObj.optionText ={};
                        optionObj.optionText.translations = {};
                        optionObj.id = 'option_0';
                        question.options[0] = optionObj;
                    }
                    $scope.validators = QuestionData.getCheckboxValidators();
                    break;

                case 'RadioButton':

                    if(!editFlag){
                        question.options = [];
                        var radioObj = {};
                        radioObj.optionText ={};
                        radioObj.optionText.translations = {};
                        radioObj.id = 'option_0';
                        var radioObj2 = {};
                        radioObj2.optionText = {};
                        radioObj2.optionText.translations = {};
                        radioObj2.id = 'option_1';
                        question.options[0] = radioObj;
                        question.options[1] = radioObj2;
                    }
                    $scope.validators = QuestionData.getRadioValidators();
                    break;
            };

        };

  }]);
