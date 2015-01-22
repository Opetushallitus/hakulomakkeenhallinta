'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('MuokkaaHakukohderyhmanRajoitettaDialogCtrl',
    function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, applicationForm, hakukohdeRyhma, rajoiteRyhma, AlertMsg, $routeParams, TarjontaAPI) {
        $scope.applicationForm = applicationForm;
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        //TODO: tarkista tämä kun back end toimii oikein
        $scope.hakukohdeRajoite = 0; //rajoiteRyhma.configuration.maxSelection;

        /**
         * Haetaan valitusta hakukohderyhmästä tietoja
         * Dialogiin
         */
        TarjontaAPI.haeRyhmanHakukohteet($routeParams.id, $scope.hakukohdeRyhma.oid).then(
            function (data) {
                //TODO: tarkista tämä
                $scope.hakukohteidenMaara = data.tuloksia;
            }
        );
        /**
         * Tallennetaan hakukohderyhmään hakukohde rajaus
         * @param hakukohdeRyhmaOid
         * @param hakukohdeRajoite
         */
            //TODO: tarkista tämä kun back end toimii oikein
        $scope.tallennaHakukohdeRajaus = function (hakukohdeRyhmaOid, hakukohdeRajoite) {
            if (hakukohdeRajoite > $scope.hakukohteidenMaara) {
                $scope.hakuryhmanRajoite.rajoite.$error.max = true;
            } else if (hakukohdeRajoite !== undefined) {
                //TODO: tähän tallenus kun back end valmis
                //rajoiteRyhma.configuration.maxSelection = hakukohdeRajoite;
                ApplicationFormConfiguration.tallennaHakukohderyhmaRajoite($routeParams.id, hakukohdeRyhmaOid, hakukohdeRajoite).then(
                    function success(data) {
                        AlertMsg($scope, 'success', 'tallennus.ok');
                        //TODO: poista tämä kun back end valmis
                        $modalInstance.close(rajoiteRyhma);
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

    }
);