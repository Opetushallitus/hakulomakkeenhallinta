'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('ExprCtrl', ['$scope',
    function($scope) {
        $scope.expr = $scope.element.expr;
    }
]);
