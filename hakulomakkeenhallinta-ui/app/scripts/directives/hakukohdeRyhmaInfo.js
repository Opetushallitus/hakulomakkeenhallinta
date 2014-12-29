'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeRyhmaInfo', [ 'TarjontaAPI', '_', 'AlertMsg', 'Organisaatio',
        function (TarjontaAPI, _, AlertMsg, Organisaatio) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'partials/directives/hakukohde-ryhma-info.html',
                controller: function ($scope) {
                    $scope.naytaHakukohdeLista = false;
                    $scope.hakukohteidenMaara = 0;
                    $scope.hakukohdeRyhma = {};
                    //TODO: tarkista rajoiteRyhma.groupdId kun korjaus backendissä
                    Organisaatio.getOrganisationData($scope.rajoiteRyhma.groupdId).then(
                        function (data) {
                            $scope.hakukohdeRyhma = data;
                        }
                    );
                    TarjontaAPI.haeRyhmanHakukohteet($scope.rajoiteRyhma.groupdId).then(
                        function (data) {
                            $scope.hakukohteet = _.flatten(
                                _.map(data.tulokset,
                                    function (tulokset) {
                                        return _.each(tulokset.tulokset,
                                            function (tulos) {
                                                tulos.tarjoaja = {};
                                                tulos.tarjoaja.nimi = tulokset.nimi;
                                                return tulos;
                                            }
                                        );
                                    }
                                )
                            );
                            $scope.hakukohteidenMaara = data.tuloksia;
                        }
                    );

                    $scope.toggleNaytaHakukohteet = function () {
                        $scope.naytaHakukohdeLista = !$scope.naytaHakukohdeLista;
                    };

                }
            };

        }]);