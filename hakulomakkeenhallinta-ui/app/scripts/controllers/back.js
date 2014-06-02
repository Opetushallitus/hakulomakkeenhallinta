'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('BackCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        $scope.back = function() {
            var path = $location.path().split("/");
            path.pop();
            $location.path(path.join('/'));
        };
        $scope.goto = function(element) {
            $rootScope.LOGS('BackCtrl ',13 ,$location.path() + '/' + element._id);
            $location.path($location.path() + '/' + element._id);
        };
    }
]);
