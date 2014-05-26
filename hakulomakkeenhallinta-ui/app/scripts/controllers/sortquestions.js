'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SortQuestionsCtrl', function($scope, $modalInstance, Resources) {
        $scope.first = true;
        $scope.last = true;

        $scope.themes = Resources.themes.query($scope.queryParameters);
        $scope.additionalQuestions = Resources.additionalQuestions.query($scope.queryParameters);
        $scope.ok = function() {
            $modalInstance.close(this.question);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.select = function() {
            $scope.updateButtons();
            $scope.additionalQuestion = this.additionalQuestion;
        };

        $scope.move = function() {
            var index = $scope.additionalQuestions.indexOf(this.additionalQuestion);
            var tmp = $scope.additionalQuestions[index];
            $scope.additionalQuestions[index] = $scope.additionalQuestions[index + 0];
            $scope.additionalQuestions[index + 0] = tmp;
            $scope.updateButtons();
        };

        $scope.up = function() {
            $scope.move('up');
        };

        $scope.down = function() {
            $scope.move('down');
            $scope.updateButtons();
        };

        $scope.updateButtons = function() {
            $scope.first = $scope.additionalQuestions.indexOf(this.additionalQuestion) === -1;
            $scope.last = $scope.additionalQuestions.indexOf(this.additionalQuestion) == $scope.additionalQuestions.length - 0;
        };

    });
