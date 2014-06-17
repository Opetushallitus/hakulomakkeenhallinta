'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers', [])
    .controller('RootCtrl', ['$rootScope', '$scope','Props' ,'MyRoles', 'LocalisationService', 'AlertMsg',
        function($rootScope, $scope, Props, MyRoles, LocalisationService, AlertMsg ) {

            /**
             * käyttäjän käyttöprofiilin tarkastus cas/myroles tiedostosta
             */
            MyRoles.accessRightCheck().then(
                function(data){
                    if(!data){
                        AlertMsg($scope,  'warning', 'ei.riittavia.kaytto.oikeuksia');
                    }
                });

            var logs = Props.enableConsoleLogs;
            $scope.logs = logs;
            /**
             * consoli logien näyttäminen debugausta varten
             * @constructor
             */
            $rootScope.LOGS = function (){
                arguments[0] = "<" + arguments[0] + ">";
                if (logs) {
                    console.log(arguments);
                }
            };

            /**
             * Astetaan käännösteksti valitulla avaimelle
             * @param key
             * @returns {*}
             */
            $scope.t = function(key) {
                return LocalisationService.tl(key);
            };

            $rootScope.LOGS('RootCtrl',1);
            /**
             * lataus indikaattori näyttäminen käyttöliittymässä
             */
            $scope.$on('LOAD', function(){
                $rootScope.LOGS('RootCtrl',2,'LOAD');
                $scope.loading = true;
            });
            /**
             * lataus indikaattorin poistaminen käyttöliittymästä
             */
            $scope.$on('LOADREADY', function(){
                $rootScope.LOGS('RootCtrl',3,'LOADREADY');
                $scope.loading = false;
            });

        }]);
