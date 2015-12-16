'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeRyhmaInfo',
    function (TarjontaAPI, _, AlertMsg, Organisaatio, TarjontaService, NavigationTreeStateService, $modal, $filter, $routeParams, $route, $timeout, LocalisationService, ApplicationFormConfiguration, FormEditor) {
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
                FormEditor.getLanguages()
                    .then(function (data) {
                        $scope.languages = data;
                    });
                $scope.t = function (key) {
                    return LocalisationService.tl(key);
                };

                $scope.hakukohderyhmanOsoite = {
                    useFirstAoAddress: true,
                    address: {},
                    deliveryDue: undefined
                };
                if($scope.ryhma.configurations) {
                    $scope.hakukohderyhmanOsoite.useFirstAoAddress = ($scope.ryhma.configurations.useFirstAoAddress === 'true');
                    $scope.hakukohderyhmanOsoite.address.recipient = $scope.ryhma.configurations.addressRecipient;
                    $scope.hakukohderyhmanOsoite.address.street = $scope.ryhma.configurations.addressStreet;
                    $scope.hakukohderyhmanOsoite.address.postCode = $scope.ryhma.configurations.addressPostalCode;
                    $scope.hakukohderyhmanOsoite.address.postOffice = $scope.ryhma.configurations.addressPostOffice;
                    if($scope.ryhma.configurations.deadline) {
                        $scope.hakukohderyhmanOsoite.deliveryDue = Number($scope.ryhma.configurations.deadline);
                    }
                    $scope.hakukohderyhmanOsoite.helpText = $scope.ryhma.configurations.helpText;
                }

                $scope.tallennaHakukohderyhmanOsoite = function (form) {
                    ApplicationFormConfiguration.tallennaHakukohderyhmanOsoite($routeParams.id, $scope.ryhma.groupId, $scope.hakukohderyhmanOsoite).then(
                        function success(data) {
                            $scope.alerts = [];
                            AlertMsg($scope, 'success', 'tallennus.ok');
                            form.$setPristine();
                        },
                        function error(resp) {
                            AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                        }
                    );
                };


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
