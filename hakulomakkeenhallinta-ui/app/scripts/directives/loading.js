'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('loading', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/loading.html'
        }
    });


