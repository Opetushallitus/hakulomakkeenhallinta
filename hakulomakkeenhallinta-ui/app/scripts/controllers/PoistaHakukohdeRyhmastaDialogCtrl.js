'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaHakukohdeRyhmastaDialogCtrl',
    function ($rootScope, $scope, $modalInstance, hakukohdeRyhma, hakukohde, TarjontaAPI, AlertMsg, LocalisationService) {
        $scope.hakukohde = hakukohde;
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        $scope.poistoEiOnnistu = false;
        TarjontaAPI.checkTarjontaAuthentication().then(
            function success (data) {
                //TODO: poista logitukset kun ei tarvetta
                console.log('***** TARKISTETAAN AUTENTIKAATIO: ', data);
            },
            function error (resp) {
                //TODO: poista logitukset kun ei tarvetta
                console.log('***** EI OIKEUTTA ', resp);
                $scope.poistoEiOnnistu = true;
                AlertMsg($scope, 'warning', 'warning.autenkikaatio.ei.onnistunut.tai.puutuvat.oikeudet.tarjonta.palvelu');
            }
        );
        /**
         * Poistetaan hakukohde hakukohderyhmästä
         * tiedon tallennuspaikka tarjonta palvelu
         */
        $scope.poista = function () {
            TarjontaAPI.poistaHakukohdeRyhmasta(hakukohdeRyhma, hakukohde).then(
                function success() {
                    $modalInstance.close();
                },
                function error(resp) {
                    $rootScope.LOGS('PoistaHakukohdeRyhmastaDialogCtrl', 'poista', resp.status);
                    $scope.poistoEiOnnistu = true;
                    AlertMsg($scope, 'warning', 'error.poisto.epaonnistui');
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.t = function (key) {
            return LocalisationService.tl(key);
        };
    }
);



