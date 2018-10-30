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
            $scope.showLiiteRyhmat = false;

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
                nimi: hakuPromise.then(fetchHaunNimi),
                lomakepohjat: hakuPromise.then(ApplicationFormConfiguration.haeLomakepohjat),
                lomakepohjanAsetukset: hakuPromise.then(ApplicationFormConfiguration.haeLomakepohjanAsetukset)
            }).then(function (o) {
                if (o.haku.ataruLomake) {
                    $scope.showLiiteRyhmat = false;
                    $scope.lomakepohjaChangeAllowed = false;
                } else {
                    $scope.showLiiteRyhmat = true;
                    $scope.lomakepohjaChangeAllowed = o.hasRight;
                }
                $scope.haku = o.haku;
                $scope.rajoiteRyhmat = filterGroupConfigurations(o.lomakepohjanAsetukset, 'hakukohde_rajaava');
                $scope.priorisointiRyhmat = filterGroupConfigurations(o.lomakepohjanAsetukset, 'hakukohde_priorisoiva');
                $scope.liiteRyhmat = filterGroupConfigurations(o.lomakepohjanAsetukset, 'hakukohde_liiteosoite');
                $scope.lomakepohja = _.find(o.lomakepohjat, function (pohja) { if (pohja.id === o.lomakepohjanAsetukset.formTemplateType) { return pohja; }});
                $scope.lomakepohjat = $filter('orderBy')(_.without(o.lomakepohjat, $scope.lomakepohja), 'name.translations.' + $scope.userLang);
                $scope.applicationForm = o.nimi;
            }, function (e) {
                $rootScope.LOGS('lomakepohjanAsetuksetCtrl', e);
                AlertMsg($scope, 'error', 'error.lomakepohjan.asetusten.haku.ei.onnistu');
            });

            function filterByType(type) {
                return function (conf) {
                    return conf.type === type
                }
            }

            function filterGroupConfigurations(lomakepohjanAsetukset, type) {
                return _.filter(lomakepohjanAsetukset.groupConfigurations, filterByType(type))
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