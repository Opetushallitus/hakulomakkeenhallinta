'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LuoHakemuslomakeCtrl', [ '$rootScope', '$scope', '$modalInstance', 'TarjontaAPI', 'Koodisto', '$filter', 'lomakkeidenVuodet',
        function ($rootScope, $scope, $modalInstance, TarjontaAPI, Koodisto, $filter, lomakkeidenVuodet) {
            $rootScope.LOGS('LuoHakemuslomakeCtrl');

            $scope.haut = [];
            console.log('***', lomakkeidenVuodet);
            $scope.valittavatVuodet = lomakkeidenVuodet;
            $scope.kaudet = [];
            $scope.hakutyypit = [];

            Koodisto.getKausiKoodit().then(
                function (kausiKoodit) {
                    $scope.kaudet = $filter('orderBy')(kausiKoodit, 'period');
                }
            );
            Koodisto.getHakutyyppiKoodit().then(
                function (hakutyyppiKoodit) {
                    $scope.hakutyypit = $filter('orderBy')(hakutyyppiKoodit, 'translations.' + $scope.userLang);
                }
            );

            $scope.haeHaut = function () {
                $scope.haku = '';
                $scope.lomakepohja = '';
                $scope.$emit('LOAD');
                TarjontaAPI.haeHautParametreilla($scope.hakuvuosi, $scope.hakukausi.period, $scope.hakutyyppi.type).then(
                    function (data) {
                        $scope.$emit('LOADREADY');
                        $scope.haut = $filter('orderBy')(data, 'nimi.kieli_' + $scope.userLang);
                    }
                );
            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }
    ]);
