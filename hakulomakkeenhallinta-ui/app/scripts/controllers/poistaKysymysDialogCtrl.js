'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('poistaKysymysDialogCtrl', function ($scope, $modalInstance, question, ThemeQuestions, AlertMsg, where, $routeParams, $location) {
        $scope.question = question;

        $scope.poista = function () {
            ThemeQuestions.deleteQuestion($scope.question._id).then(
                function(data) {
                    if (where === 'modify') {
                        $modalInstance.close();
                        $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
                    } else {
                        $modalInstance.close('close');
                    }
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });


