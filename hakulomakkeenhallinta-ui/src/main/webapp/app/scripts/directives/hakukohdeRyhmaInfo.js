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
                ryhma: '=ryhma',
                ryhmat: '=ryhmat',
                applicationForm: '=applicationForm',
                lomakepohja: '=lomakepohja',
                userLang: '@userLang'
            },
            link: function ($scope) {
                $scope.naytaHakukohdeLista = function(){
                    return NavigationTreeStateService.showNode($scope.ryhma.groupId)
                };
                $scope.hakukohteidenMaara = 0;
                $scope.hakukohdeRyhma = {};
                $scope.ryhmanhakukohteet = [];
                Organisaatio.getOrganisationData($scope.ryhma.groupId).then(
                    function (data) {
                        $scope.hakukohdeRyhma = data;
                    }
                );
                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.ryhma.groupId).then(
                    function (data) {
                        $scope.ryhmanhakukohteet = data;
                        $scope.hakukohteet = $filter('orderBy')(data, 'nimi.' + $scope.userLang, false);
                        $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                    }
                );

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


                $scope.toggleNaytaHakukohteet = function () {
                    NavigationTreeStateService.toggleNodeState($scope.ryhma.groupId)
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