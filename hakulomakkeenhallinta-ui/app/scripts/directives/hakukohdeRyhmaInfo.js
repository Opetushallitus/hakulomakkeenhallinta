'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeRyhmaInfo',
    function (TarjontaAPI, _, AlertMsg, Organisaatio, TarjontaService, $modal, $filter, $routeParams) {
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
            controller: function ($scope) {
                $scope.naytaHakukohdeLista = false;
                $scope.hakukohteidenMaara = 0;
                $scope.hakukohdeRyhma = {};
                Organisaatio.getOrganisationData($scope.rajoiteRyhma.groupId).then(
                    function (data) {
                        $scope.hakukohdeRyhma = data;
                    }
                );
                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.rajoiteRyhma.groupdId).then(
                    function (data) {
                        //$scope.hakukohteet = data;
                        console.log('**** orderby hakukohteet ', $scope.userLang );
                        $scope.hakukohteet = $filter('orderBy')(data, 'nimi.' + $scope.userLang, false);
                        $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                    }
                );

                $scope.toggleNaytaHakukohteet = function () {
                    $scope.naytaHakukohdeLista = !$scope.naytaHakukohdeLista;
                };
                /**
                 * Avataan dialogi hakukohderyhmän hakukohteiden rajoitusten asettamiseksi
                 * hakulomakkeen asetuksiin
                 */
                 //TODO: tarkista tämä kun back end toimii oikein
                $scope.asetaRyhmaanRajoite = function () {
                    console.log('**** asetaRyhmaanRajoite ****', $scope.rajoiteRyhma, $scope.hakukohdeRyhma);
                    $modal.open({
                        templateUrl: 'partials/dialogs/aseta-hakukohderyhmaan-rajoite-dialog.html',
                        controller: 'HakukohderyhmaRajoiteDialogCtrl',
                        scope: $scope,
                        resolve: {
                            applicationForm: function () {
                                return $scope.applicationForm;
                            },
                            hakukohdeRyhma: function () {
                                return $scope.hakukohdeRyhma;
                            },
                            lomakepohja: function () {
                                return $scope.lomakepohja;
                            },
                            rajoiteRyhma: function () {
                                return $scope.rajoiteRyhma;
                            }
                        }
                    }).result.then(
                        function (data) {
                            //TODO: tarkita tämä kun back end toimii oikein
                            $scope.rajoiteRyhma.configurations = data;
                            console.log('##### asetaRyhmaanRajoite', $scope.rajoiteRyhma);
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                            //$route.reload();
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