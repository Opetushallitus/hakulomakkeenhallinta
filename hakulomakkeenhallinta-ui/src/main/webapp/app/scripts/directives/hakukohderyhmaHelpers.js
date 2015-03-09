angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohderyhmaDropdown',
    function(TarjontaService, Organisaatio, $modal, $route, $parse) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/hakukohderyhma-dropdown.html',
            scope: false,
            link: function ($scope, element, attrs) {

                $scope.customActionLabel = attrs.customText

                $scope.hasCustomAction = function() {
                    return attrs.custom;
                }

                $scope.customAction = function() {
                    $parse(attrs.custom)($scope, {})
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
            }
        }
    }
    ).directive('hakukohdelistaOtsikot',
        function() {
         return {
             restrict: 'E',
             replace: true,
             templateUrl: 'partials/directives/hakukohdelista-otsikot.html',
             scope: false
         }
    }
);