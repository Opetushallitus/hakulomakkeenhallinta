angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('priorisoivatSaannot',
    function ($rootScope, OrganisaatioService, Organisaatio, $modal) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/priorisoivat-saannot.html',
            scope:{
                applicationForm: '=applicationForm',
                lomakepohja: '=lomakepohja',
                priorisointiRyhmat: '=priorisointiRyhmat'
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
                    console.log('@@@@@@ priorisoivat säännöt');
                    $modal.open({
                        templateUrl: 'partials/dialogs/lisaa-priorisoivaryhma-lomakkeen-asetuksiin-dialog.html',
                        controller: 'LisaaPriorisoivaryhmaLomakkeenAsetuksiinDialogCtrl',
                        resolve: {
                            applicationForm: function () {
                                return $scope.applicationForm;
                            },
                            priorisointiRyhmat: function () {
                                return $scope.priorisointiRyhmat;
                            },
                            lomakepohja: function () {
                                return $scope.lomakepohja;
                            }
                        }
                    }).result.then(
                        function (data) {
                            //TODO: tarkista tämä kun backend tukee tätä
                            console.log('*** ryhmä lisätty asetuksiin ***', data);
                            $scope.priorisointiRyhmat.push(data);
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
