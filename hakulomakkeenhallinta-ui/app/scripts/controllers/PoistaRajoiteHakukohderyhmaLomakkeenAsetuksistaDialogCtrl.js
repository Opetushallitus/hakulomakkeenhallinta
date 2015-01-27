'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaRajoiteHakukohderyhmaLomakkeenAsetuksistaDialogCtrl',
    function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, hakukohdeRyhma, rajoiteRyhma, AlertMsg, $routeParams, LocalisationService) {

        $scope.hakukohdeRyhma = hakukohdeRyhma;
        $scope.poistoEiOnnistu = false;
        /**
         * Poistaa hakukohderyhmä lomakkeen asetuksista
         */
        $scope.poista = function () {
            ApplicationFormConfiguration.poistaHakukohderyhmaLomakkeenAsetuksista($routeParams.id, rajoiteRyhma).then(
                function success (data) {
                    $rootScope.LOGS('PoistaRajoiteHakukohderyhmaLomakkeenAsetuksistaDialogCtrl \n',
                        'poistaHakukohderyhmaLomakkeenAsetuksista()', data);
                    $modalInstance.close();
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