'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('loading', function ($rootScope) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/loading.html',
            scope: {
                startLoading: '@'
            },
            link: function (scope, element) {
                scope.loading = scope.startLoading;
                /**
                 * lataus indikaattori näyttäminen käyttöliittymässä
                 */
                scope.$parent.$on('LOAD', function () {
                        $rootScope.LOGS('loading', 'LOAD');
                        scope.loading = true;
                    }
                );
                /**
                 * lataus indikaattorin poistaminen käyttöliittymästä
                 */
                scope.$parent.$on('LOADREADY', function () {
                        $rootScope.LOGS('loading', 'LOADREADY');
                        scope.loading = false;
                    }
                );
                element.on('$destroy', function () {
                    scope.$destroy();
                });

            }
        }
    });


