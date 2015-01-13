'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LomakepohjanAsetuksetCtrl', ['$rootScope', '$scope', 'TarjontaAPI', 'Organisaatio', 'AlertMsg', '$routeParams', 'FormEditor', 'ApplicationFormConfiguration', '_', '$filter', '$modal', '$route',
        function ($rootScope, $scope, TarjontaAPI, Organisaatio, AlertMsg, $routeParams, FormEditor, ApplicationFormConfiguration, _, $filter, $modal, $route) {
            $rootScope.LOGS('lomakepohjanAsetuksetCtrl');

            $scope.hakukohdeRyhmat = [];
            $scope.applicationForm = {};
            $scope.naytaRyhmat = false;
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
             * Haetaan tarjonnasta käyttäjän priorisoivat hakukohde ryhmät
             */
            TarjontaAPI.usersApplicationOptionGroups($routeParams.id, Organisaatio.getUserSelectedOrganisation().oid).then(
                function (data) {
                    data = _.filter(data, function (priorisoiva) { return _.contains(priorisoiva.kayttoryhmat, 'hakukohde_priorisoiva'); });
                    $scope.priorisointiRyhmat = data;
                }
            );


        }]);