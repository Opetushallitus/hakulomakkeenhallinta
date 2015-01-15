angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('rajaavatSaannot',
    function ($rootScope, ApplicationFormConfiguration, $routeParams, $filter, _, $modal, AlertMsg, OrganisaatioService, Organisaatio) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/rajaavat-saannot.html',
            scope: {
                applicationForm: '=applicationForm',
                rajoiteRyhmat: '=rajoiteRyhmat',
                lomakepohja: '=lomakepohja'
            },
            controller: function ($scope) {
                $scope.naytaLista = false;
                $scope.toggleLista = function () {
                    $scope.naytaLista = !$scope.naytaLista;
                };
                 /**
                 * Avataan dialogi rajoittavien hakukohderyhmien lisäämiseksi
                 * lomakkeen astuksiin
                 */
                $scope.lisaaRyhmaAsetuksiin = function () {
                    $modal.open({
                        templateUrl: 'partials/dialogs/lisaa-rajoiteryhma-lomakkeen-asetuksiin-dialog.html',
                        controller: 'LisaaRajoiteryhmaLomakkeenAsetuksiinDialogCtrl',
                        resolve: {
                            applicationForm: function () {
                                return $scope.applicationForm;
                            },
                            rajoiteRyhmat: function () {
                                return $scope.rajoiteRyhmat;
                            },
                            lomakepohja: function () {
                                return $scope.lomakepohja;
                            }
                        }
                    }).result.then(
                        function (data) {
                            //TODO: poista/tarkista tämä kun backend tukee tätä
                            console.log('*** ryhmä lisätty asetuksiin ***', data);
                            $scope.rajoiteRyhmat.push(data);
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen ??
                            //$route.reload();
                        }
                    );
                };
                 /**
                 * Avataan poisto dialogi hakukohderyhmän poistamiseen lomakkeen asetuksista
                 * @param hakukohdeRyhma hakukohderyhmä {}
                 * @param rajoiteRyhma rajoite ryhmän tiedot {}
                 */
                $scope.poistaRajoittavaHakukohderyhmaLomakkeenAsetuksista = function (hakukohdeRyhma, rajoiteRyhma) {
                    $modal.open({
                        templateUrl: 'partials/dialogs/poista-rajoite-hakukohderyhma-lomakkeen-asetuksista-dialog.html',
                        controller: 'PoistaRajoiteHakukohderyhmaLomakkeenAsetuksistaDialogCtrl',
                        scope: $scope,
                        resolve: {
                            hakukohdeRyhma: function () {
                                return hakukohdeRyhma;
                            },
                            rajoiteRyhma: function () {
                                return rajoiteRyhma;
                            },
                            lomakepohja: function () {
                                return $scope.lomakepohja;
                            }
                        }
                    }).result.then(
                        function (data) {
                            //TODO: poista/tarkista tämä kun backend tukee tätä
                            console.log('#### poistettava ryhmä ', data);
                            $scope.rajoiteRyhmat = _.without($scope.rajoiteRyhmat, data);
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen ??
                            //$route.reload();
                        }
                    );
                };
                /**
                 * Lisätään organisaatio palveluun uusi ryhmä
                 */
                //TODO: tarkista tämä kun onrganisaatio palvelussa tuki ryhmän lisäämiselle muualta kuin organisaatio palvelusta
                $scope.lisaaRyhmaOrganisaatioPalveluun = function (kayttoTarkoitus) {
                    OrganisaatioService.lisaaUusiRyhma(kayttoTarkoitus, Organisaatio.getUserSelectedOrganisation().oid);
                }
            }
        }
    }
);
