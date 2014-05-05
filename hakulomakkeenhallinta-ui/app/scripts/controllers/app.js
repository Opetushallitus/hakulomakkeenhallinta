'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers', [])
    .controller('AppCtrl', ['$scope', 'Resources',
        function($scope, Resources) {
            $scope.accordionStates = {};
            $scope.languages = Resources.languages.query();
        }
    ]);
