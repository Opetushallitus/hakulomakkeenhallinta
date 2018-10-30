'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LomakepohjanAsetuksetCtrl',
        function ($rootScope, $scope, MyRoles, TarjontaAPI, AlertMsg, $routeParams, FormEditor, ApplicationFormConfiguration, _, $filter, $modal, $route, $q) {
            $rootScope.LOGS('lomakepohjanAsetuksetCtrl');
            $scope.applicationForm = {};
            $scope.lomakepohjat = [];
            $scope.lomakepohja = {};
            $scope.rajoiteRyhmat = [];
            $scope.priorisointiRyhmat = [];
            $scope.liiteRyhmat = [];
            $scope.haku = {};

            var hakuPromise = TarjontaAPI.fetchHaku($routeParams.id);

            var fetchHaunNimi = function (haku) {
                if (haku.ataruLomake) {
                    return {
                        name: {
                            translations: {
                                fi: haku.nimi.kieli_fi,
                                sv: haku.nimi.kieli_sv,
                                en: haku.nimi.kieli_en
                            }
                        }
                    };
                } else {
                    return FormEditor.fetchApplicationSystemForm(haku.oid)
                }
            };

            $q.all({
                hasRight: MyRoles.lomakepohjaChangeRightCheck(),
                haku: hakuPromise,
                nimi: hakuPromise.then(fetchHaunNimi)
            }).then(function (o) {
                if (o.haku.ataruLomake) {
                    $scope.lomakepohjaChangeAllowed = false;
                } else {
                    $scope.lomakepohjaChangeAllowed = o.hasRight;
                }
                $scope.haku = o.haku;
                $scope.applicationForm = o.nimi;
            });

            /**
             * haetaan lomakepohjat taustajärjestelmästä
             */
            ApplicationFormConfiguration.haeLomakepohjat().then(
                function (lomakepohjat) {
                    $scope.lomakepohjat = $filter('orderBy')(lomakepohjat, 'name.translations.' + $scope.userLang);
                    lomakePohjanAsetukset();
                }
            );

            function filterByType(type) {
                return function (conf) {
                    return conf.type === type
                }
            }

            function filterGroupConfigurations(lomakepohjanAsetukset, type) {
                return _.filter(lomakepohjanAsetukset.groupConfigurations, filterByType(type))
            }
            /**
             * heataan lomakepohjan asetukset
             */
            function lomakePohjanAsetukset() {
                ApplicationFormConfiguration.haeLomakepohjanAsetukset($routeParams.id).then(
                    function success(lomakepohjanAsetukset) {
                        $scope.rajoiteRyhmat = filterGroupConfigurations(lomakepohjanAsetukset, 'hakukohde_rajaava');
                        $scope.priorisointiRyhmat = filterGroupConfigurations(lomakepohjanAsetukset, 'hakukohde_priorisoiva');
                        $scope.liiteRyhmat = filterGroupConfigurations(lomakepohjanAsetukset, 'hakukohde_liiteosoite');
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
                        haku: function () {
                            return $scope.haku;
                        },
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
        }
);