'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
  .controller('CreateAdditionalQuestionCtrl',[ '$scope', '$location', '$routeParams', 'FormEditor', 'ThemeQuestions', 'QuestionData',
        function ($scope, $location, $routeParams, FormEditor, ThemeQuestions, QuestionData ) {
        console.log(' ******* CreateAdditionalQuestionCtrl ******');
        $scope.languages = [];
        FormEditor.get({'_path':'languages'}).$promise.then(
            function(data){
                $scope.languages = data;
            });

        $scope.question = QuestionData.getQuestion();
        $scope.element = QuestionData.getElement();
        $scope.questionType = QuestionData.getQuestionType();
        $scope.editFlag = QuestionData.getEditFlag();
        getQuestionType();
        if($scope.question._id === undefined){
            console.log('browser refresh: ',$routeParams.questionId );
            ThemeQuestions.get({'_id': $routeparams.questionId}).$promise.then(
                function(data){
                    console.log(data);
                    QuestionData.setQuestion(data);
                    $scope.question = QuestionData.getQuestion();
                    $scope.element = $scope.question.theme;
                    $scope.questionType = $scope.question.type;
                    if($scope.question._id !== ""){
                        QuestionData.setEditFlag(true);
                    }
                    $scope.editFlag = QuestionData.getEditFlag();
                    getQuestionType();
                });
        }


        $scope.back = function() {
            console.log('CQC back');
            QuestionData.setEditFlag(false);
            $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
        };

        $scope.tallennaUusi = function() {
            console.log('CQC tallenna uusi');
            ThemeQuestions.save( { _id: $routeParams.id, '_aoid': $routeParams.hakuOid , '_themeId': $routeParams.themeId  }, $scope.question).$promise.then(
                function(data){
                    QuestionData.setQuestion(data);
                    $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
                });
        };

       $scope.tallennaMuokkaus = function(){
           console.log('CQC tallenna muokkaus');
           QuestionData.setEditFlag(false);
           ThemeQuestions.save({'_id': $scope.question._id }, $scope.question).$promise.then(
               function(){
                   $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
               });
       };

       $scope.poistaKysymys = function(){
           console.log('CQC poistaKysymys');
           QuestionData.setEditFlag(false);
           ThemeQuestions.delete({'_id': $scope.question._id }).$promise.then(
               function(){
                   $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid);
               });

       };

       $scope.esikatselu = function(){
           console.log('ei vielä toteutettu !!!!');
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

        function getQuestionType(){
            var question = QuestionData.getQuestion();
            var editFlag = QuestionData.getEditFlag();

            console.log( $scope.element,' ',$scope.questionType );
            console.log(question.type);
            switch(question.type){
                case 'TextQuestion':

                    $scope.validators = QuestionData.getTextQuestionValidators();
                    break;

                case 'CheckBox':

                    if(!editFlag){
                        question.options = [];
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
