'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers', [])
    .controller('RootCtrl', ['$rootScope', '$scope','Props' ,'Languages','MyRoles', function($rootScope, $scope, Props, Languages, MyRoles) {

        $scope.accordionStates = {};
        //           $scope.languages = Languages.query();
        $scope.accessRight = false;

        MyRoles.accessRightCheck().then(
            function(data){
                $scope.accessRight = data;
            });

        var logs = Props.enableConsoleLogs;
        $scope.logs = logs;
        $rootScope.LOGS = function (){
            arguments[0] = "<" + arguments[0] + ">";
            if (logs) {
                console.log(arguments);
            }
        };


        $rootScope.LOGS('RootCtrl',18);

        $scope.$on('LOAD', function(){
            $rootScope.LOGS('RootCtrl',20,'LOAD');
            $scope.loading = true;
        });
        $scope.$on('LOADREADY', function(){
            $rootScope.LOGS('RootCtrl',25,'LOADREADY');
            $scope.loading = false;
        });

    }]);
