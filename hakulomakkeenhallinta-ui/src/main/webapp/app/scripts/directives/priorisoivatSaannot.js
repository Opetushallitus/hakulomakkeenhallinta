angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('priorisoivatSaannot',
    function ($rootScope, OrganisaatioService, NavigationTreeStateService, Organisaatio, $modal, $route) {
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
                $scope.naytaLista = function(){
                    return NavigationTreeStateService.showNode("priorisoivat-saannot");
                }
                $scope.toggleLista = function () {
                    return NavigationTreeStateService.toggleNodeState("priorisoivat-saannot");
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
                    }).result.then(
                        function () {
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                            $route.reload();
                        }
                    );
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
