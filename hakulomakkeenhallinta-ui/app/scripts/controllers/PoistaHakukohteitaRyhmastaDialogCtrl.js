'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaHakukohteitaRyhmastaDialogCtrl',
    function ($rootScope, $scope, $modalInstance, hakukohdeRyhma, ryhmanHakukohteet, TarjontaAPI, AlertMsg, LocalisationService) {
        $scope.hakukohteet = ryhmanHakukohteet;
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        var poistettavatHakukohteet = [];
        $scope.autentikoitu = false;
        $scope.poistoEiOnnistu = false;

        TarjontaAPI.checkTarjontaAuthentication().then(
            function success (data) {
                $rootScope.LOGS('PoistaHakukohdeRyhmastaDialogCtrl', 'Tarjonta autentikaatio OK ', data);
                $scope.autentikoitu = true;
            },
            function error (resp) {
                $scope.autentikoitu = false;
                AlertMsg($scope, 'warning', 'warning.autenkikaatio.ei.onnistunut.tai.puutuvat.oikeudet.tarjonta.palvelu');
            }
        );
        /**
         * Poistetaan hakukohde hakukohderyhmästä
         * tiedon tallennuspaikka tarjonta palvelu
         */
        $scope.poista = function () {
            TarjontaAPI.poistaHakukohteitaHakukohderyhmasta(hakukohdeRyhma.oid, poistettavatHakukohteet).then(
                function success() {
                    $modalInstance.close();
                },
                function error(resp) {
                    $rootScope.LOGS('PoistaHakukohteitaRyhmastaDialogCtrl', 'poista', resp.status);
                    $scope.poistoEiOnnistu = true;
                    AlertMsg($scope, 'warning', 'error.poisto.epaonnistui');
                }
            );
        };
        $scope.paivitaPoistettavienListaa = function (oid, hakukohdeChecked) {
            if (hakukohdeChecked) {
                poistettavatHakukohteet.push(oid);
            } else {
                poistettavatHakukohteet = _.without(poistettavatHakukohteet, oid);
            }
            if (poistettavatHakukohteet.length === 0) {
                $scope.poistoEiOnnistu = false;
            } else {
                $scope.poistoEiOnnistu = true;
            }
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.t = function (key) {
            return LocalisationService.tl(key);
        };
    }
);



