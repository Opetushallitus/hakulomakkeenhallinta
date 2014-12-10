'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('MuokkaaHakukohderyhmanRajoitettaDialogCtrl', ['$rootScope', '$scope', 'ApplicationFormConfiguration', '$modalInstance', 'applicationForm', 'hakukohdeRyhma', 'rajoiteRyhma', 'AlertMsg', '$routeParams', 'TarjontaAPI',
        function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, applicationForm, hakukohdeRyhma, rajoiteRyhma, AlertMsg, $routeParams, TarjontaAPI) {
            $scope.applicationForm = applicationForm;
            $scope.hakukohdeRyhma = hakukohdeRyhma;
            $scope.hakukohdeRajoite = rajoiteRyhma.configuration.maxSelection;

            /**
             * Haetaan valitusta hakukohderyhmästä tietoja
             * Dialogiin
             */
            TarjontaAPI.haeRyhmanHakukohteet($scope.hakukohdeRyhma.oid).then(
                function (data) {
                    $scope.hakukohteidenMaara = data.tuloksia;
                }
            );
            /**
             * Tallennetaan hakukohderyhmään hakukohde rajaus
             * @param hakukohdeRyhmaOid
             * @param hakukohdeRajoite
             */
            $scope.tallennaHakukohdeRajaus = function (hakukohdeRyhmaOid, hakukohdeRajoite) {
                if (hakukohdeRajoite > $scope.hakukohteidenMaara) {
                    $scope.hakuryhmanRajoite.rajoite.$error.max = true;
                } else if (hakukohdeRajoite !== undefined) {
                    //TODO: tähän tallenus kun back end valmis
                    rajoiteRyhma.configuration.maxSelection = hakukohdeRajoite;
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

        }]);