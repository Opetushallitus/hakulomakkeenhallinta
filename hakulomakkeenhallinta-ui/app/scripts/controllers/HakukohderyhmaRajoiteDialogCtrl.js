'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakukohderyhmaRajoiteDialogCtrl',
    function ($rootScope, $scope, $modalInstance, TarjontaAPI, applicationForm, Organisaatio, AlertMsg, hakukohdeRyhma, $routeParams, _, ApplicationFormConfiguration, lomakepohja, rajoiteRyhma) {
        $rootScope.LOGS('HakukohderyhmaRajoiteDialogCtrl');

        $scope.hakukohdeRyhmat = [];
        $scope.applicationForm = applicationForm;
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        if(rajoiteRyhma.configurations && rajoiteRyhma.configurations.maximumNumberOf) {
            $scope.hakukohdeRajoite = rajoiteRyhma.configurations.maximumNumberOf;
        }
        /**
         * Haetaan valitusta hakukohderyhmästä tietoja
         * Dialogiin
         */
        TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, hakukohdeRyhma.oid).then(
            function (data) {
                //TODO: tarkista tämä
                $scope.hakukohteidenMaara = data.tuloksia;
            }
        );
        /**
         * Asetetaan hakukohderyhmään hakukohde rajaus
         * @param hakukohdeRajoite rajauksen arvo numerona
         */
            //TODO: tarkista tämä kun back end toimii oikein
        $scope.asetaHakukohdeRajaus = function ( hakukohdeRajoite) {
            if (hakukohdeRajoite > $scope.hakukohteidenMaara) {
                $scope.hakuryhmanRajoite.rajoite.$error.max = true;
            } else if (hakukohdeRajoite !== undefined) {
                //TODO: tähän tallenus kun back end valmis
                ApplicationFormConfiguration.asetaHakukohderyhmaRajoite($routeParams.id, hakukohdeRyhma.oid, hakukohdeRajoite, lomakepohja).then(
                    function success(data) {
                        console.log('## tallennaHakukohderyhmaRajoite: ', data);
                        //$modalInstance.close();
                        //TODO: poista tämä kun back end valmis
                        $modalInstance.close(
                            {
                               maximumNumberOf: hakukohdeRajoite
                            }
                        );
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

    });
