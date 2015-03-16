'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('alertmsgspan', [ 'AlertMsg', function (AlertMsg) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/alert-msg-span.html'
        }
    }]);

