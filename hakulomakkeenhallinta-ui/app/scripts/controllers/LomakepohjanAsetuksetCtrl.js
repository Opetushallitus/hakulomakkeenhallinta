'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('lomakepohjanAsetuksetCtrl', ['$rootScope', '$scope', 'TarjontaAPI', 'Organisaatio', 'AlertMsg', '$routeParams', 'FormEditor', 'ApplicationFormConfiguration', '_', '$filter', '$modal', '$route',
        function ($rootScope, $scope, TarjontaAPI, Organisaatio, AlertMsg, $routeParams, FormEditor, ApplicationFormConfiguration, _, $filter, $modal, $route) {
            $rootScope.LOGS('lomakepohjanAsetuksetCtrl');

            $scope.hakukohdeRyhmat = [];
            $scope.applicationForm = {};
            $scope.naytaRyhmat = false;
            $scope.formConfiguration = {};
            $scope.lomakepohjat = [];
            $scope.lomakepohja = {};
            $scope.rajoiteRyhmat = [];
            $scope.priorisointiRyhmat = [];
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
            //TODO: tarkista tämä kun back end toimii oikein
            ApplicationFormConfiguration.haeLomakepohjat().then(
                function (lomakepohjat) {
                    $scope.lomakepohjat = $filter('orderBy')(lomakepohjat, 'name.translations.' + $scope.userLang);
                    lomakePohjanAsetukset();
                }
            );
            /**
             * heataan lomakepohjan asetukset
             */
            //TODO: tarkista tämä kun back end toimii oikein
            function lomakePohjanAsetukset() {
                ApplicationFormConfiguration.haeLomakepohjanAsetukset($routeParams.id).then(
                    function success(lomakepohjanAsetukset) {
                        $scope.formConfiguration = lomakepohjanAsetukset;
                        $scope.rajoiteRyhmat = _.filter(lomakepohjanAsetukset.groupConfigurations, function (conf) { return conf.type === 'MAXIMUM_NUMBER_OF'; });
                        $scope.lomakepohja = _.find($scope.lomakepohjat, function (pohja) { if (pohja.id === lomakepohjanAsetukset.formTemplateType) { return pohja; }});
                        $scope.lomakepohjat = _.without($scope.lomakepohjat, $scope.lomakepohja);
                        $scope.lomakepohjat = $filter('orderBy')($scope.lomakepohjat, 'name.translations.' + $scope.userLang);

                    },
                    function error(resp) {
                        $rootScope.LOGS('lomakepohjanAsetuksetCtrl', resp);
                        AlertMsg($scope, 'error', 'error.lomakepohjan.asetusten.haku.ei.onnistu');
                    }
                );
            }
            /**
             * avataan dialogi hakulomakkeen pohjan vaihto varten
             */
            //TODO: tarkista tämä kun back end toimii oikein
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
                }).result.then(
                        function () {
                            //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                            $route.reload();
                        }
                    );
            };
            /**
             * Avataan dialogi hakukohderyhmän hakukohteiden rajoitusten asettamiseksi
             * hakulomakkeen asetuksiin
             */
            //TODO: tarkista tämä kun back end toimii oikein
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
                        },
                        lomakePohja: function () {
                            return $scope.lomakepohja;
                        }
                    }
                }).result.then(
                    function (data) {
                        //TODO: tarkista tämä kun back end toimii oikein
                        //lomakePohjanAsetukset();
                        //$scope.rajoiteRyhmat.push(data);
                        //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                        $route.reload();
                    }
                );
            };
            /**
             * Avataan dialogi hakukohderyhmän hakukohde rajoituksen muokkaamiseksi
             * hakulomakkeen asetuksiin
             * @param hakukohdeRyhma hakukohde ryhmä objekti
             * @param rajoiteRyhma rajoite ryhmä objekti
             */
            //TODO: tarkista tämä kun back end toimii oikein
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
                }).result.then(
                    function (data) {
                        //TODO: tarkista tämä kun back end toimii oikein
                        $route.reload();
                    }
                );
            };
            /**
             * Avataan poisto dialogi hakukohde ryhmän hakukohteiden
             * rajoitusten poistoon
             * @param hakukohdeRyhma hakukohde ryhmä objekti
             * @param rajoiteRyhma rajoite ryhmä objekti
             */
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
                        },
                        lomakePohja: function () {
                            return $scope.lomakepohja;
                        }
                    }
                }).result.then(
                    function (data) {
                        //TODO: poista tämä kun backend tukee tätä
                        //$scope.rajoiteRyhmat = _.without($scope.rajoiteRyhmat, data);
                        //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                        $route.reload();
                    }
                );
            };
            /**
             * Haetaan tarjonnasta käyttäjän priorisoivat hakukohde ryhmät
             */
            TarjontaAPI.usersApplicationOptionGroups($routeParams.id, Organisaatio.getUserSelectedOrganisation().oid).then(
                function (data) {
                    data = _.filter(data, function (priorisoiva) { return _.contains(priorisoiva.kayttoryhmat, 'hakukohde_priorisoiva'); });
                    //console.log('*** Priorioivat: ', data);
                    $scope.priorisointiRyhmat = data;
                }
            );

            $scope.poistaHakukohdeRyhmasta = function (hakukohdeRyhma, hakukohde) {
                console.log('*** poista hakukohde ryhmästä *** ', hakukohdeRyhma, hakukohde);
                $modal.open({
                    templateUrl: 'partials/dialogs/poista-hakukohde-ryhmasta-dialog.html',
                    controller: 'PoistaHakukohdeRyhmastaDialogCtrl',
                    scope: $scope,
                    resolve: {
                        hakukohdeRyhma: function () {
                            return hakukohdeRyhma;
                        },
                        hakukohde: function () {
                            return hakukohde;
                        }
                    }
                }).result.then(
                    function (data) {
                        $route.reload();
                    }
                );

            };

            $scope.lisaaHakukohdeRyhmaan = function (hakukohdeRyhma) {
                console.log('*** lisää hakukohde Ryhmään ***', hakukohdeRyhma);
            }

        }]);