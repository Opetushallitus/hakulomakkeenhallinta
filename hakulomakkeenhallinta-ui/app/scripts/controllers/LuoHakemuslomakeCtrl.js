'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LuoHakemuslomakeCtrl', [ '$rootScope', '$scope', '$modalInstance', 'TarjontaAPI', 'Koodisto', '$filter',
        function ($rootScope, $scope, $modalInstance, TarjontaAPI, Koodisto, $filter) {
            $rootScope.LOGS('LuoHakemuslomakeCtrl');

            $scope.haut = [];
            $scope.vuodet = [2013, 2014, 2015, 2016, 2017];
            $scope.kaudet = [];
            $scope.hakutyypit = [];

            Koodisto.getKausiKoodit().then(
                function (kausiKoodit) {
                    kausiKoodit.push({period: ''});
                    $scope.kaudet = $filter('orderBy')(kausiKoodit, 'period');
                }
            );
            Koodisto.getHakutyyppiKoodit().then(
                function (hakutyyppiKoodit) {
                    hakutyyppiKoodit.push(
                        {
                            translations: {
                                fi: '',
                                sv: ''
                            }
                        }
                    );
                    $scope.hakutyypit = $filter('orderBy')(hakutyyppiKoodit, 'translations.' + $scope.userLang);
                }
            );

            $scope.haeHaut = function () {
                //TODO: nämä parametrit tarttee säätöä
                console.log($scope.vuosi.year, $scope.kausi, $scope.hakutyyppi);
                $scope.$emit('LOAD');
                TarjontaAPI.haeHautParametreilla($scope.vuosi.year, $scope.kausi.period, $scope.hakutyyppi.type).then(
                    function (data) {
                        $scope.$emit('LOADREADY');
                        $scope.haut = data;
                    }
                );
            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }
    ]);
