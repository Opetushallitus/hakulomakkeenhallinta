'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LuoHakemuslomakeCtrl', [ '$rootScope', '$scope', '$modalInstance', 'TarjontaAPI', 'Koodisto', '$filter', 'lomakkeidenVuodet', 'ThemeQuestions', 'AlertMsg',
        function ($rootScope, $scope, $modalInstance, TarjontaAPI, Koodisto, $filter, lomakkeidenVuodet, ThemeQuestions, AlertMsg) {
            $rootScope.LOGS('LuoHakemuslomakeCtrl');

            $scope.haut = [];
            $scope.valittavatVuodet = lomakkeidenVuodet;
            $scope.kaudet = [];
            $scope.hakutyypit = [];
            //TODO: poista tämä kun oikea data saatavilla
            $scope.lomakepohjat = [
                {
                    nimi: {
                        fi: 'Toisen asteen hakulomakepohja testi data'
                    }
                },
                {
                    nimi: {
                        fi: 'Korkeakoulujen hakulomakepohja testi data'
                    }
                }
            ];

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
            }
            /**
             * Tallennataan haku lomakepohjaan
             */
            $scope.tallennaLiitahakuLomakepohjaan = function () {
               $rootScope.LOGS('LuoHakemuslomakeCtrl', 'TODO tallennaLiitahakuLomakepohjaan tähän ', $scope.haku);
                //TODO: lisää tähän oikea lomakepohjan id: kun back end tukee tätä.
                ThemeQuestions.tallennaLiitahakuLomakepohjaan($scope.haku, '123.45.400999').then(
                    function success (data) {
                        $rootScope.LOGS(data);
                        AlertMsg($scope, 'success', 'hakemuslomakkeen.luonti.onnistui');
                        $modalInstance.close(data);
                    },
                    function error (resp) {
                        AlertMsg($scope, 'warning', 'error.tallennus.epaonnistui');
                    }
                );

            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };


        }
    ]);
