'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('alertmsg', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/alert-msg.html'
        }
    });

