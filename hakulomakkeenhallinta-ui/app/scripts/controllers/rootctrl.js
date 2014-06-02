'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers', [])
    .controller('RootCtrl', ['$rootScope', '$scope','Props' ,'Languages', function($rootScope, $scope, Props, Languages) {

            $scope.accordionStates = {};
 //           $scope.languages = Languages.query();

        var logs = Props.enableConsoleLogs;

        $rootScope.LOGS = function (msg){
            if (logs) {
                console.log(msg);
            }
        };

        $rootScope.LOGS('RootCtrl '+18);

    }]);
