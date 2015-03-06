'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('priorisoivaHakukohdeRyhmaInfo',
    function (TarjontaAPI, _, $modal, AlertMsg, Organisaatio, TarjontaService, NavigationTreeStateService, $routeParams, $route, $timeout, LocalisationService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/priorisoiva-hakukohde-ryhma-info.html',
            scope: {
                priorisointiRyhma: '=priorisointiRyhma',
                userLang: '@userLang'
            },
            controller: function ($scope) {
                $scope.naytaHakukohdeLista = function(){
                    return NavigationTreeStateService.showNode($scope.priorisointiRyhma.groupId)
                };
                $scope.hakukohteidenMaara = 0;
                $scope.hakukohdeRyhma = {};
                var ryhmanHakukohteet  = [];
                Organisaatio.getOrganisationData($scope.priorisointiRyhma.groupId).then(
                    function (data) {
                        $scope.hakukohdeRyhma = data;
                    }
                );
                /**
                 * haetaan haussa olevan ryhmän hakukohteet
                 */
                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.priorisointiRyhma.groupId).then(
                    function (data) {
                        $scope.hakukohteet = data;
                        ryhmanHakukohteet = data;
                        $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                        var prioriteettiRyhmat = {};
                        _.each($scope.hakukohteet, function (hakukohde) {
                                var hakukohdePrioriteetti = _.where(hakukohde.ryhmaliitokset, {ryhmaOid: $scope.priorisointiRyhma.groupId})[0];

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
                    NavigationTreeStateService.toggleNodeState([$scope.priorisointiRyhma.groupId])
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
                                return $scope.priorisointiRyhma.groupId;
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
                 * Avataan dialogi priorisoivan hakukohderyhmän poistamiseksi
                 * lomakkeen asetuksista.
                 * Tässä tapauksessa tarkoittaa sitä, että hakukohderyhmästä
                 * poistetaan kaikki siihen liitetyt hakukohteet, jotka
                 * liittää kyseisen hakukohderyhmän tähän hakuun.
                 * Tallennuspaikka on Tarjonta
                 * @param hakukohdeRyhma
                 */
                $scope.poistaPriorisoivaHakukohderyhma = function (hakukohdeRyhma) {
                    $modal.open({
                        templateUrl: 'partials/dialogs/poista-priorisoiva-hakukohderyhma-lomakkeen-asetuksista-dialog.html',
                        controller: 'PoistaHakukohdeRyhmaLomakkeenAsetuksistaDialogCtrl',
                        resolve: {
                            hakukohdeRyhma: function () {
                              return hakukohdeRyhma;
                            },
                            priorisointiRyhma: function () {
                                return $scope.priorisointiRyhma;
                            }
                        }
                    }).result.then(
                        function () {
                            $route.reload();
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
                $scope.t = function (key) {
                    return LocalisationService.tl(key);
                };
                /**
                 * avataan dialogi hakukohteiden poistamiseksi hakukohderyhmasta
                 * @param hakukohdeRyhma
                 */
                $scope.poistaHakukohteitaRyhmasta = function (hakukohdeRyhma) {
                    TarjontaService.poistaHakukohteitaRyhmasta(hakukohdeRyhma, ryhmanHakukohteet);
                };

            }
        };
    }
);