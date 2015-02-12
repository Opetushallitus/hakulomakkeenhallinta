'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LomakepohjanAsetuksetCtrl',
        function ($rootScope, $scope, MyRoles, TarjontaAPI, AlertMsg, $routeParams, FormEditor, ApplicationFormConfiguration, _, $filter, $modal, $route) {
            $rootScope.LOGS('lomakepohjanAsetuksetCtrl');
            $scope.applicationForm = {};
            $scope.lomakepohjat = [];
            $scope.lomakepohja = {};
            $scope.rajoiteRyhmat = [];
            $scope.priorisointiRyhmat = [];

            MyRoles.lomakepohjaChangeRightCheck().then(
                function (data) {
                    $scope.lomakepohjaChangeAllowed = data === true;
                }
            );
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
                    $scope.lomakepohjat = $filter('orderBy')(lomakepohjat, 'name.translations.' + $scope.userLang);
                    lomakePohjanAsetukset();
                }
            );
            /**
             * heataan lomakepohjan asetukset
             */
            function lomakePohjanAsetukset() {
                ApplicationFormConfiguration.haeLomakepohjanAsetukset($routeParams.id).then(
                    function success(lomakepohjanAsetukset) {
                        $scope.rajoiteRyhmat = _.filter(lomakepohjanAsetukset.groupConfigurations, function (conf) { return conf.type === 'hakukohde_rajaava'; });
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
             * Haetaan tarjonnasta hakuun liittyvät priorisoivat hakukohde ryhmät
             */
            TarjontaAPI.getHakuApplicatioOptionGroups($routeParams.id).then(
                function (data) {
                    data = _.filter(data, function (priorisoiva) { return _.contains(priorisoiva.kayttoryhmat, 'hakukohde_priorisoiva'); });
                    $scope.priorisointiRyhmat = data;
                }
            );
        }
);