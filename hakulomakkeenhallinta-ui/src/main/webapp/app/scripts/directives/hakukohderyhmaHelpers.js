angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohderyhmaDropdown',
    function(TarjontaService, Organisaatio, $modal, $route, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<ng-include src="getTemplateUrl()"/>',
            scope: false,
            link: function ($scope) {

                $scope.getTemplateUrl = function() {
                    return 'partials/directives/hakukohderyhma-dropdown-' + $scope.ryhmaTyyppi + '.html'
                }

                $scope.lisaaHakukohdeRyhmaan = function(hakukohdeRyhma) {
                    TarjontaService.lisaaHakukohdeRyhmaan(hakukohdeRyhma, $scope.userLang)
                }

                $scope.poistaHakukohteitaRyhmasta = function(hakukohdeRyhma) {
                    TarjontaService.poistaHakukohteitaRyhmasta(hakukohdeRyhma, $scope.ryhmanhakukohteet)
                }

                $scope.poistaHakukohderyhma = function(hakukohdeRyhma) {
                    $modal.open({
                        templateUrl: 'partials/dialogs/poista-hakukohderyhma-lomakkeen-asetuksista-dialog.html',
                        controller: 'PoistaHakukohdeRyhmaLomakkeenAsetuksistaDialogCtrl',
                        scope: $scope,
                        resolve: {
                            haku: function () {
                                return $scope.haku;
                            },
                            hakukohdeRyhma: function () {
                                return hakukohdeRyhma;
                            },
                            poistettava: function () {
                                return $scope.ryhma;
                            }
                        }
                    }).result.then(
                        function () {
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                            $route.reload();
                        }
                    );
                }

                $scope.asetaRyhmaanRajoite = function(hakukohdeRyhma) {
                    $modal.open({
                        templateUrl: 'partials/dialogs/aseta-hakukohderyhmaan-rajoite-dialog.html',
                        controller: 'HakukohderyhmaRajoiteDialogCtrl',
                        scope: $scope,
                        resolve: {
                            haku: function () {
                                return $scope.haku;
                            },
                            applicationForm: function () {
                                return $scope.applicationForm;
                            },
                            hakukohdeRyhma: function () {
                                return hakukohdeRyhma;
                            },
                            rajoiteRyhma: function () {
                                return $scope.ryhma;
                            }
                        }
                    }).result.then(
                        function () {
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                            $route.reload();
                        }
                    );
                }

                $scope.muokkaaPrioriteetteja = function () {
                    $modal.open({
                        templateUrl: 'partials/dialogs/prioriteettien-asettaminen-dialog.html',
                        controller: 'prioriteettienAsettaminenDialogCtrl',
                        size: 'lg',
                        resolve: {
                            haku: function () {
                                return $scope.haku;
                            },
                            hakukohteet: function () {
                                return $scope.hakukohteet;
                            },
                            ryhmaOid: function () {
                                return $scope.ryhma.groupId;
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
            }
        }
    }
);