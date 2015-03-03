'use strict'

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaHakukohdeRyhmaanDialogCtrl',
    function ($scope, $rootScope, TarjontaAPI, Organisaatio, _, $routeParams, $modalInstance, hakukohdeRyhma, AlertMsg, $filter, userLang, LocalisationService) {
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        $scope.hakukohteet = [];
        $scope.enableTallenna = false;
        $scope.autentikoitu = false;
        var lisattavatHakukohteet = [];

        TarjontaAPI.checkTarjontaAuthentication().then(
            function success (data) {
                $scope.autentikoitu = true;
                $rootScope.LOGS('Tarkistetaan autentikaatio Tarjontaa success', data);
            },
            function error (resp) {
                $rootScope.LOGS('Ei oikeutta tarjontaan error', resp);
                $scope.autentikoitu = false;
                AlertMsg($scope, 'warning', 'warning.autenkikaatio.ei.onnistunut.tai.puutuvat.oikeudet.tarjonta.palvelu');
            }
        );

        TarjontaAPI.usersApplicationOptions($routeParams.id, Organisaatio.getUserSelectedOrganisation().oid).then(
            function (data) {
                if (data.length === 0) {
                    AlertMsg($scope, 'warning', 'organisaatiossa.ei.hakukohdetta.hakukohdejoukko');
                } else {
                    $scope.hakukohteet = _.chain(data)
                        .map(function (data) {
                            _.each(data.tulokset, function (tulos) {
                                tulos.tarjoaja = {};
                                tulos.tarjoaja.nimi = data.nimi;
                            });
                            return data.tulokset;
                        })
                        .flatten()
                        .value();
                    $scope.hakukohteet = $filter('orderBy')($scope.hakukohteet, function(kohde) { return $filter('hakukohdeNimi')(kohde, $scope.userLang)}, false);
                }
            }
        );
        $scope.paivitaLisattavienListaa = function (oid, hakukohdeChecked) {
            if (hakukohdeChecked) {
                lisattavatHakukohteet.push(oid);
            } else {
                lisattavatHakukohteet = _.without(lisattavatHakukohteet, oid);
            }
            if (lisattavatHakukohteet.length === 0) {
                $scope.enableTallenna = false;
            } else {
                $scope.enableTallenna = true;
            }
        };
        /**
         * Lisätään valitut hakukohteet
         * valittuun hakukohderyhmään
         * data tallennetaan tarjontaan
         */
        $scope.lisaaHakukohteetRyhmaan = function () {
            if(lisattavatHakukohteet.length !== 0) {
                TarjontaAPI.lisaaHakukohteetRyhmaan(hakukohdeRyhma, lisattavatHakukohteet).then(
                    function success (data) {
                        $modalInstance.close();
                    },
                    function error(resp) {
                        AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                    }
                );
            }
        };

        /**
         * Suljetaan dialogi
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.t = function (key) {
            return LocalisationService.tl(key);
        };
    }
);