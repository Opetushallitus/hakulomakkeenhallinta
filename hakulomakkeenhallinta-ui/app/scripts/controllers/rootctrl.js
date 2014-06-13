'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers', [])
    .controller('RootCtrl', ['$rootScope', '$scope','Props' ,'Languages','MyRoles', 'LocalisationService',
        function($rootScope, $scope, Props, Languages, MyRoles, LocalisationService ) {

        $scope.accordionStates = {};
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

        // Astetaan käännösteksti valitulla avaimelle
        $scope.t = function(key) {
            return LocalisationService.tl(key);
        };

        $rootScope.LOGS('RootCtrl',1);

        $scope.$on('LOAD', function(){
            $rootScope.LOGS('RootCtrl',2,'LOAD');
            $scope.loading = true;
        });
        $scope.$on('LOADREADY', function(){
            $rootScope.LOGS('RootCtrl',3,'LOADREADY');
            $scope.loading = false;
        });

    }]);
