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
                            //TODO: tarkista tämä kun backend tukee tätä
                            console.log('*** ryhmä lisätty asetuksiin ***', data);
                            $scope.rajoiteRyhmat.push(data);
                        }
                    );
                };
                console.log('rajaavat säännöt: ', $scope.rajoiteRyhmat);
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
