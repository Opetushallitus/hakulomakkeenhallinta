'use strict';

angular.module('hakulomakkeenhallintaUiApp')

.controller('ExprCtrl', ['$scope',
    function($scope) {
        $scope.expr = $scope.element.expr;
    }
]);
