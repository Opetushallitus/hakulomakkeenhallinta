'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('lisakysymykset', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/lisakysymykset.html',
            controller: function ($scope) {
                $scope.naytaVastaukset = false;
                $scope.toggleNaytaVastaukset = function () {
                    $scope.naytaVastaukset = !$scope.naytaVastaukset;
                };
            }

        };
    });
