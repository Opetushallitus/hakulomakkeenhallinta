'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('priorisoivaHakukohdeRyhmaInfo',
        function (TarjontaAPI, _, $modal, AlertMsg) {
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
                            $scope.hakukohteet = _.flatten(
                                _.map(data.tulokset, function(tulokset) {
                                        //TODO: muuta tämä kun oikeat prioriteetit saatavilla tarjonnasta
                                        var pri  = 0;
                                        return _.each(tulokset.tulokset, function (tulos) {
                                                tulos.prioriteetti = pri;
                                                tulos.tarjoaja = {};
                                                tulos.tarjoaja.nimi = tulokset.nimi;
                                                pri += 1;
                                                if (pri === 3) {
                                                    pri = 0;
                                                }
                                                return tulos;
                                            }
                                        );
                                    }
                                )
                            );
                            var prioriteetit, prioriteettiRyhmat = {};
                            prioriteetit = _.uniq(_.map($scope.hakukohteet, function(hakukohde) { return hakukohde.prioriteetti; }));
                            _.each(prioriteetit, function (prioriteetti) {
                                    prioriteettiRyhmat[prioriteetti] =
                                        _.where($scope.hakukohteet, {prioriteetti: prioriteetti});
                                }
                            );
                            $scope.hakukohteet = prioriteettiRyhmat;
                            $scope.hakukohteidenMaara = data.tuloksia;
                        }
                    );

                    $scope.toggleNaytaHakukohteet = function () {
                        $scope.naytaHakukohdeLista = !$scope.naytaHakukohdeLista;
                    };
                    /**
                     * Avataan dialogi priorisointien muuttamiseksi
                     */
                    $scope.muokkaaPrioriteetteja = function () {
                        $modal.open({
                            templateUrl: 'partials/dialogs/prioriteettien-asettaminen-dialog.html',
                            controller: 'prioriteettienAsettaminenDialogCtrl',
                            scope: $scope,
                            size: 'lg',
                            resolve: {
                                hakukohteet: function (){
                                    return $scope.hakukohteet;
                                }
                            }
                        });
                    }

                }
            };

        }
    );