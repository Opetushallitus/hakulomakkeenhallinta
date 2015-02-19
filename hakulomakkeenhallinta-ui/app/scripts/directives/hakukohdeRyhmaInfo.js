'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeRyhmaInfo',
    function (TarjontaAPI, _, AlertMsg, Organisaatio, TarjontaService, NavigationTreeStateService, $modal, $filter, $routeParams, $route) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/hakukohde-ryhma-info.html',
            require: '^rajaavatSaannot',
            scope: {
                rajoiteRyhma: '=rajoiteRyhma',
                applicationForm: '=applicationForm',
                lomakepohja: '=lomakepohja',
                poistaHakukohderyhma: '&poistaHakukohderyhma',
                userLang: '@userLang'
            },
            link: function ($scope) {
                $scope.naytaHakukohdeLista = function(){
                    return NavigationTreeStateService.showNode($scope.rajoiteRyhma.groupId)
                };
                $scope.hakukohteidenMaara = 0;
                $scope.hakukohdeRyhma = {};
                var ryhmanHakukohteet  = [];
                Organisaatio.getOrganisationData($scope.rajoiteRyhma.groupId).then(
                    function (data) {
                        $scope.hakukohdeRyhma = data;
                    }
                );
                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.rajoiteRyhma.groupId).then(
                    function (data) {
                        ryhmanHakukohteet = data;
                        $scope.hakukohteet = $filter('orderBy')(data, 'nimi.' + $scope.userLang, false);
                        $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                    }
                );

                $scope.toggleNaytaHakukohteet = function () {
                    NavigationTreeStateService.toggleNodeState($scope.rajoiteRyhma.groupId)
                };
                /**
                 * Avataan dialogi hakukohderyhmän hakukohteiden rajoitusten asettamiseksi
                 * hakulomakkeen asetuksiin
                 */
                $scope.asetaRyhmaanRajoite = function () {
                    $modal.open({
                        templateUrl: 'partials/dialogs/aseta-hakukohderyhmaan-rajoite-dialog.html',
                        controller: 'HakukohderyhmaRajoiteDialogCtrl',
                        scope: $scope,
                        resolve: {
                            hakukohdeRyhma: function () {
                                return $scope.hakukohdeRyhma;
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