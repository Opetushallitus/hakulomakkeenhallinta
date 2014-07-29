'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('poistaKysymysDialogCtrl', function ($scope, $modalInstance, question, ThemeQuestions, AlertMsg, where, $routeParams, $location) {
        $scope.question = question;

        $scope.poista = function () {
            console.log('poistetaan ', $scope.question._id, where);
            ThemeQuestions.deleteQuestion($scope.question._id).then(
                function(data) {
                    AlertMsg($scope, 'success', 'kysymyksen.poisto.ok');
                    if (where === 'modify') {
                        $modalInstance.close();
                        $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
                    } else {
                        $modalInstance.close();
                        $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
                    }
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });


