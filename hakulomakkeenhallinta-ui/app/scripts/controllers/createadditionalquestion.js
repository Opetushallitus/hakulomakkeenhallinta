'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
  .controller('CreateAdditionalQuestionCtrl',[ '$scope', '$location', '$routeParams', 'Languages', 'ASForms', 'QuestionData',
        function ($scope, $location, $routeParams, Languages, ASForms, QuestionData ) {
        $scope.languages = Languages.query();
        $scope.question = QuestionData.getQuestion();
        $scope.element = QuestionData.getElement();
        $scope.questionType = QuestionData.getQuestionType();
        $scope.editFlag = QuestionData.getEditFlag();

        if($scope.question._id === undefined){
            console.log($routeParams.eid);
            ASForms.get({'_id':$routeParams.id, '_aoid':$routeParams.aoid, '_qid': $routeParams.eid}).$promise.then(
                function(data){
                    QuestionData.setQuestion(data);
                    $scope.question = QuestionData.getQuestion();
                    $scope.element = QuestionData.getElement();
                    $scope.questionType = QuestionData.getQuestionType();
                    if($scope.question._id !== ""){
                        QuestionData.setEditFlag(true);
                    }
                    $scope.editFlag = QuestionData.getEditFlag();
                });
        }


        $scope.back = function() {
            QuestionData.setEditFlag(false);
            $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
        };

        $scope.tallennaUusi = function() {
            ASForms.save( { _id: $scope.question.applicationSystemId , '_aoid': $scope.question.preference, '_eid':$scope.question.theme }, $scope.question).$promise.then(
                function(data){
                    QuestionData.setQuestion(data);
                    $location.path('/additionalQuestion/'+$scope.question.applicationSystemId+'/'+$scope.question.preference);
                });
        };

       $scope.tallennaMuokkaus = function(){
           QuestionData.setEditFlag(false);
           console.log($scope.question.applicationSystemId, $scope.question.preference, ' ', $scope.question._id )
           ASForms.update({'_id':$scope.question.applicationSystemId, '_aoid': $scope.question.preference, '_qid': $scope.question._id }, $scope.question).$promise.then(
               function(){
                   $location.path('/additionalQuestion/'+$scope.question.applicationSystemId+'/'+$scope.question.preference);
               });
       };

       $scope.poistaKysymys = function(){
           QuestionData.setEditFlag(false);

           ASForms.delete({'_id':$scope.question.applicationSystemId, '_aoid': $scope.question.preference, '_qid': $scope.question._id }).$promise.then(
               function(){
                   $location.path('/additionalQuestion/'+$scope.question.applicationSystemId+'/'+$scope.question.preference);
               });

       };

       $scope.esikatselu = function(){
           console.log('ei vielä toteutettu !!!!');
       };

       $scope.addCheckbox = function(question){
           var optionObj = {};
           var qIndx = question.options.length;
           optionObj.translations = {};
           optionObj._id = 'option_'+qIndx;
           question.options[qIndx] = optionObj;
       };

       $scope.removeCheckbox = function(indx, question){
           if(question.options.length >1 ){
               question.options.splice(indx ,1);
           }
           for(var optionIndx in question.options){
                question.options[optionIndx]._id = 'option_'+optionIndx;
           }
       };

       $scope.addRadio = function(question){
           var optionObj = {};
           var qIndx = question.options.length;
           optionObj.translations = {};
           optionObj._id = 'option_'+qIndx;
           question.options[qIndx] = optionObj;

       };

       $scope.removeRadio = function(indx, question){
           if(question.options.length >2 ){
               question.options.splice(indx ,1);
           }
           for(var optionIndx in question.options){
               question.options[optionIndx]._id = 'option_'+optionIndx;
           }
       };

  }]);
