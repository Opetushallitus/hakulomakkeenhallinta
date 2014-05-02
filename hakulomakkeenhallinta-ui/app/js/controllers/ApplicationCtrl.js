"use strict";

angular.module('hakulomakkeenhallinta.application', [])

.controller('ApplicationCtrl', ['$scope', 'Resources', function($scope, Resources) {
        $scope.languages = Resources.languages.query();
        $scope.accordionStates = {};
    }
]);
