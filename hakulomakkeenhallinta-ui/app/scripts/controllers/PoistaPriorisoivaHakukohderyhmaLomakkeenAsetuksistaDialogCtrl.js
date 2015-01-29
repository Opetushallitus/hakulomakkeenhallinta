'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaPriorisoivaHakukohderyhmaLomakkeenAsetuksistaDialogCtrl',
    function ($rootScope, $scope, TarjontaAPI, $modalInstance, hakukohdeRyhma, poistettavat, AlertMsg, $routeParams, LocalisationService) {

        $scope.hakukohdeRyhma = hakukohdeRyhma;
        $scope.poistoEiOnnistu = false;

        TarjontaAPI.checkTarjontaAuthentication().then(
            function success (data) {
                $rootScope.LOGS('Tarkistetaan autentikaatio Tarjontaa success', data);
            },
            function error (resp) {
                $rootScope.LOGS('Ei oikeutta tarjontaan error', resp);
                $scope.poistoEiOnnistu = true;
                AlertMsg($scope, 'warning', 'warning.autenkikaatio.ei.onnistunut.tai.puutuvat.oikeudet.tarjonta.palvelu');
            }
        );
        /**
         * Poistaa hakukohderyhmä lomakkeen asetuksista
         */
        $scope.poista = function () {
            TarjontaAPI.poistaHakukohteitaHakukohderyhmasta(hakukohdeRyhma.oid, poistettavat).then(
                function success (data) {
                    $rootScope.LOGS('PoistaPriorisoivaHakukohderyhmaLomakkeenAsetuksistaDialogCtrl', data);
                    $modalInstance.close();
                }, function error (resp) {
                    $rootScope.LOGS('PoistaPriorisoivaHakukohderyhmaLomakkeenAsetuksistaDialogCtrl', resp);
                    $scope.poistoEiOnnistu = true;
                    AlertMsg($scope, 'error', 'error.poisto.epaonnistui');
                }
            );
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