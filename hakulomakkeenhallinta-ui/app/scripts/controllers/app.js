'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers', [])
    .controller('AppCtrl', ['$scope', 'Languages', function($scope, Languages) {
            $scope.accordionStates = {};
            $scope.languages = Languages.query();
        }
    ]);
