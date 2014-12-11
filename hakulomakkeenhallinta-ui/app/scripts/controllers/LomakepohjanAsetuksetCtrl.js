'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('lomakepohjanAsetuksetCtrl', ['$rootScope', '$scope', 'TarjontaAPI', 'Organisaatio', 'AlertMsg', '$routeParams', 'FormEditor', 'ApplicationFormConfiguration', '_', '$filter', '$modal',
        function ($rootScope, $scope, TarjontaAPI, Organisaatio, AlertMsg, $routeParams, FormEditor, ApplicationFormConfiguration, _, $filter, $modal) {
            $rootScope.LOGS('lomakepohjanAsetuksetCtrl');

            $scope.hakukohdeRyhmat = [];
            $scope.applicationForm = {};
            $scope.naytaRyhmat = false;
            $scope.formConfiguration = {};
            $scope.lomakepohjat = [];
            $scope.lomakepohja = {};
            $scope.rajoiteRyhmat = [];
            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function (data) {
                    $scope.applicationForm = data;
                }
            );
            /**
             * haetaan lomakepohjat taustajärjestelmästä
             */
            ApplicationFormConfiguration.haeLomakepohjat().then(
                function (lomakepohjat) {
                    ApplicationFormConfiguration.haeLomakepohjanAsetukset($routeParams.id).then(
                        function (lomakepohjanAsetukset) {
                            $scope.formConfiguration = lomakepohjanAsetukset;
                            $scope.rajoiteRyhmat = _.filter(lomakepohjanAsetukset.groupConfigurations, function (conf) { return conf.type === 'restriction'; });
                            $scope.lomakepohja = _.find(lomakepohjat, function (pohja) { if (pohja.id === lomakepohjanAsetukset.formTemplateType) { return pohja; }});
                            lomakepohjat = _.without(lomakepohjat, $scope.lomakepohja);
                            $scope.lomakepohjat = $filter('orderBy')(lomakepohjat, 'name.translations.' + $scope.userLang);
                        }
                    );
                }
            );

            $scope.toggleNaytaHakukohderyhmat = function () {
                $scope.naytaRyhmat = !$scope.naytaRyhmat;
            };
            /**
             * avataan dialogi hakulomakkeen pohjan vaihto varten
             */
            $scope.vaihdaLomakepohja = function () {
                $modal.open({
                    templateUrl: 'partials/dialogs/vaihda-lomakepohja-dialog.html',
                    controller: 'vaihdaLomakepohjaDialogCtrl',
                    scope: $scope,
                    resolve: {
                        applicationForm: function () {
                            return $scope.applicationForm;
                        },
                        lomakepohjat: function () {
                            return $scope.lomakepohjat;
                        }
                    }
                });
            };
            /**
             * Avataan dialogi hakukohderyhmän hakukohteiden rajoitusten asettamiseksi
             * hakulomakkeen asetuksiin
             */
            $scope.lisaaRyhmaanRajoite = function () {
                $modal.open({
                    templateUrl: 'partials/dialogs/lisaa-hakukohderyhmaan-rajoite-dialog.html',
                    controller: 'HakukohderyhmaRajoiteDialogCtrl',
                    scope: $scope,
                    resolve: {
                        applicationForm: function () {
                            return $scope.applicationForm;
                        },
                        rajoitetutRyhmat: function () {
                            return $scope.rajoiteRyhmat;
                        }
                    }
                }).result.then(
                    function (data) {
                        //TODO: poista tämä kun backend tukee tätä
                        $scope.rajoiteRyhmat.push(data);
                    }
                );
            };
            /**
             * Avataan dialogi hakukohderyhmän hakukohde rajoituksen muokkaamiseksi
             * hakulomakkeen asetuksiin
             * @param hakukohdeRyhma
             * @param rajoiteRyhma
             */
            $scope.muokkaRyhmanRajoitetta = function (hakukohdeRyhma, rajoiteRyhma) {
                $modal.open({
                    templateUrl: 'partials/dialogs/muokkaa-hakukohderyhman-rajoitetta-dialog.html',
                    controller: 'MuokkaaHakukohderyhmanRajoitettaDialogCtrl',
                    scope: $scope,
                    resolve: {
                        applicationForm: function () {
                            return $scope.applicationForm;
                        },
                        hakukohdeRyhma: function () {
                            return hakukohdeRyhma;
                        },
                        rajoiteRyhma: function () {
                            return rajoiteRyhma;
                        }
                    }
                });
            };
            $scope.poistaRyhmaRajoite = function (hakukohdeRyhma, rajoiteRyhma) {
                $modal.open({
                    templateUrl: 'partials/dialogs/poista-hakukohderyhma-rajoite-dialog.html',
                    controller: 'PoistaHakukohderyhmaRajoiteDialogCtrl',
                    scope: $scope,
                    resolve: {
                        hakukohdeRyhma: function () {
                            return hakukohdeRyhma;
                        },
                        rajoiteRyhma: function () {
                            return rajoiteRyhma;
                        }
                    }
                }).result.then(
                    function (data) {
                        //TODO: poista tämä kun backend tukee tätä
                        $scope.rajoiteRyhmat = _.without($scope.rajoiteRyhmat, data);
                    }
                );
            };

        }]);