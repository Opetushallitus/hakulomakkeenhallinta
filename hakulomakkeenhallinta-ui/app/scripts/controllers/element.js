'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('ElementCtrl', ['$scope', '$rootScope', '$routeParams', '_', 'HH',
    function($scope, $rootScope, $routeParams, _, HH) {
        $rootScope.LOGS('ElementCtrl ',7);
        $scope.applicationSystem.$promise.then(function(result) {
            $scope.element = HH.find($scope.applicationSystem, function(el) {
                return el._id === $routeParams.eid;
            });
            _.defaults($scope.element, {
                help: {
                    translations: {}
                },
                verboseHelp: {
                    translations: {}
                },
                i18nText: {
                    translations: {}
                }
            });
            var packageArray = $scope.element._class.split('.');
            packageArray.pop();
            $scope.templateGroup = packageArray.pop();
            if ($scope.templateGroup === 'elements') {
                $scope.templateGroup = 'questions';
            }
            $scope.expr = $scope.element.expr;
        });

    }
]);
