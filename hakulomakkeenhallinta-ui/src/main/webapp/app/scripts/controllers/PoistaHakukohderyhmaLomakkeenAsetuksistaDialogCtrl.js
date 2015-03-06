'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaHakukohdeRyhmaLomakkeenAsetuksistaDialogCtrl',
    function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, hakukohdeRyhma, poistettava, AlertMsg, $routeParams, LocalisationService) {

        $scope.hakukohdeRyhma = hakukohdeRyhma;
        $scope.poistoEiOnnistu = false;

        /**
         * Poistaa hakukohderyhmän lomakkeen asetuksista
         */
        $scope.poista = function () {
            ApplicationFormConfiguration.poistaHakukohderyhmaLomakkeenAsetuksista($routeParams.id, poistettava).then(
                function success (data) {
                    $rootScope.LOGS('PoistaHakukohdeRyhmaLomakkeenAsetuksistaDialogCtrl \n',
                        'poistaHakukohderyhmaLomakkeenAsetuksista()', data);
                    $modalInstance.close();
                },
                function error (resp) {
                    $rootScope.LOGS('PoistaHakukohdeRyhmaLomakkeenAsetuksistaDialogCtrl', resp);
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