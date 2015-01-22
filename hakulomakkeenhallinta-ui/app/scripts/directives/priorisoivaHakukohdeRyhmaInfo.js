'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('priorisoivaHakukohdeRyhmaInfo',
    function (TarjontaAPI, _, $modal, AlertMsg, TarjontaService, $routeParams) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/priorisoiva-hakukohde-ryhma-info.html',
            scope: {
                priorisointiRyhma: '=priorisointiRyhma',
                userLang: '@userLang'
            },
            controller: function ($scope) {
                $scope.naytaHakukohdeLista = false;
                $scope.hakukohteidenMaara = 0;
                /**
                 * haetaan haussa olevan ryhmän hakukohteet
                 */
                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.priorisointiRyhma.oid).then(
                    function (data) {
                        //TODO: tämä condikseen
                        console.log('### priorisoivaHakukohdeRyhmaInfo: ',$routeParams.id, $scope.priorisointiRyhma.oid);
                        $scope.hakukohteet = data;
                        console.log('%%% ', $scope.hakukohteet);
                        $scope.hakukohteidenMaara = $scope.hakukohteet.length;

                        var prioriteettiRyhmat = {}, testIndx = 0;

                        _.each($scope.hakukohteet, function (hakukohde) {
                                var pri = _.where(hakukohde.ryhmaliitokset, {ryhmaOid:$scope.priorisointiRyhma.oid});
                                console.log('pri: ', pri, testIndx);
                                //if (pri.prioriteetti === undefined && testIndx === 0) {
                                if (testIndx === 0) {
                                    //console.log('ei prioriteettiä: ', hakukohde);
                                    if(prioriteettiRyhmat['priorityundefined'] === undefined) {
                                        prioriteettiRyhmat.priorityundefined = [];
                                    }
                                    prioriteettiRyhmat['priorityundefined'].push(hakukohde);
                                } else {
                                    if (prioriteettiRyhmat[testIndx] === undefined) {
                                        prioriteettiRyhmat[testIndx] = [];
                                    }
                                    prioriteettiRyhmat[testIndx].push(hakukohde);
                                }
                                testIndx += 1;
                                if(testIndx === 3) {
                                    testIndx = 0;
                                }
                            }
                        );
                        console.log('*** ',prioriteettiRyhmat);
                        $scope.hakukohteet = prioriteettiRyhmat;
                        }
                    );

                $scope.toggleNaytaHakukohteet = function () {
                    $scope.naytaHakukohdeLista = !$scope.naytaHakukohdeLista;
                };
                /**
                 * Avataan dialogi priorisointien muuttamiseksi
                 */
                $scope.muokkaaPrioriteetteja = function () {
                    $modal.open({
                        templateUrl: 'partials/dialogs/prioriteettien-asettaminen-dialog.html',
                        controller: 'prioriteettienAsettaminenDialogCtrl',
                        scope: $scope,
                        size: 'lg',
                        resolve: {
                            hakukohteet: function (){
                                return $scope.hakukohteet;
                            }
                        }
                    }).result.then(
                        function(data) {
                            $scope.hakukohteet = data;
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