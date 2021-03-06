'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('lisakysymykset', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/lisakysymykset.html',
            controller: function ($scope) {
                $scope.naytaKysymysLista = false;
                $scope.toggleNaytaKysymykset = function () {
                    $scope.naytaKysymysLista = !$scope.naytaKysymysLista;
                };
            }

        };
    });
