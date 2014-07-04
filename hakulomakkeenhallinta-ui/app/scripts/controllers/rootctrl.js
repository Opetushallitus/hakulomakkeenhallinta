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
            $scope.userLang;
            /**
             * katsotaan käyttäjän käyttöprofiilista cas/myroles tiedostosta
             * hänen palveluun määrittämä käyttökieli
             */
            MyRoles.getUserLang().then(function(data){
                $scope.userLang = data;
                $rootScope.LOGS('RootCtrl', 'userLanguage: ',data);
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
            $scope.t = function(key, params) {
                return LocalisationService.tl(key, params);
            };

            $rootScope.LOGS('RootCtrl');
            /**
             * lataus indikaattori näyttäminen käyttöliittymässä
             */
            $scope.$on('LOAD', function(){
                $rootScope.LOGS('RootCtrl','LOAD');
                $scope.loading = true;
            });
            /**
             * lataus indikaattorin poistaminen käyttöliittymästä
             */
            $scope.$on('LOADREADY', function(){
                $rootScope.LOGS('RootCtrl','LOADREADY');
                $scope.loading = false;
            });
            /**
             * asettaa suomenkielisen kentän vaadituksi arvoksi
             * lomakkeen ng-required tarkistuksesssa
             * @param langId kielien id ( fi | sv | en)
             * @returns boolean
             */
            $scope.requiredByFiLang = function(langId){
                if(langId === 'fi'){
                    return true;
                }
                return false;
            };

        }]);
