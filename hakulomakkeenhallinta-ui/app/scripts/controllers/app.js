'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers', [])
    .controller('AppCtrl', ['$scope', 'Languages', function($scope, Languages) {
        console.log('************ AppCtrl controller');
            $scope.accordionStates = {};
 //           $scope.languages = Languages.query();
        }
    ]);
