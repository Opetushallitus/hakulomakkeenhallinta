angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohderyhmaDropdown',
    function(TarjontaService, Organisaatio, $modal, $route) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/hakukohderyhma-dropdown.html',
            scope: false,
            link: function ($scope) {

                $scope.asetaRyhmaanRajoite = function(hakukohdeRyhma) {
                    $modal.open({
                        templateUrl: 'partials/dialogs/aseta-hakukohderyhmaan-rajoite-dialog.html',
                        controller: 'HakukohderyhmaRajoiteDialogCtrl',
                        scope: $scope,
                        resolve: {
                            applicationForm: function () {
                                return $scope.applicationForm;
                            },
                            hakukohdeRyhma: function () {
                                return hakukohdeRyhma;
                            },
                            rajoiteRyhma: function () {
                                return $scope.rajoiteRyhma;
                            }
                        }
                    }).result.then(
                        function () {
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                            $route.reload();
                        }
                    );
                }

                $scope.lisaaHakukohdeRyhmaan = function(hakukohdeRyhma) {
                    TarjontaService.lisaaHakukohdeRyhmaan(hakukohdeRyhma, $scope.userLang)
                }

                $scope.poistaHakukohteitaRyhmasta = function(hakukohdeRyhma) {
                    TarjontaService.poistaHakukohteitaRyhmasta(hakukohdeRyhma, $scope.ryhmanhakukohteet)
                }

                $scope.poistaHakukohderyhma = function(hakukohdeRyhma) {
                    $modal.open({
                        templateUrl: 'partials/dialogs/poista-rajoite-hakukohderyhma-lomakkeen-asetuksista-dialog.html',
                        controller: 'PoistaHakukohdeRyhmaLomakkeenAsetuksistaDialogCtrl',
                        scope: $scope,
                        resolve: {
                            hakukohdeRyhma: function () {
                                return hakukohdeRyhma;
                            },
                            poistettava: function () {
                                return $scope.rajoiteRyhma;
                            }
                        }
                    }).result.then(
                        function () {
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                            $route.reload();
                        }
                    );
                }
            }
        }
    }
);