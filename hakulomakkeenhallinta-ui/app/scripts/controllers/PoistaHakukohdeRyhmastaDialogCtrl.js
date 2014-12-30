'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaHakukohdeRyhmastaDialogCtrl', function ($rootScope, $scope, $modalInstance, hakukohdeRyhma, hakukohde, TarjontaAPI, AlertMsg) {
        $scope.hakukohde = hakukohde;
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        $scope.poistoEiOnnistu = false;
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
    });



