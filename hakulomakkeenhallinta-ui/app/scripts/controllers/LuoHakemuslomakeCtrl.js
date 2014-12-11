'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LuoHakemuslomakeCtrl', [ '$rootScope', '$scope', '$modalInstance', 'TarjontaAPI', 'Koodisto', '$filter', 'lomakkeidenVuodet', 'ApplicationFormConfiguration', 'AlertMsg',
        function ($rootScope, $scope, $modalInstance, TarjontaAPI, Koodisto, $filter, lomakkeidenVuodet, ApplicationFormConfiguration, AlertMsg) {
            $rootScope.LOGS('LuoHakemuslomakeCtrl');

            $scope.haut = [];
            $scope.valittavatVuodet = lomakkeidenVuodet;
            $scope.kaudet = [];
            $scope.hakutyypit = [];
            $scope.lomakepohjat = [];

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
            /**
             * haetaan lomakepohjat taustajärjestelmästä
             */
            ApplicationFormConfiguration.haeLomakepohjat().then(
                function (lomakepohjat) {
                    $scope.lomakepohjat = $filter('orderBy')(lomakepohjat, 'name.translations.' + $scope.userLang);
                }
            );
            /**
             * Heataan haut hakuvuoden, hakukauden ja hakutyypin mukaan
             */
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
            };
            /**
             * Asettaa lomakepohjaa valintaa oletus lomakepohjan
             * taustajärjestelmän päättelyn mukaan
             */
            $scope.haeDefaultLomakepohja = function () {
                ApplicationFormConfiguration.haeDefaultLomakepohja($scope.haku.oid).then(
                    function (oletusPohja) {
                        $scope.lomakepohja = _.findWhere($scope.lomakepohjat, { id: oletusPohja});
                    }
                );
            };
            /**
             * Tallennataan haku lomakepohjaan
             */
            $scope.tallennaLiitahakuLomakepohjaan = function () {
                $rootScope.LOGS('LuoHakemuslomakeCtrl', $scope.haku, $scope.lomakepohja);
                ApplicationFormConfiguration.tallennaLiitahakuLomakepohjaan($scope.haku.oid, $scope.lomakepohja.id).then(
                    function success(data) {
                        $rootScope.LOGS(data);
                        AlertMsg($scope, 'success', 'hakemuslomakkeen.luonti.onnistui');
                        $modalInstance.close(data);
                    },
                    function error(resp) {
                        $rootScope.LOGS(resp);
                        AlertMsg($scope, 'warning', 'error.tallennus.epaonnistui');
                    }
                );

            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };


        }
    ]);
