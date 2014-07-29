'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('poistaKysymysDialogCtrl', function ($scope, $modalInstance, question, ThemeQuestions, AlertMsg) {
        $scope.question = question;

        $scope.ok = function (question) {
            console.log('poistetaan ', $scope.question._id);
            ThemeQuestions.deleteQuestion($scope.question._id).then(
                function(data){
                    AlertMsg($scope, 'success','kysymyksen.poisto.ok');
                    $modalInstance.close();
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });


