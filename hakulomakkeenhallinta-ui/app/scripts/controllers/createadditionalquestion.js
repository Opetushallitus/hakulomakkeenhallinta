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

        $scope.back = function() {
            $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
        };

        $scope.ok = function() {

            ASForms.save( { _id: $scope.applicationSystem._id , _eid: $scope.element._id }, $scope.question).$promise.then(
                function(data){
                    QuestionData.setQuestion(data);
                    $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
                });
        };
  }]);
