'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
  .controller('CreateAdditionalQuestionCtrl',[ '$scope', '$location', '$routeParams', 'Languages', 'ASForms', 'QuestionData',
        function ($scope, $location, $routeParams, Languages, ASForms, QuestionData ) {
        var elemTypePrefix = "fi.vm.sade.haku.oppija.lomake.domain.elements.questions.";

        $scope.element = QuestionData.getElement();
        $scope.questionType = QuestionData.getQuestionType();
        $scope.languages = Languages.query();
        $scope.applicationSystem =QuestionData.getApplicationSystem();

        $scope.question = QuestionData.getQuestion();
        $scope.question._class = elemTypePrefix + $scope.questionType.id;

        $scope.back = function() {
            $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid);
        };

        $scope.ok = function() {
            ASForms.save( { _id: $scope.applicationSystem._id , _eid: $scope.element._id }, $scope.question).$promise.then(
                function(data){
                    $scope.question = data;
                    QuestionData.setQuestion(data);
                });
        };
  }]);
