'use strict';

angular.module('hakulomakkeenhallintaUiApp')

.controller('BackCtrl', ['$scope', '$location',
    function($scope, $location) {
        $scope.back = function() {
            var path = $location.path().split("/");
            path.pop();
            $location.path(path.join('/'));
        };
        $scope.goto = function(element) {
            $location.path($location.path() + '/' + element._id);
        };
    }
]);
