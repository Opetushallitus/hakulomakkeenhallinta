'use strict';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('liitepyyntoNapit', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/liitepyynto-napit.html'
        }
    });
