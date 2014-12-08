'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('hakukohdeKysymysCtrl', [ '$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.LOGS('hakukohdeKysymysCtrl');

        $scope.naytaVastaukset = false;
        $scope.toggleNaytaVastaukset = function () {
            $scope.naytaVastaukset = !$scope.naytaVastaukset;
        };

    }]);
