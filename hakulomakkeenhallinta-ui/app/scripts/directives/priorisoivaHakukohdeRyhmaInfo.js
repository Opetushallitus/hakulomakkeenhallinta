'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('priorisoivaHakukohdeRyhmaInfo',
        function (TarjontaAPI, _) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'partials/directives/priorisoiva-hakukohde-ryhma-info.html',
                controller: function ($scope) {
                    $scope.naytaHakukohdeLista = false;
                    $scope.hakukohteidenMaara = 0;
                    $scope.priorisoivaHakukohdeRyhma = {};
                    /**
                     * haetaan ryhmän hakukohteet
                     */
                    TarjontaAPI.haeRyhmanHakukohteet($scope.priorisointiRyhma.oid).then(
                        function (data) {
                            $scope.hakukohteet = _.flatten( _.map(data.tulokset, function(tulokset) { return tulokset.tulokset; }));
                            $scope.hakukohteidenMaara = data.tuloksia;
                        }
                    );

                    $scope.toggleNaytaHakukohteet = function () {
                        $scope.naytaHakukohdeLista = !$scope.naytaHakukohdeLista;
                    };

                }
            };

        }
    );