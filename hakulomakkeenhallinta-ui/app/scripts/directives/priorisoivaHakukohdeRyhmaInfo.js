'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('priorisoivaHakukohdeRyhmaInfo',
    function (TarjontaAPI, _, $modal, AlertMsg, TarjontaService, $routeParams, $route, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/priorisoiva-hakukohde-ryhma-info.html',
            scope: {
                priorisointiRyhma: '=priorisointiRyhma',
                userLang: '@userLang'
            },
            controller: function ($scope) {
                $scope.naytaHakukohdeLista = false;
                $scope.hakukohteidenMaara = 0;
                /**
                 * haetaan haussa olevan ryhmän hakukohteet
                 */
                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.priorisointiRyhma.oid).then(
                    function (data) {
                        $scope.hakukohteet = data;
                        $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                        var prioriteettiRyhmat = {};
                        _.each($scope.hakukohteet, function (hakukohde) {
                                var hakukohdePrioriteetti = _.where(hakukohde.ryhmaliitokset, {ryhmaOid: $scope.priorisointiRyhma.oid})[0];

                                if (hakukohdePrioriteetti.prioriteetti === undefined) {
                                    if(prioriteettiRyhmat['priorityundefined'] === undefined) {
                                        prioriteettiRyhmat.priorityundefined = [];
                                    }
                                    prioriteettiRyhmat['priorityundefined'].push(hakukohde);
                                } else {
                                    if (prioriteettiRyhmat[hakukohdePrioriteetti.prioriteetti] === undefined) {
                                        prioriteettiRyhmat[hakukohdePrioriteetti.prioriteetti] = [];
                                    }
                                    prioriteettiRyhmat[hakukohdePrioriteetti.prioriteetti].push(hakukohde);
                                }
                            }
                        );
                        $scope.hakukohteet = prioriteettiRyhmat;
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
                        size: 'lg',
                        resolve: {
                            hakukohteet: function () {
                                return $scope.hakukohteet;
                            },
                            ryhmaOid: function () {
                                return $scope.priorisointiRyhma.oid;
                            }
                        }
                    }).result.then(
                        function () {
                            //tarjonnassa prioritteetien tallennuksen ja
                            //uudelleen haun suhteen viivettä datan indeksoinnista
                            //johtuen jonkin verran, joten sivun uudelleen lataukseeen
                            //on laitettu viivettä, mutta silti tieto saattaa olla
                            //vanhaa,koska indeksoinnin varsinaista kestoa ei voi tietää
                            $timeout(function () { $route.reload(); }, 5000);
                        }
                    );
                };
                /**
                 * avataan dialogi lisätään hakukohde ryhmään
                 * @param hakukohdeRyhma
                 */
                $scope.lisaaHakukohdeRyhmaan = function (hakukohdeRyhma) {
                    TarjontaService.lisaaHakukohdeRyhmaan(hakukohdeRyhma, $scope.userLang);
                };
                /**
                 * avataan dialogi poista hakukohde ryhmästä
                 * @param hakukohdeRyhma
                 * @param hakukohde
                 */
                $scope.poistaHakukohdeRyhmasta = function (hakukohdeRyhma, hakukohde) {
                    TarjontaService.poistaHakukohdeRyhmasta(hakukohdeRyhma, hakukohde);
                };

            }
        };
    }
);