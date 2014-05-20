'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
  .controller('CreateAdditionalQuestionCtrl',[ '$scope', '$location', '$routeParams', 'Languages', 'ASForms', 'QuestionData',
        function ($scope, $location, $routeParams, Languages, ASForms, QuestionData ) {

        $scope.element = QuestionData.getElement();
        $scope.questionType = QuestionData.getQuestionType();
        $scope.languages = Languages.query();
        $scope.applicationSystem =QuestionData.getApplicationSystem();
        $scope.question = QuestionData.getQuestion();
        $scope.question.applicationSystemId = $scope.applicationSystem._id;
        $scope.question.preference = $routeParams.aoid;
        $scope.editFlag = QuestionData.getEditFlag();

        $scope.back = function() {
            QuestionData.setEditFlag(false);
            $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
        };

        $scope.tallennaUusi = function() {
            ASForms.save( { _id: $scope.applicationSystem._id , _eid: $scope.element._id }, $scope.question).$promise.then(
                function(data){
                    QuestionData.setQuestion(data);
                    $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
                });
        };

       $scope.tallennaMuokkaus = function(){
           QuestionData.setEditFlag(false);
           ASForms.update({'_id':$routeParams.id, '_eid': $routeParams.aoid, '_qid': $scope.question._id }, $scope.question).$promise.then(
               function(){
                   $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
               });
       };

       $scope.poistaKysymys = function(){
           QuestionData.setEditFlag(false);
           ASForms.delete({'_id':$routeParams.id, '_eid': $routeParams.aoid, '_qid': $scope.question._id }).$promise.then(
               function(){
                   $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
               });

       };

       $scope.esikatselu = function(){
           console.log('ei vielä toteutettu !!!!');
       };

  }]);
