'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('PoistaHakukohderyhmaRajoiteDialogCtrl', ['$rootScope', '$scope', 'ApplicationFormConfiguration', '$modalInstance', 'hakukohdeRyhma', 'rajoiteRyhma', 'AlertMsg', '$routeParams',
        function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, hakukohdeRyhma, rajoiteRyhma, AlertMsg, $routeParams) {

            $scope.hakukohdeRyhma = hakukohdeRyhma;
            console.log(rajoiteRyhma);
            $scope.poistoEiOnnistu = false;
            $scope.poista = function () {
                ApplicationFormConfiguration.poistaHakukohderyhmaRajoite($routeParams.id, rajoiteRyhma).then(
                    function success (data) {
                        $modalInstance.close(rajoiteRyhma);
                    },
                    function error (resp) {
                        //TODO: tee lokalisointi tälle
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

        }]);