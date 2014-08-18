'use strict';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('lisakysymysListaNapit', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/lisakysymys-lista-napit.html'
        };
    });
