'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeRyhmaInfo',
    function (TarjontaAPI, _, AlertMsg, Organisaatio, TarjontaService, NavigationTreeStateService, $modal, $filter, $routeParams, $route, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/hakukohde-ryhma-info.html',
            scope: {
                ryhma: '=ryhma',
                ryhmat: '=ryhmat',
                applicationForm: '=applicationForm',
                lomakepohja: '=lomakepohja',
                userLang: '@userLang',
                ryhmaTyyppi: '@ryhmaTyyppi'
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

                function rajaavatHakukohteet(data) {
                    $scope.ryhmanhakukohteet = data;
                    $scope.hakukohteet = $filter('orderBy')(data, 'nimi.' + $scope.userLang, false);
                    $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                }

                function priorisoivatHakukohteet(data) {
                    $scope.hakukohteet = data;
                    $scope.ryhmanhakukohteet = data;
                    $scope.hakukohteidenMaara = $scope.hakukohteet.length;
                    var prioriteettiRyhmat = {};
                    _.each($scope.hakukohteet, function (hakukohde) {
                            var hakukohdePrioriteetti = _.where(hakukohde.ryhmaliitokset, {ryhmaOid: $scope.ryhma.groupId})[0];

                            if (hakukohdePrioriteetti.prioriteetti === undefined) {
                                if(prioriteettiRyhmat['priorityundefined'] === undefined) {
                                    prioriteettiRyhmat.priorityundefined = [];
                                }
                                prioriteettiRyhmat['priorityundefined'].push(hakukohde);
                            } else {
                                if (prioriteettiRyhmat[hakukohdePrioriteetti.prioriteetti] === undefined) {
                                    prioriteettiRyhmat[hakukohdePrioriteetti.prioriteetti] = [];
                                }
                                prioriteettiRyhmat[hakukohdePrioriteetti.prioriteetti].push(hakukohde);
                            }
                        }
                    );
                    $scope.hakukohteet = prioriteettiRyhmat;
                }

                function getParserFunction() {
                    if($scope.ryhmaTyyppi == 'hakukohde_priorisoiva')
                        return priorisoivatHakukohteet
                    else
                        return rajaavatHakukohteet
                }

                TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.ryhma.groupId).then(
                    getParserFunction()
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

                $scope.muokkaaPrioriteetteja = function () {
                    $modal.open({
                        templateUrl: 'partials/dialogs/prioriteettien-asettaminen-dialog.html',
                        controller: 'prioriteettienAsettaminenDialogCtrl',
                        size: 'lg',
                        resolve: {
                            hakukohteet: function () {
                                return $scope.hakukohteet;
                            },
                            ryhmaOid: function () {
                                return $scope.ryhma.groupId;
                            }
                        }
                    }).result.then(
                        function () {
                            //tarjonnassa prioritteetien tallennuksen ja
                            //uudelleen haun suhteen viivettä datan indeksoinnista
                            //johtuen jonkin verran, joten sivun uudelleen lataukseeen
                            //on laitettu viivettä, mutta silti tieto saattaa olla
                            //vanhaa,koska indeksoinnin varsinaista kestoa ei voi tietää
                            $timeout(function () { $route.reload(); }, 5000);
                        }
                    );
                };


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