'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('poistaKysymysDialogCtrl', function ($rootScope, $scope, $modalInstance, question, ThemeQuestions, AlertMsg, where, $routeParams, $location) {
        $scope.question = question;
        $scope.poistoEiOnnistu = false;
        $scope.poista = function () {
            ThemeQuestions.deleteQuestion($scope.question._id).then(
                function success() {
                    if (where === 'modify') {
                        $modalInstance.close();
                        $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid);
                    } else {
                        $modalInstance.close('close');
                    }
                },
                function error(resp) {
                    $rootScope.LOGS('poistaKysymysDialogCtrl', 'poista', resp.messageText, resp.status);
                    $scope.poistoEiOnnistu = true;
                    if(resp.data.message !== undefined) {
                        AlertMsg($scope, 'warning', resp.data.message);
                    } else {
                        AlertMsg($scope, 'warning', 'error.kysymyksen.poisto');
                    }

                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });


