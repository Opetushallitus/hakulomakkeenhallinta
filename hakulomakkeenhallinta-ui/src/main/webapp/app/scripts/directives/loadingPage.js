'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('loadingPage', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/loading-page.html'
        }
    });
