'use strict';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('backNappi', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/back-nappi.html'
        }
    });
