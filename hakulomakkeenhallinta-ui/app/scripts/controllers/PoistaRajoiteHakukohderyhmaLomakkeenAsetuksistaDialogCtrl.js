'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaRajoiteHakukohderyhmaLomakkeenAsetuksistaDialogCtrl',
    function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, hakukohdeRyhma, rajoiteRyhma, AlertMsg, $routeParams, lomakepohja, LocalisationService) {

        $scope.hakukohdeRyhma = hakukohdeRyhma;
        console.log(rajoiteRyhma);
        $scope.poistoEiOnnistu = false;
        /**
         * Poistaa hakukohderyhmä lomakkeen asetuksista
         */
        $scope.poista = function () {
            //TODO: tarkista tämä kun back end toimii oikein
            ApplicationFormConfiguration.poistaHakukohderyhmaLomakkeenAsetuksista($routeParams.id, rajoiteRyhma).then(
                function success (data) {
                    //TODO: tarkista tämä kun backend toimii oikein
                    $modalInstance.close(rajoiteRyhma);
                },
                function error (resp) {
                    $rootScope.LOGS('poistaHakukohderyhmaLomakkeenAsetuksista', resp);
                    AlertMsg($scope, 'warning', 'error.poisto.epaonnistui');
                    $scope.poistoEiOnnistu = true;
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