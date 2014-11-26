'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('alertmsg', [ 'AlertMsg', function (AlertMsg) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/alert-msg.html'
        }
    }]);

