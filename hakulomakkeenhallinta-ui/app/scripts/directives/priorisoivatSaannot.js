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
                priorisointiRyhmat: '=priorisointiRyhmat',
                userLang: '@userLang'
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
                        templateUrl: 'partials/dialogs/lisaa-priorisoivaryhma-lomakkeen-asetuksiin-dialog.html',
                        controller: 'LisaaPriorisoivaryhmaLomakkeenAsetuksiinDialogCtrl',
                        scope: $scope,
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
                    });
                };

                /**
                 * Lisätään organisaatio palveluun uusi ryhmä
                 */
                $scope.lisaaRyhmaOrganisaatioPalveluun = function (kayttoTarkoitus) {
                    OrganisaatioService.lisaaUusiRyhma(kayttoTarkoitus, Organisaatio.getUserSelectedOrganisation().oid);
                };
            }
        }
    }
);
