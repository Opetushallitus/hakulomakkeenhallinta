'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakukohderyhmaRajoiteDialogCtrl',
    function ($rootScope, $scope, $modalInstance, TarjontaAPI, haku, applicationForm, AlertMsg, hakukohdeRyhma, $routeParams, ApplicationFormConfiguration, rajoiteRyhma, LocalisationService) {
        $rootScope.LOGS('HakukohderyhmaRajoiteDialogCtrl');

        $scope.hakukohdeRyhmat = [];
        $scope.applicationForm = applicationForm;
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        if(rajoiteRyhma.configurations && rajoiteRyhma.configurations.maximumNumberOf) {
            $scope.hakukohdeRajoite = parseInt(rajoiteRyhma.configurations.maximumNumberOf);
        }
        /**
         * Haetaan valitusta hakukohderyhmästä tietoja
         * Dialogiin
         */
        TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, hakukohdeRyhma.oid).then(
            function (data) {
                $scope.hakukohteidenMaara = data.length;
            }
        );
        /**
         * Asetetaan hakukohderyhmään hakukohde rajaus
         * @param hakukohdeRajoite rajauksen arvo numerona
         */
        $scope.asetaHakukohdeRajaus = function (hakukohdeRajoite) {
            if (hakukohdeRajoite > $scope.hakukohteidenMaara) {
                $scope.hakuryhmanRajoite.rajoite.$error.max = true;
            } else if (hakukohdeRajoite !== undefined) {
                ApplicationFormConfiguration.asetaHakukohderyhmaRajoite(haku, hakukohdeRyhma.oid, hakukohdeRajoite).then(
                    function success(data) {
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
    });
