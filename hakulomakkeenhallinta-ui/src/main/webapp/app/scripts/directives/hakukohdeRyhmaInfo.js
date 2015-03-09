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
                ryhmat: '=ryhmat',
                applicationForm: '=applicationForm',
                lomakepohja: '=lomakepohja',
                userLang: '@userLang'
            },
            link: function ($scope) {
                $scope.naytaHakukohdeLista = function(){
                    return NavigationTreeStateService.showNode($scope.rajoiteRyhma.groupId)
                };
                $scope.hakukohteidenMaara = 0;
                $scope.hakukohdeRyhma = {};
                $scope.ryhmanhakukohteet = [];
                Organisaatio.getOrganisationData($scope.rajoiteRyhma.groupId).then(
                    function (data) {
                        $scope.hakukohdeRyhma = data;
                    }
                );
                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.rajoiteRyhma.groupId).then(
                    function (data) {
                        $scope.ryhmanhakukohteet = data;
                        $scope.hakukohteet = $filter('orderBy')(data, 'nimi.' + $scope.userLang, false);
                        $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                    }
                );

                $scope.toggleNaytaHakukohteet = function () {
                    NavigationTreeStateService.toggleNodeState($scope.rajoiteRyhma.groupId)
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